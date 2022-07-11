import { InsightModel } from '../models/insight.model'

export interface InsightServiceInterface {
  getInsights(userId: string): Promise<InsightModel[]>
}
