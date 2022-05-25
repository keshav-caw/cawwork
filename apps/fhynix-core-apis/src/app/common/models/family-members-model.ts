export class FamilyMemberModel {
  id?: string
  createdAtUtc?: Date
  createdBy?: string
  updatedAtUtc?: Date
  updatedBy?: string
  isDeleted?: boolean
  userId?: string
  relationshipId?: string
  firstName?: string
  lastName?: string
  dob?: Date
  profileImage?: boolean
  gender?: string
  otherInfo?: OtherInfoModel
  color?: string
  personalities?: string
  interests?: string
}

export class OtherInfoModel {
  school?: string
  company?: string
  aniverary?: Date
  sleepHours?: ScheduleModel
  workHours?: ScheduleModel
  lunchHours?: ScheduleModel
}

export class ScheduleModel {
  startTime?: string
  endTime?: string
}
