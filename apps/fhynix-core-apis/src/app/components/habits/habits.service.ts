import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { HabitsServiceInterface } from '../../common/interfaces/habits-service.interface'
import { FamilyMemberHabitsModel } from '../../common/models/family-member-habits-model'
import { HabitsModel } from '../../common/models/habits-model'
import { HabitsRepository } from './habits.repository'

@injectable()
export class HabitsService implements HabitsServiceInterface {
  constructor(
    @inject('HabitsRepository') private habitsRepository: HabitsRepository,
  ) {}

  async getHabitsByRelationship(relationship: string): Promise<HabitsModel[]> {
    return await this.habitsRepository.getHabitsByRelationship(relationship)
  }

  async getHabitsById(relationship: string): Promise<HabitsModel[]> {
    return await this.habitsRepository.getHabitsById(relationship)
  }

  async createHabitsForRelationship(
    relationshipHabits: FamilyMemberHabitsModel[],
  ): Promise<FamilyMemberHabitsModel[]> {
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
        this.habitsRepository.deleteRelationshipHabits(familyMemberId),
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

  async createRelationshipHabits(relationshipHabits) {
    return await this.habitsRepository.createRelationshipHabits(
      relationshipHabits,
    )
  }
}
