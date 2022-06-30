import * as express from 'express'
import {
  interfaces,
  controller,
  httpGet,
  request,
  response,
  next,
  httpPost,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { JWTService } from '../../common/jwtservice/jwt.service'
import { CommonTypes } from '../../common/common.types'
import { ActivityService } from './activity.service'
import { ActivityTypes } from './activity.types'
import { RequestContext } from '../../common/jwtservice/requests-context.service'
import { TaskService } from '../task/task.service'
import { TaskTypes } from '../task/task.types'
import dayjs from 'dayjs'

@controller('/activities')
export class ActivityController implements interfaces.Controller {
  constructor(
    @inject(ActivityTypes.activity) private activityService: ActivityService,
    @inject(CommonTypes.requestContext)
    private requestContext: RequestContext,
    @inject(TaskTypes.task)
    private taskService: TaskService,
  ) {}

  @httpGet('/', CommonTypes.jwtAuthMiddleware)
  public async getActivitiesByRelationship(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    let details
    if (req.query.canBeHabit) {
      details = await this.activityService.getActivityByRelationship(
        req.query.relationship.toString(),
      )
    } else {
      details = await this.activityService.getAllActivities()
    }

    return res.send(details)
  }

  @httpPost('/', CommonTypes.jwtAuthMiddleware)
  private async createRelationshiActivity(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const userId = this.requestContext.getUserId()
    const activities =
      await this.activityService.createActivitiesForRelationship(
        req.body,
        userId,
      )
    const selectedActvitiesForRelationCalls = []
    activities.forEach(async (activity) => {
      selectedActvitiesForRelationCalls.push(
        this.activityService.getActivityByRelationshipAndName(
          activity.appliesForRelation[0],
          activity.name,
        ),
      )
    })
    const selectedActvitiesForRelations = await Promise.all(
      selectedActvitiesForRelationCalls,
    )

    const calls = []
    activities.forEach(async (activity, index) => {
      const selectedActvitiesForRelation = selectedActvitiesForRelations[index]
      const task = {
        familyMemberId: activity.familyMemberId,
        relationshipId: selectedActvitiesForRelation[0]?.id,
        userId: userId,
        title: activity.name,
        startAtUtc: dayjs().add(1, 'day').toISOString(),
        endAtUtc: dayjs().add(1, 'day').toISOString(),
        recurringStartAtUtc: dayjs().add(1, 'day').toISOString(),
        notifyAtUtc: dayjs().add(1, 'day').add(-10, 'minutes').toISOString(),
        status: 'Not-Started',
        type: 'UKNOWN',
        activityId: activity.activityId,
        invites: [],
        checklist: [],
      }
      calls.push(this.taskService.createTasksForActvity(activity, task, userId))
    })
    const selectedTasks = await Promise.all(calls)

    res.send(activities)
  }
}
