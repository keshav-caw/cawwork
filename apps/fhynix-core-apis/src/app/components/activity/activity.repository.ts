import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { ActivityRepositoryInterface } from '../../common/interfaces/activity-repository.interface'
import { FamilyMemberActivityModel } from '../../common/models/family-member-activity-model'
import { ActivityMasterModel } from '../../common/models/activity.model'
import { ActivitiesScheduleMasterModel } from '../../common/models/activities-schedule-master.model'

@injectable()
export class ActivityRepository implements ActivityRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getActivityByRelationship(
    relationship: string,
  ): Promise<ActivityMasterModel[]> {
    const result = await this.client.activitiesMaster?.findMany({
      where: {
        appliesForRelation: { hasSome: [relationship] },
        canBeHabit: true,
        isDeleted: false,
      },
    })
    return result
  }

  async getAllActivities(): Promise<ActivityMasterModel[]> {
    const result = await this.client.activitiesMaster?.findMany({
      where: {
        isDeleted: false,
      },
    })
    return result
  }

  async getActivityByRelationshipAndName(
    relationship: string,
    name: string,
  ): Promise<ActivityMasterModel[]> {
    const result = await this.client.activitiesMaster?.findMany({
      where: {
        appliesForRelation: { hasSome: [relationship] },
        name: name,
        canBeHabit: true,
        isDeleted: false,
      },
    })
    return result
  }

  async getActivityScheduleByByRelationshipAndName(
    relationship: string,
  ): Promise<ActivitiesScheduleMasterModel[]> {
    const result = await this.client.activitiesScheduleMaster?.findMany({
      where: {
        appliesForRelation: { hasSome: [relationship] },
        isDeleted: false,
      },
    })
    return result
  }

  async getActivityByFamilyMemberId(
    familyMemberId: string,
  ): Promise<ActivityMasterModel[]> {
    const result = await this.client.familyMemberActivity?.findMany({
      where: {
        familyMemberId: familyMemberId,
        isDeleted: false,
      },
    })
    return result
  }

  async createActivity(
    activity: ActivityMasterModel,
  ): Promise<ActivityMasterModel[]> {
    const result = await this.client.activitiesMaster?.create({
      data: activity,
    })
    return result
  }

  async createRelationshipActivity(
    relationshipActivity: FamilyMemberActivityModel,
  ): Promise<FamilyMemberActivityModel> {
    const result = await this.client.familyMemberActivity?.create({
      data: relationshipActivity,
    })
    return result
  }

  async deleteRelationshipActivities(
    familyMemberId: string,
  ): Promise<FamilyMemberActivityModel[]> {
    const activityByFamilyId = await this.getActivityByFamilyMemberId(
      familyMemberId,
    )
    if (activityByFamilyId?.length > 0) {
      const result = await this.client.familyMemberActivity?.update({
        data: { isDeleted: true },
        where: {
          familyMemberId: familyMemberId,
        },
      })
      return result
    }

    return []
  }

  async getActivityByActivityId(id:string):Promise<ActivityMasterModel> {
    const result = await this.client.activitiesMaster?.findUnique({
      where:{
        id:id
      }
    })
    return result;
  }

}
