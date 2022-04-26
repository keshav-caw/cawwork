export interface AuthServiceInterface {
  login(userDetails: any)
  updateAccountDetails(
    access_token: string,
    refresh_token: string,
    accountId: number,
  )
}
