import CommonBootstrapper from './common/common.bootstrapper'
import ControllersBootstrapper from './controllers/controllers.bootstrapper'
import MiddlewaresBootstrapper from './middlewares/middlewares.bootstrapper'
import { DataStore } from './common/data/datastore'
import RepositoriesBootstrapper from './repositories/repositories.bootstrapper'
import ServicesBootstrapper from './services/services.bootstrapper'
import UserBootstrapper from './components/users/user.bootstrapper'
import AccountBootstrapper from './components/accounts/account.bootstrapper'

export default class Bootstrapper {
  public static initialize() {
    CommonBootstrapper.initialize()
    RepositoriesBootstrapper.initialize()
    ServicesBootstrapper.initialize()
    ControllersBootstrapper.initialize()
    UserBootstrapper.initialize()
    AccountBootstrapper.initialize()
    MiddlewaresBootstrapper.initialize()
    DataStore.initialize()
  }
}
