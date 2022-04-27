export class UserModel {
  id?: string
  created_at_utc?: Date
  created_by?: string
  updated_at_utc?: Date
  updated_by?: string
  is_deleted?: boolean
  account_id: string
  email: string
  phone: string
  address?: string
  timezone_offset_in_mins?: number
  is_onboarding_completed: boolean
}
