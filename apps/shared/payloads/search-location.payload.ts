import { AddressModel } from "apps/fhynix-core-apis/src/app/common/models/address.model";
import { ResponsePayloadBase } from "./base-response.payload";

export class SearchLocationPayload extends ResponsePayloadBase {
    name:string;
    location:Object;
    address:AddressModel;
    constructor(name,location,address){
        super()
        this.name = name;
        this.location = location;
        this.address = address;
    }
}