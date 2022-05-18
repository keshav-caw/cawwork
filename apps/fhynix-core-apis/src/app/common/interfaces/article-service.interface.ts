import { ArticleModel } from "../models/article-model";
import { ArticlePaginationModel } from "../models/article-pagination-model";

export interface ArticleServiceInterface {
  getArticles(details:ArticlePaginationModel)
}
