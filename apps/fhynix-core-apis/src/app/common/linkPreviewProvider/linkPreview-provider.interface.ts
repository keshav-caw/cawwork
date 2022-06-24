import { ArticleModel } from "../models/article.model";
import { LinkPreviewModel } from "../models/linkPreview.model";

export interface LinkPreviewProviderInterface{
    getPreview(url:string):Promise<LinkPreviewModel>
}