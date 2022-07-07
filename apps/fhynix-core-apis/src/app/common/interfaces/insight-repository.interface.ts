import { InsightModel } from '../models/insight.model'

export interface InsightRepositoryInterface {
  getCohortInsights(): Promise<InsightModel[]>
}
