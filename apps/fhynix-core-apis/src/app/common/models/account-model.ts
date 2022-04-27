export class AccountModel {
  id?: string
  created_at_utc?: Date
  created_by?: string
  updated_at_utc?: Date
  updated_by?: string
  is_deleted?: boolean
  login_method?: string
  first_login_at_utc?: Date
  last_login_at_utc?: Date
  access_token: string
  refresh_token: string
  username?: string
}
