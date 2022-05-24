export interface HashServiceInterface {
    hashPassword(password: string)
    comparePlainPasswordWithHash(password: string,hashedPassword:string)
}