import { RelationshipsMaster } from '@prisma/client'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { FamilyMemberServiceInterface } from '../../common/interfaces/family-member-service.interface'
import { FamilyMemberModel } from '../../common/models/family-members-model'
import { HabitsService } from '../habits/habits.service'
import { HabitsTypes } from '../habits/habits.types'
import { RelationshipRepository } from '../relationship/relationship.repository'
import { FamilyMemberRepository } from './family-members.repository'

@injectable()
export class FamilyMemberService implements FamilyMemberServiceInterface {
  constructor(
    @inject('FamilyMemberRepository')
    private familyMemberRepository: FamilyMemberRepository,
    @inject('RelationshipRepository')
    private relationshipRepository: RelationshipRepository,
    @inject(HabitsTypes.habits)
    private habitsService: HabitsService,
  ) {}

  async getFamilyMembersForUser(
    familyMemberDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel[]> {
    return await this.familyMemberRepository.getFamilyMembersForUser(
      familyMemberDetails,
    )
  }

  async getFamilyMembers(userId: string): Promise<FamilyMemberModel[]> {
    const familyMembers = await this.familyMemberRepository.getFamilyMembers(
      userId,
    )
    const calls = []
    familyMembers.forEach((familyMember) => {
      calls.push(this.habitsService.getHabitsById(familyMember.id))
    })
    const habitsForFamily = await Promise.all(calls)
    familyMembers.map((familyMember, index) => {
      familyMember['habits'] = habitsForFamily.find(
        (habit, ind) => index === ind,
      )
    })
    return familyMembers
  }

  async updateFamilyMembers(
    familyDetails: FamilyMemberModel,
    familyMemberId: string,
  ): Promise<FamilyMemberModel> {
    return await this.familyMemberRepository.updateFamilyMembers(
      familyDetails,
      familyMemberId,
    )
  }

  async createFamilyMemberForUser(familyMembers: FamilyMemberModel[]) {
    const calls = []
    familyMembers.forEach((familyMember) => {
      calls.push(this.createFamilyMember(familyMember))
    })

    const response = await Promise.all(calls)

    return response
  }

  async getRelationshipsMaster(
    relation: string,
  ): Promise<RelationshipsMaster[]> {
    return await this.relationshipRepository.getRelationshipsMasterByRelation(
      relation,
    )
  }

  async createFamilyMember(
    familyDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel> {
    return await this.familyMemberRepository.createFamilyMember(familyDetails)
  }
}
