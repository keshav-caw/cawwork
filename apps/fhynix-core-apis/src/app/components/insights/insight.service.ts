import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { InsightServiceInterface } from '../../common/interfaces/insight-service.interface'
import { TaskService } from '../task/task.service'
import { TaskTypes } from '../task/task.types'
import dayjs from 'dayjs'
import { UserService } from '../users/user.service'
import { UserTypes } from '../users/user.types'
import { RelationshipTypes } from '../relationship/realtionship.types'
import { RelationshipService } from '../relationship/relationship.service'
import { InsightModel } from '../../common/models/insight.model'

@injectable()
export class InsightService implements InsightServiceInterface {
  daysPerWeek = 7

  constructor(
    @inject(TaskTypes.task)
    private taskService: TaskService,
    @inject(UserTypes.user)
    private userService: UserService,
    @inject(RelationshipTypes.relationship)
    private relationshipService: RelationshipService,
  ) {}

  async getInsights(userId: string): Promise<InsightModel[]> {
    const dayOfWeek = dayjs().get('day')
    const startDate = dayjs(new Date().setHours(0, 0, 0, 0))
      .subtract(dayOfWeek, 'day')
      .toISOString()
    const endDate = dayjs(new Date(startDate).setHours(0, 0, 0, 0))
      .add(7, 'day')
      .toISOString()

    const tasks = await this.taskService.getTasksByStartAndEndDate(
      userId,
      startDate,
      endDate,
    )
    const userDetails = await this.userService.getUserDetail(userId)
    const numberOfHours = this.daysPerWeek * 24
    const timingsOfUser = userDetails?.[0]?.['otherInfo']?.[0]
    const workHours = timingsOfUser?.workHours
    const sleepHours = timingsOfUser?.sleepHours

    const calculationOfInsights = {
      workHours: 0,
      sleepHours: 0,
      self: 0,
      kid: 0,
      partner: 0,
      family: 0,
      home: 0,
      work: 0,
      others: 0,
    }
    if (workHours) {
      const workHoursStartTime = this.getMinutesFromTimestamp(
        workHours.startTime,
      )
      const workHoursEndTime = this.getMinutesFromTimestamp(workHours.endTime)

      if (
        workHours.startTime.indexOf('PM') > -1 &&
        workHours.endTime.indexOf('AM') > -1
      ) {
        calculationOfInsights.workHours =
          (workHoursEndTime + 24 * 60 - workHoursStartTime) / 60
      } else {
        calculationOfInsights.workHours =
          (workHoursEndTime - workHoursStartTime) / 60
      }
    }
    calculationOfInsights.workHours =
      calculationOfInsights.workHours * this.daysPerWeek
    if (sleepHours) {
      const sleepHoursStartTime = this.getMinutesFromTimestamp(
        sleepHours.startTime,
      )
      const sleepHoursEndTime = this.getMinutesFromTimestamp(sleepHours.endTime)
      if (
        sleepHours.startTime.indexOf('PM') > -1 &&
        sleepHours.endTime.indexOf('AM') > -1
      ) {
        calculationOfInsights.sleepHours =
          0 + (sleepHoursEndTime + 24 * 60 - sleepHoursStartTime) / 60
      } else {
        calculationOfInsights.sleepHours =
          0 + (sleepHoursEndTime - sleepHoursStartTime) / 60
      }
    }

    calculationOfInsights.sleepHours =
      calculationOfInsights.sleepHours * this.daysPerWeek
    const relationships = await this.relationshipService.getRelationships()

    tasks.forEach((task) => {
      const seletedRelationship = relationships.find(
        (relationship) => relationship.id === task.relationshipId,
      )
      if (seletedRelationship) {
        const hours = (
          dayjs(task.endAtUtc).diff(dayjs(task.startAtUtc), 'minutes') / 60
        ).toFixed(2)
        calculationOfInsights[seletedRelationship.relation] =
          Number(calculationOfInsights[seletedRelationship.relation]) +
          Number(hours)
      }
    })
    let otherHours = numberOfHours
    Object.keys(calculationOfInsights).forEach((key) => {
      otherHours -= Number(calculationOfInsights[key])
    })
    calculationOfInsights.others = otherHours
    const insightsNeededTobeSent = []
    Object.keys(calculationOfInsights).forEach((key) => {
      calculationOfInsights[key] =
        (Number(calculationOfInsights[key]) * 100) / numberOfHours
      const selectedRelationhip = relationships.find(
        (relationship) => relationship.relation === key,
      )
      insightsNeededTobeSent.push({
        name: key,
        relationshipId: selectedRelationhip?.id,
        percentage: calculationOfInsights[key],
        startDate: startDate,
        endDate: endDate,
      })
    })

    return insightsNeededTobeSent
  }

  getMinutesFromTimestamp(timestamp): number {
    const isAm = timestamp?.indexOf('AM') > -1
    const time = timestamp?.replace(' PM', '')?.replace(' AM', '')?.split(':')
    const hours = Number(time[0])
    const minutes = Number(time[1])

    if (isAm) {
      return Number(Number(hours === 12 ? 0 : hours * 60) + minutes)
    } else {
      return Number(
        Number(hours === 12 ? hours * 60 : (hours + 12) * 60) + minutes,
      )
    }
  }
}
