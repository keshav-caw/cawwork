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

  async getHabitsByRelationship(relationship: string): Promise<HabitsModel[]> {
    const result = await this.client.activitiesMaster?.findMany({
      where: {
        appliesForRelation: { hasSome: [relationship] },
        canBeHabit: true,
        isDeleted: false,
      },
    })
    return result
  }

  async getHabitsById(familyMemberId: string): Promise<HabitsModel[]> {
    const result = await this.client.familyMemberHabits?.findMany({
      where: {
        familyMemberId: familyMemberId,
        isDeleted: false,
      },
    })
    return result
  }

  async createHabit(habit: HabitsModel): Promise<HabitsModel[]> {
    const result = await this.client.activitiesMaster?.create({
      data: habit,
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

  async deleteRelationshipHabits(
    familyMemberId: string,
  ): Promise<FamilyMemberHabitsModel[]> {
    const habitByFamilyId = await this.getHabitsById(familyMemberId)
    if (habitByFamilyId?.length > 0) {
      const result = await this.client.familyMemberHabits?.update({
        data: { isDeleted: true },
        where: {
          familyMemberId: familyMemberId,
        },
      })
      return result
    }

    return []
  }
}
