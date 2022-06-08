export class TaskModel {
  id: string
  createdAtUtc: Date
  createdBy: string
  updatedAtUtc: Date
  updatedBy: string
  isDeleted: boolean
  familyMemberId: string
  userId: string
  eventTemplateId: string
  title: string
  startAtUtc: Date
  endAtUtc: Date
  notifyAtUtc: Date
  notes: string
  repeatMode: RepeatModeModal
  invites: string[]
  latitude: number
  longitude: number
  status: string
  recurringTaskId: string
}

export class RepeatModeModal {
  repeatDuration?: string
  repeatOnWeekDays?: string[]
  repeatOnDays?: string[]
}
