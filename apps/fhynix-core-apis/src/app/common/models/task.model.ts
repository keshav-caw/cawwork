export class TaskModel {
  id: string
  createdAtUtc: Date
  createdBy: string
  updatedAtUtc: Date
  updatedBy: string
  isDeleted: boolean
  familyMemberId: string
  userId: string
  userTemplateId: string
  title: string
  startAtUtc: Date
  endAtUtc: Date
  notifyAtUtc: Date
  notes: string
  repeatDuration: string
  type: string
  invites: string[]
  latitudesAndLongitudes: string
  status: string
  recurringTaskId: string
}
