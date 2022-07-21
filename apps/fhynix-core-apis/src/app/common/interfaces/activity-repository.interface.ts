import { ActivitiesMasterModel } from '../models/activity.model'

export interface ActivityRepositoryInterface {
  getActivityByRelationship(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]>
}
