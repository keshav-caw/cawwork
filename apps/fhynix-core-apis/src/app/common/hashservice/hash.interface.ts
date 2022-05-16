export interface HashInterface {
    encrypt(password: string)
    compare(password: string,hashedPassword:string)
}