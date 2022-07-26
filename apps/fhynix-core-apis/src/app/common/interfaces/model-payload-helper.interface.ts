import { SuggestionResponsePayload } from "apps/shared/payloads/suggestion-response.payload";
import { SuggestionResponseModel } from "../models/suggestion-response.model";

export interface ModelPayloadHelperInterface {
    suggestionResponsePayloadFromModel(response:SuggestionResponseModel):SuggestionResponsePayload
}
