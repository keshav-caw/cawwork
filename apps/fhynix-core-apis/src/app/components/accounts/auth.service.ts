import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { CommonTypes } from '../../common/common.types'
import { JWTService } from '../../common/jwtservice/jwt.service'
import { AuthServiceInterface } from '../../common/interfaces/auth-service.interface'
import { AuthRepository } from './auth.repository'
import { environment } from 'apps/fhynix-core-apis/src/environments/environment'
import { UserService } from '../users/user.service'
import { UserTypes } from '../users/user.types'
import { LoginMethodEnum } from '../../common/enums/login-method.enum'
import { GoogleAuthProvider } from './google-auth-provider.service'
import { AccountTypes } from './account.types'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { ApiError } from '../../common/errors/custom-errors/apiError.error'
import { ThirdPartyAPIError } from '../../common/errors/custom-errors/third-party.error'
import { UserLoginModel } from '../../common/models/user-login-model'

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject('AuthRepository') private authRepository: AuthRepository,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
    @inject(UserTypes.user) private userService: UserService,
    @inject(AccountTypes.googleAuth)
    private googleAuthProvider: GoogleAuthProvider,
  ) {}
  async login(userDetails: UserLoginModel) {
    if (userDetails.provider === LoginMethodEnum.GOOGLE_PROVIDER) {
      let profileDetails
      try {
        profileDetails = await this.authorizeUsingGoogle(userDetails.authCode)
      } catch (e) {
        throw new ThirdPartyAPIError(ApiErrorCode.E0003)
      }
      const user = await this.authRepository.getAccountDetails(
        profileDetails.email,
      )
      let userData
      if (user?.length > 0) {
        userData = await this.updateAccountDetails(
          profileDetails.accessToken,
          profileDetails.refreshToken,
          user[0]?.id,
        )
      } else {
        userData = await this.createAccountDetails(profileDetails)
      }
      const authToken = await this.jwtService.encode({
        userId: userData?.id,
        email: userData?.email,
      })

      return { authToken: authToken }
    } else {
      throw new ApiError(ApiErrorCode.E0004)
    }
  }

  async updateAccountDetails(
    accessToken: string,
    refreshToken: string,
    accountId: string,
  ) {
    const accountDetails = await this.authRepository.updateAccounts(
      {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      accountId,
    )
    return accountDetails
  }

  private async createAccountDetails(profileDetails) {
    const accountDetails = await this.authRepository.createAccounts({
      accessToken: profileDetails.accessToken,
      refreshToken: profileDetails.refreshToken,
      loginMethod: LoginMethodEnum.GOOGLE_PROVIDER,
      username: profileDetails.email,
    })

    const userData = await this.userService.createUser({
      email: profileDetails.email,
      phone: profileDetails.phone,
      isOnboardingCompleted: false,
      accountId: accountDetails.id,
    })

    const relationship = await this.userService.getRelationshipsMaster('Self')

    await this.userService.createFamilyMembers({
      firstName: profileDetails.name,
      relationshipId: relationship[0]?.id,
      userId: userData.id,
    })
    return userData
  }

  private async authorizeUsingGoogle(code: string) {
    const oauth2Client = this.googleAuthProvider.makeGoogleOAuth2Client({
      clientId: environment.googleClientId,
      clientSecret: environment.googleClientSecretKey,
    })
    const authToken = await oauth2Client.getToken(code)

    oauth2Client.setCredentials({
      access_token: authToken.tokens.access_token,
      refresh_token: authToken.tokens.refresh_token,
    })
    const googleApi = this.googleAuthProvider.makeGooglePeopleApi()
    const peopleDetails = await googleApi.people.get({
      auth: oauth2Client,
      resourceName: 'people/me',
      personFields: 'names,phoneNumbers,emailAddresses,locations,locales',
    })
    return {
      name: peopleDetails.data.names?.[0]?.displayName,
      phone: peopleDetails.data.phoneNumbers?.[0]?.value,
      email: peopleDetails.data.emailAddresses?.[0]?.value,
      accessToken: authToken.tokens.access_token,
      refreshToken: authToken.tokens.refresh_token,
    }
  }
}
