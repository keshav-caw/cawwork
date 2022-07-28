import { ArticleModel } from "../models/article.model";
import { PaginationModel } from "../models/pagination.model";
import { ArticleBookmarkModel } from "../models/articleBookmark.model";

export interface ArticleRepositoryInterface {
  getArticles(details:PaginationModel): Promise<ArticleModel[]>
  getArticlesAssociatedToActivityId(activityId:string,details:PaginationModel): Promise<ArticleModel[]>
  getNewArticlesForSuggestion(userId:string,activityId:string,numberOfArticles:number):Promise<ArticleModel[]>
  getArticle7DaysFromNow(userId:string,activityId:string,numberOfArticles:number):Promise<ArticleModel[]>
  getMostRecent50Articles():Promise<ArticleModel[]>
  addArticle(newArticle):Promise<ArticleModel>
  getArticlesBookmarkedByUser(userId:string):Promise<ArticleModel[]>
  upsertBookmark(bookmark:ArticleBookmarkModel):Promise<ArticleBookmarkModel>
  removeBookmark(bookmark:ArticleBookmarkModel):Promise<ArticleBookmarkModel>
}
