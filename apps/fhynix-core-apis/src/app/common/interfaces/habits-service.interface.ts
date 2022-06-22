import { ActivitiesMasterModel } from '../models/habits-model'

export interface ActivityServiceInterface {
  getHabitsByRelationship(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]>
}
