import { injectable } from 'inversify'
import 'reflect-metadata'
import { google } from 'googleapis'

@injectable()
export class GoogleAuthProvider {
  makeGoogleOAuth2Client({ clientId, clientSecret }) {
    return new google.auth.OAuth2(
      clientId,
      clientSecret,
      'https://localhost:4200',
    )
  }

  makeGooglePeopleApi() {
    return google.people('v1')
  }
}
