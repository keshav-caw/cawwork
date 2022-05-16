import { injectable } from 'inversify'
import 'reflect-metadata'
import { HashInterface } from './hash.interface'
const bcrypt = require("bcrypt");

@injectable()
export class HashService implements HashInterface{
    constructor() {
        //
    }

    async encrypt(password: string) {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        return encryptedPassword;
    }

    async compare(password: string, hashedPassword:string) {
        const isValid = await bcrypt.compare(password,hashedPassword);
        return isValid;
    }
}