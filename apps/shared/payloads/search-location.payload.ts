import { ResponsePayloadBase } from "./base-response.payload";

export class SearchLocationPayload extends ResponsePayloadBase {
    name:string
    constructor(name){
        super()
        this.name = name;
    }
}