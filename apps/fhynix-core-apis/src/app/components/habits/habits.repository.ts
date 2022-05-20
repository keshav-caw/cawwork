import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { HabitsRepositoryInterface } from '../../common/interfaces/habits-repository.interface'
import { FamilyMemberHabitsModel } from '../../common/models/family-member-habits-model'
import { HabitsModel } from '../../common/models/habits-model'
@injectable()
export class HabitsRepository implements HabitsRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getHabitsByRelationship(relationship: string): Promise<HabitsModel> {
    const result = await this.client.habits?.findMany({
      where: {
        appliesForRelation: { hasSome: [relationship] },
      },
    })
    return result
  }

  async getHabitsById(familyMemberId: string): Promise<HabitsModel> {
    const result = await this.client.familyMemberHabits?.findMany({
      where: {
        familyMemberId: familyMemberId,
      },
    })
    return result
  }

  async createRelationshipHabits(
    relationshipHabits: FamilyMemberHabitsModel,
  ): Promise<FamilyMemberHabitsModel> {
    const result = await this.client.familyMemberHabits?.create({
      data: relationshipHabits,
    })
    return result
  }
}
