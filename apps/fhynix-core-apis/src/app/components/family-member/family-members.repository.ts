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

  async createFamilyMember(
    familyDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel> {
    const result = await this.client.familyMembers?.create({
      data: familyDetails,
    })
    return result
  }
}
