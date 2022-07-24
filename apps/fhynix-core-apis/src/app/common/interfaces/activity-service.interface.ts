import { ActivityMasterModel } from '../models/activity.model'

export interface ActivityServiceInterface {
  getActivityByRelationship(
    relationship: string,
  ): Promise<ActivityMasterModel[]>
}
