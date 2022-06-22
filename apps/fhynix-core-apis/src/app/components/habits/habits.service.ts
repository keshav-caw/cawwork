import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { ActivityServiceInterface } from '../../common/interfaces/habits-service.interface'
import { FamilyMemberActivityModel } from '../../common/models/family-member-habits-model'
import { ActivitiesMasterModel } from '../../common/models/habits-model'
import { ActivityRepository } from './habits.repository'

@injectable()
export class ActivityService implements ActivityServiceInterface {
  constructor(
    @inject('ActivityRepository')
    private activityRepository: ActivityRepository,
  ) {}

  async getHabitsByRelationship(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]> {
    return await this.activityRepository.getHabitsByRelationship(relationship)
  }

  async getAllActivities(): Promise<ActivitiesMasterModel[]> {
    return await this.activityRepository.getAllActivities()
  }

  async getHabitsById(relationship: string): Promise<ActivitiesMasterModel[]> {
    return await this.activityRepository.getActvityByFamilyMemberId(
      relationship,
    )
  }

  async createHabitsForRelationship(
    relationshipHabits: FamilyMemberActivityModel[],
  ): Promise<FamilyMemberActivityModel[]> {
    if (relationshipHabits?.length < 2) {
      throw new ArgumentValidationError(
        'Atleast 2 habits must be added',
        relationshipHabits,
        ApiErrorCode.E0021,
      )
    }
    let familyMemberIds = relationshipHabits.map(
      (relationshipHabit) => relationshipHabit.familyMemberId,
    )
    familyMemberIds = [...new Set(familyMemberIds)]
    const familyMemberCalls = []

    familyMemberIds.forEach((familyMemberId) => {
      familyMemberCalls.push(
        this.activityRepository.deleteRelationshipHabits(familyMemberId),
      )
    })

    await Promise.all(familyMemberCalls)
    const calls = []
    relationshipHabits.forEach((relationshipHabit) => {
      calls.push(this.createRelationshipHabits(relationshipHabit))
    })

    const response = await Promise.all(calls)

    return response
  }

  async createRelationshipHabits(relationshipHabit: FamilyMemberActivityModel) {
    let createdCustomHabit
    if (!relationshipHabit.activityId) {
      const customHabits = {
        name: relationshipHabit.name,
        appliesForRelation: relationshipHabit.appliesForRelation,
        canBeHabit: true,
        isCustom: true,
      }
      createdCustomHabit = await this.activityRepository.createActivity(
        customHabits,
      )
      relationshipHabit.activityId = createdCustomHabit?.id
    }
    delete relationshipHabit['name']
    delete relationshipHabit['appliesForRelation']
    return await this.activityRepository.createRelationshipHabits(
      relationshipHabit,
    )
  }
}
