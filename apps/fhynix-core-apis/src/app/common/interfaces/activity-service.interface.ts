import { ActivitiesMasterModel } from '../models/activity-model'

export interface ActivityServiceInterface {
  getActivityByRelationship(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]>
}
