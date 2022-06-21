import { ActivitiesMasterModel } from '../models/habits-model'

export interface HabitsRepositoryInterface {
  getHabitsByRelationship(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]>
}
