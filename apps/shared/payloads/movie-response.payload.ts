import { ResponsePayloadBase } from "./base-response.payload";

export class MovieResponsePayload extends ResponsePayloadBase {
    id:string
    title:string
    activityIds:string[]
    imageUrl: string
    description?: string 
    language?: string
    runningTime?: string
    constructor(id,title,activityIds,imageUrl,description,language='',runningTime=''){
        super()
        this.id = id;
        this.title = title;
        this.activityIds = activityIds;
        this.imageUrl = imageUrl;
        this.description = description;
        this.language = language;
        this.runningTime = runningTime;
    }
}