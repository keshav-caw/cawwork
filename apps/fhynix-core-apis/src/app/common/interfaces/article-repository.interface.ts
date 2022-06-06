import { ArticleModel } from "../models/article.model";
import { ArticlePaginationModel } from "../models/article-pagination.model";

export interface ArticleRepositoryInterface {
  getArticles(details:ArticlePaginationModel): Promise<ArticleModel[]>
  addArticle(newArticle):Promise<ArticleModel>
}
