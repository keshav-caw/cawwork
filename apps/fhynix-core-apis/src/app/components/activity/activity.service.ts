import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { ActivityServiceInterface } from '../../common/interfaces/activity-service.interface'
import { FamilyMemberActivityModel } from '../../common/models/family-member-activity-model'
import { ActivitiesMasterModel } from '../../common/models/activity-model'
import { ActivityRepository } from './activity.repository'

@injectable()
export class ActivityService implements ActivityServiceInterface {
  constructor(
    @inject('ActivityRepository')
    private activityRepository: ActivityRepository,
  ) {}

  async getActivityByRelationship(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]> {
    return await this.activityRepository.getActivityByRelationship(relationship)
  }

  async getAllActivities(): Promise<ActivitiesMasterModel[]> {
    return await this.activityRepository.getAllActivities()
  }

  async getActivityByFamilyMemberId(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]> {
    return await this.activityRepository.getActivityByFamilyMemberId(
      relationship,
    )
  }

  async createActivitiesForRelationship(
    relationshipActivities: FamilyMemberActivityModel[],
  ): Promise<FamilyMemberActivityModel[]> {
    if (relationshipActivities?.length < 2) {
      throw new ArgumentValidationError(
        'Atleast 2 activities must be added',
        relationshipActivities,
        ApiErrorCode.E0021,
      )
    }
    let familyMemberIds = relationshipActivities.map(
      (relationshipActivity) => relationshipActivity.familyMemberId,
    )
    familyMemberIds = [...new Set(familyMemberIds)]
    const familyMemberCalls = []

    familyMemberIds.forEach((familyMemberId) => {
      familyMemberCalls.push(
        this.activityRepository.deleteRelationshipActivities(familyMemberId),
      )
    })

    await Promise.all(familyMemberCalls)
    const calls = []
    relationshipActivities.forEach((relationshipActivity) => {
      calls.push(this.createRelationshipActivity(relationshipActivity))
    })

    const response = await Promise.all(calls)

    return response
  }

  async createRelationshipActivity(
    relationshipActivity: FamilyMemberActivityModel,
  ) {
    let createdCustomActivity
    if (!relationshipActivity.activityId) {
      const customActivity = {
        name: relationshipActivity.name,
        appliesForRelation: relationshipActivity.appliesForRelation,
        canBeHabit: true,
        isCustom: true,
      }
      createdCustomActivity = await this.activityRepository.createActivity(
        customActivity,
      )
      relationshipActivity.activityId = createdCustomActivity?.id
    }
    delete relationshipActivity['name']
    delete relationshipActivity['appliesForRelation']
    return await this.activityRepository.createRelationshipActivity(
      relationshipActivity,
    )
  }
}
