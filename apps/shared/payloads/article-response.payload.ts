import { ResponsePayloadBase } from "./base-response.payload";

export class ArticleResponsePayload extends ResponsePayloadBase {
    id:string
    title: string
    imageUrl:string
    url:string
    constructor(id,title,imageUrl,url){
        super()
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.url = url;
    }    
}
  