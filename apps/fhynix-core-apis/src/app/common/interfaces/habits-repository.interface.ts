export interface HabitsRepositoryInterface {
  getHabitsByRelationship(relationship: string): Promise<any>
}
