import { ResponsePayloadBase } from "./base-response.payload";

export class RepeatModeResponsePayload extends ResponsePayloadBase {
    repeatDuration?: string
    repeatOnWeekDays?: string[]
    repeatOnDays?: string[]
    constructor(repeatDuration,repeatOnWeekDays,repeatOnDays){
        super()
        this.repeatDuration = repeatDuration;
        this.repeatOnWeekDays = repeatOnWeekDays;
        this.repeatOnDays = repeatOnDays;
    }
}