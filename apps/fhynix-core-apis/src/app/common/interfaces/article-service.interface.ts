import { ArticleModel } from "../models/article-model";

export interface ArticleServiceInterface {
  getArticles(): Promise<ArticleModel[]>
}
