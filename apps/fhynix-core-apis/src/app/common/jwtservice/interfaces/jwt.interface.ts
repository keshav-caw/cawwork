export interface JWTInterface {
  validate(jwt: string)
  encode(details: object)
  decode(jwt: string)
}
