import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { ArticleRepositoryInterface } from '../../common/interfaces/article-repository.interface'
import { ArticleModel } from '../../common/models/article.model'
import { ArticlePaginationModel } from '../../common/models/article-pagination.model'

@injectable()
export class ArticleRepository implements ArticleRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getArticles(details:ArticlePaginationModel): Promise<ArticleModel[]> {
      
    const result = await this.client.articles?.findMany({
        skip:(details.pageNumber-1)*(details.pageSize),
        take:details.pageSize
    },
    {
      select: {
        title: true,
        imageUrl:true,
        url:true
      }
    })
    
    return result ? result : []
  }

  async addArticle(newArticle) {

    const article:ArticleModel = await this.client.articles?.create({
        data: newArticle,
    })

    return article;
  }
}
