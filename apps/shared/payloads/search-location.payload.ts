import { AddressModel } from "apps/fhynix-core-apis/src/app/common/models/address.model";
import { ResponsePayloadBase } from "./base-response.payload";

export class SearchLocationPayload extends ResponsePayloadBase {
    address:AddressModel;
    constructor(address){
        super()
        this.address = address;
    }
}