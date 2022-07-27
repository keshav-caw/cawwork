import * as express from 'express'
import {
  interfaces,
  controller,
  httpPost,
  request,
  response,
  httpGet,
  next,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { SuggestionTypes } from '../suggestion.types'
import { SuggestionService } from '../services/suggestion.service'
import { CommonTypes } from '../../../common/common.types'
import { RepeatModeResponsePayload } from 'apps/shared/payloads/repeat-mode-response.payload'

import { CommonContainer } from '../../../common/container'
import { RequestContext } from '../../../common/jwtservice/requests-context.service'
import { ArticleService } from '../services/articles.service'
import { ArticleResponsePayload } from 'apps/shared/payloads/article-response.payload'
import { TaskModel } from '../../../common/models/task.model'
import { PaginatedResponsePayload } from 'apps/shared/payloads/api-paginated-response.payload'
import { TaskResponsePayload } from 'apps/shared/payloads/task-response.payload'
import { UtilityTypes } from '../../utilities/utility.types'
import { ModelPayloadHelper } from '../../utilities/model-payload.helper'


@controller('/suggestions')
export class SuggestionController implements interfaces.Controller {
  private readonly requestContext = CommonContainer.get<RequestContext>(
    CommonTypes.requestContext,
  )
  constructor(
    @inject(SuggestionTypes.suggestions) private suggestionService: SuggestionService,
    @inject(SuggestionTypes.articles) private articleService: ArticleService,
    @inject(UtilityTypes.modelPayloadHelper) private modelPayloadHelper: ModelPayloadHelper,
  ) {}

  @httpGet('/articles', CommonTypes.jwtAuthMiddleware)
  private async getArticlesToSuggest(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const userId = this.requestContext.getUserId();

    const articles = await this.articleService.getArticlesToSuggest(userId);
    const details = [];
    for (const article of articles) {
      const newArticle = new ArticleResponsePayload(
        article.id,
        article.title,
        article.imageUrl,
        article.url,
      )
      details.push(newArticle)
    }
    res.send(details)
  }

  @httpGet('/',CommonTypes.jwtAuthMiddleware)
  public async getSuggestions(
    @request() req: express.Request,
    @response() res: express.Response,
  ){
    const userId = this.requestContext.getUserId();
    const latitude = +req.params.latitude;
    const longitude = +req.params.longitude;

    const tasks:TaskModel[] = await this.suggestionService.getSuggestions(userId,latitude,longitude);
    const taskResponsePayloads = new PaginatedResponsePayload<TaskResponsePayload> ([]);
    for(const task of tasks){
      const suggestionPayload = this.modelPayloadHelper.suggestionResponsePayloadFromModel(task.suggestions);
      const repeatMode = task.repeatMode;
      const repeatModePayload = new RepeatModeResponsePayload(repeatMode?.repeatDuration,repeatMode?.repeatOnWeekDays,repeatMode?.repeatOnDays);
      const taskResponsePayload = new TaskResponsePayload(task.id,task.relationshipId,task.title,repeatModePayload,suggestionPayload);
      taskResponsePayloads.add(taskResponsePayload);
    }
    res.send(taskResponsePayloads);
  }

}
