import { ResponsePayloadBase } from "./base-response.payload";

export class SearchLocationPayload extends ResponsePayloadBase {
    name:string;
    location:Object;
    fullAddress:string;
    constructor(name,location,fullAddress){
        super()
        this.name = name;
        this.location = location;
        this.fullAddress = fullAddress;
    }
}