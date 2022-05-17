import { injectable } from 'inversify'
import 'reflect-metadata'
import { HashServiceInterface } from './hash-service.interface'
const bcrypt = require("bcrypt");

@injectable()
export class HashService implements HashServiceInterface{
    constructor() {
        //
    }

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        return encryptedPassword;
    }

    async comparePlainPasswordWithHash(password: string, hashedPassword:string) {
        const isValid = await bcrypt.compare(password,hashedPassword);
        return isValid;
    }
}