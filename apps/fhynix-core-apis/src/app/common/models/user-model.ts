export class UserModel {
  id?: string
  createdAtUtc?: Date
  createdBy?: string
  updatedAtUtc?: Date
  updatedBy?: string
  isDeleted?: boolean
  accountId?: string
  email?: string
  phone?: string
  address?: string
  timezoneOffsetInMins?: number
  isOnboardingCompleted?: boolean
  firstName?: string
  lastName?: string
  dob?: Date
}
