import { RelationshipsMaster } from '@prisma/client'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { CommonTypes } from '../../common/common.types'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { FamilyMemberServiceInterface } from '../../common/interfaces/family-member-service.interface'
import { RequestContext } from '../../common/jwtservice/requests-context.service'
import { FamilyMemberModel } from '../../common/models/family-members-model'
import { HabitsService } from '../habits/habits.service'
import { HabitsTypes } from '../habits/habits.types'
import { RelationshipTypes } from '../relationship/realtionship.types'
import { RelationshipRepository } from '../relationship/relationship.repository'
import { RelationshipService } from '../relationship/relationship.service'
import { FamilyMemberRepository } from './family-members.repository'
import dayjs from 'dayjs'

@injectable()
export class FamilyMemberService implements FamilyMemberServiceInterface {
  constructor(
    @inject('FamilyMemberRepository')
    private familyMemberRepository: FamilyMemberRepository,
    @inject('RelationshipRepository')
    private relationshipRepository: RelationshipRepository,
    @inject(HabitsTypes.habits)
    private habitsService: HabitsService,
    @inject(RelationshipTypes.relationship)
    private relationshipService: RelationshipService,
    @inject(CommonTypes.requestContext)
    private requestContext: RequestContext,
  ) {}

  async getFamilyMembersForUser(
    familyMemberDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel[]> {
    const userDetails =
      await this.familyMemberRepository.getFamilyMembersByRelationshipId(
        familyMemberDetails,
      )

    if (userDetails?.length > 0) {
      const habitsForFamily = await this.habitsService.getHabitsById(
        userDetails?.[0]?.id,
      )
      userDetails[0]['habits'] = habitsForFamily
    } else {
      throw new ArgumentValidationError(
        "Family member doesn't exist",
        familyMemberDetails,
        ApiErrorCode.E0014,
      )
    }
    return userDetails
  }

  async getFamilyMembers(userId: string): Promise<FamilyMemberModel[]> {
    const familyMembers = await this.familyMemberRepository.getFamilyMembers(
      userId,
    )
    const calls = []
    familyMembers?.forEach((familyMember) => {
      calls.push(this.habitsService.getHabitsById(familyMember.id))
    })
    const habitsForFamily = await Promise.all(calls)
    familyMembers.map((familyMember, index) => {
      familyMember['habits'] = habitsForFamily?.find(
        (habit, ind) => index === ind,
      )
    })
    return familyMembers
  }

  async updateFamilyMembers(
    familyDetails: FamilyMemberModel,
    familyMemberId: string,
  ): Promise<FamilyMemberModel> {
    this.validateFamilyMemberOtherInfo(familyDetails)
    return await this.familyMemberRepository.updateFamilyMembers(
      familyDetails,
      familyMemberId,
    )
  }

  async createFamilyMemberForUser(familyMembers: FamilyMemberModel[]) {
    await this.validateFamilyMembers(familyMembers)
    const calls = []
    familyMembers.forEach((familyMember) => {
      calls.push(this.createFamilyMember(familyMember))
    })

    const response = await Promise.all(calls)

    return response
  }

  async deleteFamilyMember(familyMemberId: string) {
    return await this.familyMemberRepository.deleteFamilyMember(familyMemberId)
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

  validateFamilyMemberOtherInfo(familyMember: FamilyMemberModel) {
    if (
      familyMember?.otherInfo?.sleepHours &&
      familyMember?.otherInfo?.workHours
    ) {
      const sleepTime = familyMember?.otherInfo?.sleepHours
      const workHoursTime = familyMember?.otherInfo?.workHours
      const today = dayjs().format('YYYY-MM-DD')

      sleepTime.startTime = today + ' ' + sleepTime.startTime
      sleepTime.endTime = today + ' ' + sleepTime.endTime

      workHoursTime.startTime = today + ' ' + workHoursTime.startTime
      workHoursTime.endTime = today + ' ' + workHoursTime.endTime
      if (
        dayjs(sleepTime.startTime).diff(
          dayjs(workHoursTime.startTime),
          'minutes',
        ) >= 0 &&
        dayjs(workHoursTime.endTime).diff(
          dayjs(sleepTime.startTime),
          'minutes',
        ) >= 0
      ) {
        throw new ArgumentValidationError(
          'Working Hour and Sleep time overlapping',
          familyMember,
          ApiErrorCode.E0012,
        )
      } else if (
        dayjs(sleepTime.endTime).diff(
          dayjs(workHoursTime.startTime),
          'minutes',
        ) >= 0 &&
        dayjs(workHoursTime.endTime).diff(
          dayjs(sleepTime.endTime),
          'minutes',
        ) >= 0
      ) {
        throw new ArgumentValidationError(
          'Working Hour and Sleep time overlapping',
          familyMember,
          ApiErrorCode.E0012,
        )
      }
    }
  }

  async validateFamilyMembers(familyMembers: FamilyMemberModel[]) {
    const relations = await this.relationshipRepository.getRelationshipsMaster()
    let relationshipIds = familyMembers.map((family) => family.relationshipId)
    relationshipIds = [...new Set(relationshipIds)]
    const calls = []
    relationshipIds.forEach((relationshipId) => {
      const selectedRelation = relations.filter(
        (relation) => relation.id === relationshipId,
      )
      if (selectedRelation.length === 0) {
        throw new ArgumentValidationError(
          'Invalid Relationship',
          familyMembers,
          ApiErrorCode.E0010,
        )
      }
      calls.push(
        this.familyMemberRepository.getFamilyMembersByRelationshipId({
          userId: familyMembers[0].userId,
          relationshipId: relationshipId,
        }),
      )
    })
    const userDetails = await Promise.all(calls)
    relationshipIds.forEach((relationshipId, index) => {
      const selectedRelation = relations.filter(
        (relation) => relation.id === relationshipId,
      )
      const userDet = userDetails[index].concat(
        familyMembers.filter(
          (family) => family.relationshipId === relationshipId,
        ),
      )
      if (selectedRelation?.[0].relation === 'partner' && userDet?.length > 1) {
        throw new ArgumentValidationError(
          'Add Family Member',
          familyMembers,
          ApiErrorCode.E0008,
        )
      } else if (
        selectedRelation?.[0].relation === 'kid' &&
        userDet?.length > 4
      ) {
        throw new ArgumentValidationError(
          'Add Family Member',
          familyMembers,
          ApiErrorCode.E0007,
        )
      } else if (
        selectedRelation?.[0].relation === 'self' &&
        userDet?.length > 1
      ) {
        throw new ArgumentValidationError(
          'Add Family Member',
          familyMembers,
          ApiErrorCode.E0009,
        )
      }

      if (selectedRelation?.[0].relation === 'kid') {
        const kids = familyMembers.filter(
          (family) => family.relationshipId === relationshipId,
        )

        kids.forEach((kid) => {
          const kidsAge = dayjs().diff(dayjs(kid.dob), 'years')
          if (kidsAge < 3) {
            throw new ArgumentValidationError(
              'Kids Dob Invalid',
              familyMembers,
              ApiErrorCode.E0011,
            )
          }
        })
      }
    })
  }
}
