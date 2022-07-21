import CommonBootstrapper from './common/common.bootstrapper'
import MiddlewaresBootstrapper from './middlewares/middlewares.bootstrapper'
import { DataStore } from './common/data/datastore'
import UserBootstrapper from './components/users/user.bootstrapper'
import AccountBootstrapper from './components/accounts/account.bootstrapper'
import HealthCheckBootstrapper from './common/controllers/health-check.bootstrapper'
import FamilyMemberBootstrapper from './components/family-member/family-member.bootstrapper'
import RelationshipBootstrapper from './components/relationship/relationship.bootstrapper'
import ActivityBootstrapper from './components/activity/activity.bootstrapper'
import UtilityBootstrapper from './components/utilities/utility.bootstrapper'
import TaskBootstrapper from './components/task/task.bootstrapper'
import InsightpBootstrapper from './components/insight/insight.bootstrapper'
import SuggestionBootstrapper from './components/suggestions/suggestion.bootstrapper'

export default class Bootstrapper {
  public static initialize() {
    CommonBootstrapper.initialize()
    UserBootstrapper.initialize()
    AccountBootstrapper.initialize()
    SuggestionBootstrapper.initialize()
    UtilityBootstrapper.initialize()
    ActivityBootstrapper.initialize()
    FamilyMemberBootstrapper.initialize()
    RelationshipBootstrapper.initialize()
    TaskBootstrapper.initialize()
    InsightpBootstrapper.initialize()
    MiddlewaresBootstrapper.initialize()
    DataStore.initialize()
    HealthCheckBootstrapper.initialize()
  }
}
