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

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject('AuthRepository') private authRepository: AuthRepository,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
    @inject(UserTypes.user) private userService: UserService,
    @inject(AccountTypes.googleAuth)
    private googleAuthProvider: GoogleAuthProvider,
  ) {}
  async login(userDetails) {
    if (userDetails.provider === LoginMethodEnum.GOOGLE_PROVIDER) {
      const profileDetails = await this.authorizeUsingGoogle(
        userDetails.authCode,
      )
      const user = await this.authRepository.getAccountDetails(
        profileDetails.email,
      )

      let userData
      if (user?.length > 0) {
        userData = await this.updateAccountDetails(
          profileDetails.access_token,
          profileDetails.refresh_token,
          user[0]?.id,
        )
      } else {
        userData = await this.createAccountDetails(profileDetails)
      }
      const authToken = await this.jwtService.encode({
        user_id: userData?.id,
        email: userData?.email,
      })

      return { authToken: authToken }
    } else {
      return { status: 400, message: 'Please login through google provider' }
    }
  }

  async updateAccountDetails(
    access_token: string,
    refresh_token: string,
    accountId: string,
  ) {
    const accountDetails = await this.authRepository.updateAccounts(
      {
        access_token: access_token,
        refresh_token: refresh_token,
      },
      accountId,
    )
    return accountDetails
  }

  private async createAccountDetails(profileDetails) {
    const accountDetails = await this.authRepository.createAccounts({
      access_token: profileDetails.access_token,
      refresh_token: profileDetails.refresh_token,
      login_method: LoginMethodEnum.GOOGLE_PROVIDER,
      username: profileDetails.email,
    })
    const userData = await this.userService.createUser({
      email: profileDetails.email,
      phone: profileDetails.phone,
      is_onboarding_completed: false,
      account_id: accountDetails.id,
    })

    const relationship = await this.userService.getRelationshipsMaster('Self')
    await this.userService.createFamilyMembers({
      first_name: profileDetails.name,
      relationship_id: relationship[0]?.id,
      user_id: userData.id,
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
      access_token: authToken.tokens.access_token,
      refresh_token: authToken.tokens.refresh_token,
    }
  }
}
