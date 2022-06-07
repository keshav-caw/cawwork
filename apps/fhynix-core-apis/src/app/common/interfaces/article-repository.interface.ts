import { ArticleModel } from "../models/article.model";
import { ArticlePaginationModel } from "../models/article-pagination.model";
import { ArticleBookmarkModel } from "../models/articleBookmark.model";

export interface ArticleRepositoryInterface {
  getArticles(details:ArticlePaginationModel): Promise<ArticleModel[]>
  addArticle(newArticle):Promise<ArticleModel>
  getArticleDetailsById(articleId):Promise<ArticleModel>
  getBookmarks(userId:string):Promise<ArticleBookmarkModel>
  upsertBookmarks(userId:string,bookmarks:ArticleBookmarkModel):Promise<ArticleBookmarkModel>
}
