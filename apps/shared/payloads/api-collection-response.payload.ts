import { ResponsePayloadBase } from "./base-response.payload";

export class CollectionResponsePayload<T extends ResponsePayloadBase> extends ResponsePayloadBase { 
    data:T[]
    constructor(){
        super()
        this.data = []
    }
    public add(dataPoint:T){
        this.data.push(dataPoint)
    }
}