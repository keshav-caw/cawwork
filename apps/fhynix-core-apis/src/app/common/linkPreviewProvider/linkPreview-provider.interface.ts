import { ArticleModel } from "../models/article.model";

export interface LinkPreviewProviderInterface{
    getPreview(url:string):Promise<ArticleModel>
}