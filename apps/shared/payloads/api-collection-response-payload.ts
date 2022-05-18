import { PayloadBase } from "./base-payload";
import { ArticlePayload } from "./article-payload";

export class CollectionResponsePayload extends PayloadBase { 
    data:ArticlePayload[]
    constructor(){
        super()
        this.data = []
    }
    public add(article:ArticlePayload){
        this.data.push(article)
    }
}