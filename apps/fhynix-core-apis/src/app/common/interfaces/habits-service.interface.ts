import { ActivitiesMasterModel } from '../models/habits-model'

export interface HabitsServiceInterface {
  getHabitsByRelationship(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]>
}
