import { TaskSourceEnum } from "../enums/task-source.enum"
import { SuggestionResponseModel } from "./suggestion-response.model"

export class TaskModel {
  id?: string
  createdAtUtc?: Date
  createdBy?: string
  updatedAtUtc?: Date
  updatedBy?: string
  isDeleted?: boolean
  familyMemberId: string
  relationshipId: string
  userId: string
  eventTemplateId?: string
  title: string
  startAtUtc: string
  endAtUtc: string
  recurringStartAtUtc: string
  recurringEndAtUtc?: string
  notifyAtUtc: string
  notes?: string
  repeatMode?: RepeatModeModal
  invites?: string[]
  latitude?: number
  longitude?: number
  status: string
  recurringTaskId?: string
  checklist: ChecklistModel[]
  activityId?: string
  taskSource?: TaskSourceEnum
  isFirstTaskOfRecurringMeeting?: boolean
  suggestions?: SuggestionResponseModel
}

export class RepeatModeModal {
  repeatDuration?: string
  repeatOnWeekDays?: string[]
  repeatOnDays?: string[]
}

export class ChecklistModel {
  name: string
  isCompleted: boolean
}
