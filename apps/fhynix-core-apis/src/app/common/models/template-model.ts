import { TaskModel } from './task.model'

export class TemplateModel {
  id: string
  createdAtUtc: Date
  createdBy: string
  updatedAtUtc: Date
  updatedBy: string
  isDeleted: boolean
  parentTemplateId: string
  templateName: string
  forRelationship: string
  userTemplateId: string
  userId: string
  startAtUtc: Date
  endAtUtc: Date
  status: string
  isMaster: boolean
  scheduleList: TaskModel[]
  otherInfo: OtherInfoModel[]
}

export class OtherInfoModel {
  description: string
  placeholder: string
  gradientColors: string[]
  id: number
  image: string
  title: string
  titleColor: string
}
