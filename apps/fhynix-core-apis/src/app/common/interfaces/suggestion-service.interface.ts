import { SuggestionResponseModel } from "../models/suggestion-response.model";

export interface SuggestionServiceInterface {
  getSuggestionsForActivity(id:string,latitude:number,longitude:number): Promise<SuggestionResponseModel>
}
