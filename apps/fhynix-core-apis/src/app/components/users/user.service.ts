import { RelationshipsMaster } from '@prisma/client'
import { environment } from 'apps/fhynix-core-apis/src/environments/environment'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { FamilyMemberModel } from '../../common/models/family-members-model'
import { UserModel } from '../../common/models/user-model'
import { AccountTypes } from '../accounts/account.types'
import { GoogleAuthProvider } from '../accounts/google-auth-provider.service'
import { FamilyMemberService } from '../family-member/family-member.service'
import { FamilyMemberTypes } from '../family-member/family-member.types'
import { UserRepository } from './user.repository'

@injectable()
export class UserService {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository,
    @inject(FamilyMemberTypes.familyMember)
    private familyMemberService: FamilyMemberService,
    @inject(AccountTypes.googleAuth)
    private googleAuthProvider: GoogleAuthProvider,
  ) {}

  async getUserDetail(userId: string): Promise<UserModel[]> {
    const details = await this.userRepository.getUserDetails(userId)
    const relationship = await this.getRelationshipsMaster('self')
    const familyDetails =
      await this.familyMemberService.getFamilyMembersByRelationshipId({
        userId: userId,
        relationshipId: relationship[0]?.id,
      })

    Object.assign(details?.[0], familyDetails?.[0])
    return details
  }

  async getUserByAccountId(accountId: string): Promise<UserModel[]> {
    const details = await this.userRepository.getUserDetailsByAccountId(
      accountId,
    )
    return details
  }

  async createUser(userDetails: UserModel): Promise<UserModel> {
    const dob = userDetails.dob
    delete userDetails.dob
    const userData = await this.userRepository.createUser(userDetails)
    const relationship = await this.getRelationshipsMaster('self')

    await this.familyMemberService.createFamilyMember({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      relationshipId: relationship[0]?.id,
      userId: userData.id,
      dob: dob,
    })
    return userData
  }

  async updateUserDetails(
    userDetails: UserModel,
    userId: string,
  ): Promise<UserModel> {
    return await this.userRepository.updateUserDetails(userDetails, userId)
  }

  async updateFamilyMembers(
    familyDetails: FamilyMemberModel,
    familyMemberId: string,
  ): Promise<FamilyMemberModel> {
    return await this.familyMemberService.updateFamilyMembers(
      familyDetails,
      familyMemberId,
    )
  }

  async getRelationshipsMaster(
    relation: string,
  ): Promise<RelationshipsMaster[]> {
    return await this.userRepository.getRelationshipsMaster(relation)
  }

  async searchContacts(access_token, refresh_token, searchContact) {
    const oauth2Client = await this.googleAuthProvider.makeGoogleOAuth2Client({
      clientId: environment.googleClientId,
      clientSecret: environment.googleClientSecretKey,
    })

    oauth2Client.setCredentials({
      access_token: access_token,
      refresh_token: refresh_token,
    })
    const googleApi = this.googleAuthProvider.makeGooglePeopleApi()

    const contacts = await googleApi.people.connections.list({
      auth: oauth2Client,
      resourceName: 'people/me',
      personFields: 'names,phoneNumbers',
    })

    const searchedContacts = []

    contacts?.data?.connections?.forEach((contact) => {
      if (
        contact.names?.[0]?.displayName
          ?.toLowerCase()
          ?.indexOf(searchContact.toLowerCase()) > -1
      ) {
        const searchedContact = {
          name: contact.names?.[0]?.displayName,
          phoneNumber: contact.phoneNumbers?.[0]?.canonicalForm,
        }
        searchedContacts.push(searchedContact)
      }
    })
    return searchedContacts
  }
}
