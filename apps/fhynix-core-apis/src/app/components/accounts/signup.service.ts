import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { CommonTypes } from '../../common/common.types'
import { JWTService } from '../../common/jwtservice/jwt.service'
import { AuthRepository } from './auth.repository'
import { UserService } from '../users/user.service'
import { UserTypes } from '../users/user.types'
import { LoginMethodEnum } from '../../common/enums/login-method.enum'
import { AccountModel } from '../../common/models/account-model'
import { SignupServiceInterface } from '../../common/interfaces/signup-service.interface'
import { UserSignupModel } from '../../common/models/user-signup-model'
import { HashService } from '../../common/hashservice/hash.service'

@injectable()
export class SignupService implements SignupServiceInterface {
  constructor(
    @inject('AuthRepository') private authRepository: AuthRepository,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
    @inject(UserTypes.user) private userService: UserService,
    @inject(CommonTypes.hash) private hashService: HashService,
  ) {}

  async signup(userDetails: UserSignupModel) {

      const user = await this.authRepository.getAccountDetails(userDetails.email);
      if(user?.length>0){
          throw new Error("Email already Exists");
      }

      if(userDetails.password!==userDetails.confirmPassword){
          throw new Error("Password and confirm password should be same");
      }

      const encryptedPassword = await this.hashService.encrypt(userDetails.password);

      let account:AccountModel = {
          username:userDetails.email,
          password:encryptedPassword,
          loginMethod:LoginMethodEnum.EMAIL_PASSWORD,
      };

      account = await this.authRepository.createAccounts(account);

      const userData = await this.userService.createUser({
        email: userDetails.email,
        phone: userDetails.phone,
        isOnboardingCompleted: false,
        accountId: account.id,
      })

      const authToken = await this.jwtService.encode({
        userId: userData?.id,
        email: userData?.email,
      })
  
      return { authToken: authToken }
  }
}