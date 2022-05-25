import { ResponsePayloadBase } from "./base-response.payload";

export class ArticleResponsePayload extends ResponsePayloadBase {
    title: string
    imageUrl:string
    url:string
    constructor(title,imageUrl,url){
        super()
        this.title = title;
        this.imageUrl = imageUrl;
        this.url = url;
    }    
}
  