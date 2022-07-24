import { ResponsePayloadBase } from "./base-response.payload";

export class RestaurantResponsePayload extends ResponsePayloadBase {
    id:string
    name:string
    address: string 
    phoneNumbers:string[]
    imageUrl: string 
    activityIds?:string[]
    constructor(id,name,address,phoneNumbers,imageUrl,activityIds=[]){
        super()
        this.id = id;
        this.name = name;
        this.address = address;
        this.phoneNumbers = phoneNumbers;
        this.imageUrl = imageUrl;
        this.activityIds = activityIds;
    }
}