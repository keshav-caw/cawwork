import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { HabitsServiceInterface } from '../../common/interfaces/habits-service.interface'
import { FamilyMemberHabitsModel } from '../../common/models/family-member-habits-model'
import { HabitsModel } from '../../common/models/habits-model'
import { HabitsRepository } from './habits.repository'

@injectable()
export class HabitsService implements HabitsServiceInterface {
  constructor(
    @inject('HabitsRepository') private habitsRepository: HabitsRepository,
  ) {}

  async getHabitsByRelationship(relationship: string): Promise<HabitsModel> {
    return await this.habitsRepository.getHabitsByRelationship(relationship)
  }

  async createRelationshipHabits(
    relationshipHabits: FamilyMemberHabitsModel,
  ): Promise<FamilyMemberHabitsModel> {
    return await this.habitsRepository.createRelationshipHabits(
      relationshipHabits,
    )
  }
}
