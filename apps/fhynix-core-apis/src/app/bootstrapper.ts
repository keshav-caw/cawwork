import CommonBootstrapper from './common/common.bootstrapper'
import MiddlewaresBootstrapper from './middlewares/middlewares.bootstrapper'
import { DataStore } from './common/data/datastore'
import UserBootstrapper from './components/users/user.bootstrapper'
import AccountBootstrapper from './components/accounts/account.bootstrapper'
import HealthCheckBootstrapper from './common/controllers/health-check.bootstrapper'

export default class Bootstrapper {
  public static initialize() {
    CommonBootstrapper.initialize()
    UserBootstrapper.initialize()
    AccountBootstrapper.initialize()
    MiddlewaresBootstrapper.initialize()
    DataStore.initialize()
    HealthCheckBootstrapper.initialize()
  }
}
