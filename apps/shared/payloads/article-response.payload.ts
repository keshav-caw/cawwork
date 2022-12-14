import { ResponsePayloadBase } from "./base-response.payload";

export class ArticleResponsePayload extends ResponsePayloadBase {
    id:string
    title: string
    imageUrl:string
    url:string
    description?:string
    activityIds?:string[]
    constructor(id,title,imageUrl,url,description='',activityIds=[]){
        super()
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.url = url;
        this.description = description;
        this.activityIds = activityIds;
    }
}