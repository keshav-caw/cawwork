import { ResponsePayloadBase } from "./base-response.payload";

export class SearchLocationPayload extends ResponsePayloadBase {
    name:string;
    location:Object;
    constructor(name,location){
        super()
        this.name = name;
        this.location = location;
    }
}