import { ResponsePayloadBase } from "./base-response.payload";

export class VendorResponsePayload extends ResponsePayloadBase {
    id:string
    name:string
    phoneNumbers:string[] 
    activityIds:string[]
    address?: string 
    constructor(id,name,phoneNumbers,activityIds,address=''){
        super()
        this.id = id;
        this.name = name;
        this.phoneNumbers = phoneNumbers;
        this.activityIds = activityIds;
        this.address = address;
    }    
}