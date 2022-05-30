import { ResponsePayloadBase } from "./base-response.payload";

export class SearchLocationPayload extends ResponsePayloadBase {
    address;
    constructor(address){
        super()
        this.address = address;
    }
}