import { ActivityMasterModel } from '../models/activity.model'

export interface ActivityRepositoryInterface {
  getActivityByRelationship(
    relationship: string,
  ): Promise<ActivityMasterModel[]>
}
