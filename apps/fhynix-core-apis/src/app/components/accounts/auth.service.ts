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
import { ThirdPartyAPIError } from '../../common/errors/custom-errors/third-party.error'
import { UserLoginModel } from '../../common/models/user-login-model'
import { AccountModel } from '../../common/models/account-model'
import { UserModel } from '../../common/models/user-model'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'

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
    if (userDetails.provider !== LoginMethodEnum.GOOGLE_PROVIDER) {
      throw new ArgumentValidationError('', '', ApiErrorCode.E0004)
    } else {
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
        userData = await this.updateAccountDetails({
          accessToken: profileDetails.accessToken,
          refreshToken: profileDetails.refreshToken,
          accountId: user[0]?.id,
        })
      } else {
        userData = await this.createAccountDetails(profileDetails)
      }
      const authToken = await this.jwtService.encode({
        userId: userData?.id,
        email: userData?.email,
      })

      return { authToken: authToken }
    }
  }

  async updateAccountDetails(accountDetails: any): Promise<UserModel> {
    await this.authRepository.updateAccounts(
      {
        accessToken: accountDetails.accessToken,
        refreshToken: accountDetails.refreshToken,
      },
      accountDetails.accountId,
    )

    const userDetails = await this.userService.getUserByAccountId(
      accountDetails.accountId,
    )
    return userDetails[0]
  }

  private async createAccountDetails(profileDetails): Promise<UserModel> {
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
