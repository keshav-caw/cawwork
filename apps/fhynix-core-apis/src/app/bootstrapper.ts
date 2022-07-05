import CommonBootstrapper from './common/common.bootstrapper'
import MiddlewaresBootstrapper from './middlewares/middlewares.bootstrapper'
import { DataStore } from './common/data/datastore'
import UserBootstrapper from './components/users/user.bootstrapper'
import AccountBootstrapper from './components/accounts/account.bootstrapper'
import HealthCheckBootstrapper from './common/controllers/health-check.bootstrapper'
import FamilyMemberBootstrapper from './components/family-member/family-member.bootstrapper'
import RelationshipBootstrapper from './components/relationship/relationship.bootstrapper'
import ActivityBootstrapper from './components/activity/activity.bootstrapper'
import ArticleBootstrapper from './components/articles/article.bootstrapper'
import UtilityBootstrapper from './components/utilities/utility.bootstrapper'
import TaskBootstrapper from './components/task/task.bootstrapper'
import ProductBootstrapper from './components/products/product.bootstrapper'

export default class Bootstrapper {
  public static initialize() {
    CommonBootstrapper.initialize()
    UserBootstrapper.initialize()
    AccountBootstrapper.initialize()
    ArticleBootstrapper.initialize()
    ProductBootstrapper.initialize()
    UtilityBootstrapper.initialize()
    ActivityBootstrapper.initialize()
    FamilyMemberBootstrapper.initialize()
    RelationshipBootstrapper.initialize()
    TaskBootstrapper.initialize()
    MiddlewaresBootstrapper.initialize()
    DataStore.initialize()
    HealthCheckBootstrapper.initialize()
  }
}
