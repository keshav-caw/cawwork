import { ResponsePayloadBase } from "./base-response.payload";
import {ArticleResponsePayload} from './article-response.payload'

export class ActivityToArticlesResponsePayload extends ResponsePayloadBase {
    activityId:string
    articles: ArticleResponsePayload[]
    constructor(activityId,articles){
        super()
        this.activityId = activityId;
        this.articles = articles;
    }
}