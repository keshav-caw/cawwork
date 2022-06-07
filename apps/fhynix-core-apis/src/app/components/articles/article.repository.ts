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
        id:true,
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

  async getArticleDetailsById(articleId){
    const article = await this.client.articles?.findUnique({
      where:{
        id:articleId
      },
      select:{
        id:true,
        title: true,
        imageUrl:true,
        url:true
      }
    })
    return article;
  }

  async getBookmarks(userId){
    const articles_bookmarkeds = await this.client.articles_bookmarked?.findMany({
      where: {
        userId: userId
      },
    })

    return articles_bookmarkeds.length>0 ? articles_bookmarkeds[0] : {userId,articleIds:[]};
  }

  async upsertBookmarks(userId,bookmarks){
    const result = await this.client.articles_bookmarked?.upsert({
      where: {
        userId: userId,
      },
      update: {
        articleIds: bookmarks.articleIds,
      },
      create: {
        userId: userId,
        articleIds: bookmarks.articleIds,
      },
    });
    return result
  }
}
