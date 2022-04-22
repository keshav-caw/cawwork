import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { UserRepositoryInterface } from './user-repository.interface'

@injectable()
export class UserRepository implements UserRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getUserDetails(userId: number) {
    const result = await this.client.user?.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phonenumber: true,
        emailId: true,
      },
      where: {
        id: Number(userId),
      },
    })
    return result ? result : []
  }
}
