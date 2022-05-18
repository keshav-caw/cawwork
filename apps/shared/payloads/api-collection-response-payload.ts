import { PayloadBase } from "./base-payload";
import { ArticlePayload } from "./article-payload";

export class CollectionResponsePayload<T> extends PayloadBase { 
    data:T[]
    constructor(){
        super()
        this.data = []
    }
    public add(dataPoint:T){
        this.data.push(dataPoint)
    }
}