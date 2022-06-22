import { ActivitiesMasterModel } from '../models/habits-model'

export interface ActivityRepositoryInterface {
  getHabitsByRelationship(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]>
}
