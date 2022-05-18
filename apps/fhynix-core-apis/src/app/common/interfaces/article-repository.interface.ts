import { ArticleModel } from "../models/article-model";

export interface ArticleRepositoryInterface {
  getArticles(): Promise<ArticleModel[]>
}
