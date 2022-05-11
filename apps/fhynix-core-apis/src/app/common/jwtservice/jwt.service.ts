import { injectable } from 'inversify'
import 'reflect-metadata'
import { JWTInterface } from './interfaces/jwt.interface'
import jwt from 'jsonwebtoken'
import { environment } from '../../../environments/environment'

@injectable()
export class JWTService implements JWTInterface {
  constructor() {
    //
  }
  public validate(token: string) {
    token = token.replace('Bearer ', '')
    const verifiedData = jwt.verify(token, environment.jwtPrivateKey)
    return verifiedData
  }
  public encode(details: object) {
    const jwtToken = jwt.sign(details, environment.jwtPrivateKey)
    return jwtToken
  }
  public decode(token: string) {
    token = token.replace('Bearer ', '')
    if (token) {
      const jsonPayload = jwt.decode(token)
      return jsonPayload
    } else {
      return null
    }
  }
}
