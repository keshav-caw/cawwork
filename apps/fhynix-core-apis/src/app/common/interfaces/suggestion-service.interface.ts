import { ArticleModel } from "../models/article.model";
import { PaginationModel } from "../models/pagination.model";
import { ArticleBookmarkModel } from "../models/articleBookmark.model";
import { ProductModel } from "../models/product.model";

export interface SuggestionServiceInterface {
  getArticles(details:PaginationModel):Promise<ArticleModel[]>
  addArticle(url:string,activityIds:string[]):Promise<ArticleModel>
  getBookmarks(userId:string):Promise<ArticleModel[]>
  addBookmark(userId:string,articleId:string):Promise<ArticleBookmarkModel>
  removeBookmark(userId:string,articleId:string):Promise<ArticleBookmarkModel>
  addProduct(url:string,price:string,activityIds:string[]):Promise<ProductModel>
}
