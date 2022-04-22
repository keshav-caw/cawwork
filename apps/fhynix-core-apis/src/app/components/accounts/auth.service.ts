import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { CommonTypes } from '../../common/common.types'
import { JWTService } from '../../common/jwtservice/jwt.service'
import { AuthServiceInterface } from '../../common/interfaces/auth-service.interface'
import { AuthRepository } from './auth.repository'

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject('AuthRepository') private authRepository: AuthRepository,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
  ) {}
  async login(userDetails) {
    const details = await this.authRepository.getLoginDetails(userDetails)
    if (details?.length > 0) {
      const authToken = await this.jwtService.encode({
        firstName: details[0].firstName,
        lastName: details[0].lastName,
        emailId: details[0].emailId,
      })
      return { authToken: authToken }
    } else {
      return { message: 'Invalid username or passowrd', status: 400 }
    }
  }

  async createUserDetails(userDetails) {
    return await this.authRepository.createUserDetails(userDetails)
  }
}
