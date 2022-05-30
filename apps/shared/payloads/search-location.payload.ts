import { AddressModel } from "apps/fhynix-core-apis/src/app/common/models/address.model";
import { ResponsePayloadBase } from "./base-response.payload";

export class SearchLocationPayload extends ResponsePayloadBase {
    name:string;
    address:AddressModel;
    constructor(name,address){
        super()
        this.name = name;
        this.address = address;
    }
}