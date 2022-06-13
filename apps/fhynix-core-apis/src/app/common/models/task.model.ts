export class TaskModel {
  id: string
  createdAtUtc: Date
  createdBy: string
  updatedAtUtc: Date
  updatedBy: string
  isDeleted: boolean
  familyMemberId: string
  relationshipId: string
  userId: string
  eventTemplateId: string
  title: string
  startAtUtc: string
  endAtUtc: string
  notifyAtUtc: string
  notes: string
  repeatMode: RepeatModeModal
  invites: string[]
  latitude: number
  longitude: number
  status: string
  recurringTaskId: string
  checklist: ChecklistModel[]
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
