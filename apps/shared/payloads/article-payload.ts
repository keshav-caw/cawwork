import { PayloadBase } from "./base-payload";

export class ArticlePayload extends PayloadBase {
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
  