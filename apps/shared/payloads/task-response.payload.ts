import { RepeatModeModal } from 'apps/fhynix-core-apis/src/app/common/models/task.model'
import { ResponsePayloadBase } from './base-response.payload'
import {SuggestionResponsePayload} from './suggestion-response.payload'

export class TaskResponsePayload extends ResponsePayloadBase {
  id?: string
  relationshipId: string
  title: string
  repeatMode?:RepeatModeModal
  suggestions?: SuggestionResponsePayload

  constructor(id,relationshipId,title,repeatMode,suggestions) {
    super()
    this.id = id
    this.relationshipId = relationshipId
    this.title = title
    this.repeatMode = repeatMode;
    this.suggestions = suggestions;
  }
}
