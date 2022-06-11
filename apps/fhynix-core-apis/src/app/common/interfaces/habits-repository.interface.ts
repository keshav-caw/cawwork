import { HabitsModel } from '../models/habits-model'

export interface HabitsRepositoryInterface {
  getHabitsByRelationship(relationship: string): Promise<HabitsModel[]>
}
