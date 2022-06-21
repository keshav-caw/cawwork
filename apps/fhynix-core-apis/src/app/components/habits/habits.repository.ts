import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { HabitsRepositoryInterface } from '../../common/interfaces/habits-repository.interface'
import { FamilyMemberActivityModel } from '../../common/models/family-member-habits-model'
import { ActivitiesMasterModel } from '../../common/models/habits-model'
@injectable()
export class HabitsRepository implements HabitsRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getHabitsByRelationship(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]> {
    const result = await this.client.activitiesMaster?.findMany({
      where: {
        appliesForRelation: { hasSome: [relationship] },
        canBeHabit: true,
        isDeleted: false,
      },
    })
    return result
  }

  async getAllActivities(): Promise<ActivitiesMasterModel[]> {
    const result = await this.client.activitiesMaster?.findMany({
      where: {
        isDeleted: false,
      },
    })
    return result
  }

  async getHabitsById(
    familyMemberId: string,
  ): Promise<ActivitiesMasterModel[]> {
    const result = await this.client.familyMemberActivity?.findMany({
      where: {
        familyMemberId: familyMemberId,
        isDeleted: false,
      },
    })
    return result
  }

  async createHabit(
    habit: ActivitiesMasterModel,
  ): Promise<ActivitiesMasterModel[]> {
    const result = await this.client.activitiesMaster?.create({
      data: habit,
    })
    return result
  }

  async createRelationshipHabits(
    relationshipHabits: FamilyMemberActivityModel,
  ): Promise<FamilyMemberActivityModel> {
    const result = await this.client.familyMemberActivity?.create({
      data: relationshipHabits,
    })
    return result
  }

  async deleteRelationshipHabits(
    familyMemberId: string,
  ): Promise<FamilyMemberActivityModel[]> {
    const habitByFamilyId = await this.getHabitsById(familyMemberId)
    if (habitByFamilyId?.length > 0) {
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
}
