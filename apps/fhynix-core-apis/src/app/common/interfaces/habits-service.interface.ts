export interface HabitsServiceInterface {
  getHabitsByRelationship(relationship: string): Promise<any>
}
