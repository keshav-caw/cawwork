export class FamilyMembersModel {
  id?: string
  created_at_utc?: Date
  created_by?: string
  updated_at_utc?: Date
  updated_by?: string
  is_deleted?: boolean
  user_id: string
  relationship_id: string
  first_name: string
  last_name?: string
  dob?: Date
  profile_image?: boolean
  gender?: string
  other_info?: string
  color?: string
  personalities?: string
  interests?: string
}
