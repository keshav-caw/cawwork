import { ResponsePayloadBase } from "./base-response.payload";

export class SearchLocationPayload extends ResponsePayloadBase {
    name:string;
    streetInfo:string
    city:string
    state:string
    country:string
    lat:number
    lng:number
    constructor(address){
        super()
        this.name = address.name;
        this.streetInfo = address.streetInfo;
        this.city = address.city;
        this.state = address.state;
        this.country = address.country;
        this.lat = address.lat;
        this.lng = address.lng;
    }
}