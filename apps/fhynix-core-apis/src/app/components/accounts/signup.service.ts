import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { CommonTypes } from '../../common/common.types'
import { JWTService } from '../../common/jwtservice/jwt.service'
import { AuthRepository } from './auth.repository'
import { UserService } from '../users/user.service'
import { UserTypes } from '../users/user.types'
import { LoginMethodEnum } from '../../common/enums/login-method.enum'
import { AccountModel } from '../../common/models/account-model'
import { SignupServiceInterface } from '../../common/interfaces/auth-service.interface'
import { UserSignupModel } from '../../common/models/user-signup-model'
import { HashService } from '../../common/hashservice/hash.service'
import { UserModel } from '../../common/models/user-model'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'

@injectable()
export class SignupService implements SignupServiceInterface {
  constructor(
    @inject('AuthRepository') private authRepository: AuthRepository,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
    @inject(UserTypes.user) private userService: UserService,
    @inject(CommonTypes.hash) private hashService: HashService,
  ) {}

  async signup(userDetails: UserSignupModel) {
      if(userDetails.password!==userDetails.confirmPassword){
        throw new ArgumentValidationError(
            'Password',
            userDetails.password,
            ApiErrorCode.E0005,
        )
      }

      const user = await this.authRepository.getAccountDetails(userDetails.email);
      if(user?.length>0){
        throw new ArgumentValidationError(
            'Email',
            userDetails.email,
            ApiErrorCode.E0006,
        )
      }

      const encryptedPassword = await this.hashService.hashPassword(userDetails.password);

      const account:AccountModel = {
          username:userDetails.email,
          password:encryptedPassword,
          loginMethod:LoginMethodEnum.EMAIL_PASSWORD,
      };

      const accountDetails = await this.authRepository.createAccounts(account);

      const newUser: UserModel = {
        firstName:userDetails.firstName,
        lastName:userDetails.lastName,
        email: userDetails.email,
        isOnboardingCompleted: false,
        accountId: accountDetails.id,
      }

      const userData = await this.userService.createUser(newUser);

      const authToken = await this.jwtService.encode({
        userId: userData?.id,
        email: userData?.email,
      })
  
      return { authToken: authToken }
  }
}