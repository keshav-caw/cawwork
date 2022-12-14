import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { FamilyMemberRepositoryInterface } from '../../common/interfaces/family-member-repository.interface'
import { FamilyMemberModel } from '../../common/models/family-members-model'

@injectable()
export class FamilyMemberRepository implements FamilyMemberRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getFamilyMembersByRelationshipId(
    userDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel[]> {
    const result = await this.client.familyMembers?.findMany({
      where: {
        userId: userDetails.userId,
        relationshipId: userDetails.relationshipId,
        isDeleted: false,
      },
    })
    return result ? result : []
  }

  async getFamilyMembers(userId: string): Promise<FamilyMemberModel[]> {
    const result = await this.client.familyMembers?.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
    })
    return result ? result : []
  }

  async getFamilyMemberById(id: string): Promise<FamilyMemberModel[]> {
    const result = await this.client.familyMembers?.findMany({
      where: {
        id: id,
        isDeleted: false,
      },
    })
    return result ? result : []
  }

  async createFamilyMember(
    familyDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel> {
    const result = await this.client.familyMembers?.create({
      data: familyDetails,
    })
    return result
  }

  async updateFamilyMembers(
    familyMembers: FamilyMemberModel,
    familyMemberId: string,
  ): Promise<FamilyMemberModel> {
    const result = await this.client.familyMembers?.update({
      data: familyMembers,
      where: {
        id: familyMemberId,
      },
    })
    return result
  }

  async deleteFamilyMember(familyMemberId: string): Promise<FamilyMemberModel> {
    const result = await this.client.familyMembers?.update({
      data: { isDeleted: true },
      where: {
        id: familyMemberId,
      },
    })
    return result
  }
}
