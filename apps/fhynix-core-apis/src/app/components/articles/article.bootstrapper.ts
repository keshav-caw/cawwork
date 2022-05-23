import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { ArticleRepositoryInterface } from '../../common/interfaces/article-repository.interface'
import { ArticleServiceInterface } from '../../common/interfaces/article-service.interface'
import { ArticleController } from './article.controller'
import { ArticleRepository } from './article.repository'
import { ArticleTypes } from './article.types'
import { ArticleService } from './articles.service'

@injectable()
export default class ArticleBootstrapper {
  public static initialize() {
      CommonContainer.bind<ArticleServiceInterface>(ArticleTypes.articles).to(ArticleService)
      CommonContainer.bind<ArticleRepositoryInterface>('ArticleRepository').to(ArticleRepository)
      CommonContainer.bind<ArticleController>('ArticleController').to(ArticleController)
  }
}
