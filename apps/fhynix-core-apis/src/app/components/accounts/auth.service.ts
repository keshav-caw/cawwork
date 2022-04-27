import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { CommonTypes } from '../../common/common.types'
import { JWTService } from '../../common/jwtservice/jwt.service'
import { AuthServiceInterface } from '../../common/interfaces/auth-service.interface'
import { AuthRepository } from './auth.repository'
import { google } from 'googleapis'
import { environment } from 'apps/fhynix-core-apis/src/environments/environment'
import { UserService } from '../users/user.service'
import { UserTypes } from '../users/user.types'
import { LoginMethodEnum } from '../../common/enums/login-method.enum'

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject('AuthRepository') private authRepository: AuthRepository,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
    @inject(UserTypes.user) private userService: UserService,
  ) {}
  async login(userDetails) {
    if (userDetails.provider === LoginMethodEnum.GOOGLE_PROVIDER) {
      const profileDetails = await this.googleAuthorization(
        userDetails.authCode,
      )
      const user = await this.userService.getUserByEmailId(
        profileDetails.peopleDetails.emailAddresses[0].value,
      )
      if (user.length > 0) {
        await this.updateAccountDetails(
          profileDetails.access_token,
          profileDetails.refresh_token,
          user[0].account_id,
        )
        const authToken = await this.jwtService.encode({
          user_id: user[0]?.id,
          email: user[0]?.email,
        })

        return { authToken: authToken }
      } else {
        const userDetails = await this.createAccountDetails(profileDetails)
        const authToken = await this.jwtService.encode({
          user_id: userDetails?.id,
          email: userDetails?.email,
        })

        return { authToken: authToken }
      }
    } else {
      return { status: 400, message: 'Please login through google provider' }
    }
  }

  async updateAccountDetails(access_token, refresh_token, accountId) {
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
    })
    const userData = await this.userService.createUser({
      email: profileDetails.peopleDetails.emailAddresses[0].value,
      phone:
        profileDetails.peopleDetails.phoneNumbers?.length > 0
          ? profileDetails.peopleDetails.phoneNumbers[0].value
          : null,
      is_onboarding_completed: false,
      account_id: accountDetails.id,
    })
    await this.userService.createFamilyMembers({
      first_name: profileDetails.peopleDetails.names[0].displayName,
      relationship_id: 1,
      user_id: userData.id,
    })
    return userData
  }

  private async googleAuthorization(code: string) {
    const oauth2Client = this.makeGoogleOAuth2Client({
      clientId: environment.googleClientId,
      clientSecret: environment.googleClientSecretKey,
    })
    const authToken = await oauth2Client.getToken(code)

    oauth2Client.setCredentials({
      access_token: authToken.tokens.access_token,
      refresh_token: authToken.tokens.refresh_token,
    })
    const googleApi = google.people('v1')
    const peopleDetails = await googleApi.people.get({
      auth: oauth2Client,
      resourceName: 'people/me',
      personFields: 'names,phoneNumbers,emailAddresses,locations,locales',
    })
    return {
      peopleDetails: peopleDetails.data,
      access_token: authToken.tokens.access_token,
      refresh_token: authToken.tokens.refresh_token,
    }
  }

  private makeGoogleOAuth2Client({ clientId, clientSecret }) {
    return new google.auth.OAuth2(
      clientId,
      clientSecret,
      'https://localhost:4200',
    )
  }
}
