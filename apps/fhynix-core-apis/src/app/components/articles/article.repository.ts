import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { ArticleRepositoryInterface } from '../../common/interfaces/article-repository.interface'
import { ArticleModel } from '../../common/models/article-model'

@injectable()
export class ArticleRepository implements ArticleRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getArticles(): Promise<ArticleModel[]> {
    const result = await this.client.articles?.findMany({
      select: {
        id: false,
        title: true,
        imageUrl:true,
        articleUrl:true
      },
    })
    return result ? result : []
  }
}
