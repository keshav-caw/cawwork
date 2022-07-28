import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../../common/data/datastore'
import { ArticleRepositoryInterface } from '../../../common/interfaces/article-repository.interface'
import { ArticleModel } from '../../../common/models/article.model'
import { PaginationModel } from '../../../common/models/pagination.model'

@injectable()
export class ArticleRepository implements ArticleRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getArticles(details:PaginationModel): Promise<ArticleModel[]> {
      
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

  async getArticlesAssociatedToActivityId(activityId:string,details:PaginationModel): Promise<ArticleModel[]> {
      
    const result = await this.client.articles?.findMany({
        skip:(details.pageNumber-1)*(details.pageSize),
        take:details.pageSize,
        where:{
            activityIds:{
              hasSome:activityId
            }
        },
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

  async getArticle7DaysFromNow(userId:string,activityId:string,numberOfArticles:number){
    const result = await this.client.$queryRaw`SELECT id,title,url,description,image_url AS "imageUrl",activity_ids as "activityIds" FROM public."Articles"
    WHERE id IN (SELECT article_id
    FROM public."UserArticlesShown"
    WHERE user_id=${userId} AND activity_id=${activityId} AND shown_at + INTERVAL '7 DAYS' >= NOW()
    ORDER BY shown_at  DESC)
    Limit ${numberOfArticles}`;
    return result;
  }

  async getNewArticlesForSuggestion(userId:string,activityId:string,numberOfArticles:number){
    const result = await this.client.$queryRaw`SELECT id,title,url,description,image_url AS "imageUrl",activity_ids as "activityIds"
    from public."Articles" 
    WHERE ${activityId}=ANY(activity_ids) AND 
    id NOT IN (SELECT article_id FROM public."UserArticlesShown" WHERE user_id=${userId} AND activity_id=${activityId})
    Limit ${numberOfArticles}`;
    return result;
  }

  async addShownArticles(userId:string,articleId:string,activityId:string){
    await this.client.userArticlesShown.create({
      data:{
        userId,articleId,activityId
      }
    })
  }

  async getMostRecent50Articles():Promise<ArticleModel[]>{
    const result = await this.client.articles?.findMany({
      take:50,
      where:{
        isDeleted:false,
      },
      orderBy:{
        createdAtUtc:'asc'
      }
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

  async getArticlesBookmarkedByUser(userId){
    const bookmarkedArticles = await this.client.articlesBookmarked?.findMany({
      where: {
        userId: userId,
        isDeleted:false,
      },
    })
    const result = [];
    for(const bookmark of bookmarkedArticles){
      const article:ArticleModel = await this.client.articles?.findUnique({
        where:{
          id:bookmark.articleId
        },
        select:{
          id:true,
          title: true,
          imageUrl:true,
          url:true,
          activityIds:true
        }
      })
      result.push(article);
    }

    return result;
  }

  async upsertBookmark(bookmark){
    const result = await this.client.articlesBookmarked?.upsert({
      where: {
        userId_articleId:{
          userId:bookmark.userId,
          articleId:bookmark.articleId
        }
      },
      update: bookmark,
      create: bookmark,
    });
    return result
  }

  async removeBookmark(bookmark){
    const result = await this.client.articlesBookmarked?.update({
      data: bookmark,
      where: {
        userId_articleId:{
          userId:bookmark.userId,
          articleId:bookmark.articleId
        }
      },
    })
    return result;
  }
}
