import { ResponsePayloadBase } from "./base-response.payload";

export class ProductResponsePayload extends ResponsePayloadBase {
    id:string
    title: string
    imageUrl:string
    url:string
    price:string
    description?:string
    activityIds?:string[]
    constructor(id,title,imageUrl,url,price,description='',activityIds=[]){
        super()
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.url = url;
        this.price = price;
        this.description = description;
        this.activityIds = activityIds;
    }    
}