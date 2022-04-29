export class AccountModel {
  id?: string
  createdAtUtc?: Date
  createdBy?: string
  updatedAtUtc?: Date
  updatedBy?: string
  isDeleted?: boolean
  loginMethod?: string
  firstLoginAtUtc?: Date
  lastLoginAtUtc?: Date
  accessToken: string
  refreshToken: string
  username?: string
}
