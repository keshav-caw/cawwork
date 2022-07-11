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
import { InsightRepository } from './insight.repository'

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
    @inject('InsightRepository')
    private insightRepository: InsightRepository,
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
      work: 0,
      sleep: 0,
      self: 0,
      kid: 0,
      partner: 0,
      family: 0,
      home: 0,
      other: 0,
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
        calculationOfInsights.work =
          (workHoursEndTime + 24 * 60 - workHoursStartTime) / 60
      } else {
        calculationOfInsights.work =
          (workHoursEndTime - workHoursStartTime) / 60
      }
    }
    calculationOfInsights.work = calculationOfInsights.work * this.daysPerWeek
    if (sleepHours) {
      const sleepHoursStartTime = this.getMinutesFromTimestamp(
        sleepHours.startTime,
      )
      const sleepHoursEndTime = this.getMinutesFromTimestamp(sleepHours.endTime)
      if (
        sleepHours.startTime.indexOf('PM') > -1 &&
        sleepHours.endTime.indexOf('AM') > -1
      ) {
        calculationOfInsights.sleep =
          0 + (sleepHoursEndTime + 24 * 60 - sleepHoursStartTime) / 60
      } else {
        calculationOfInsights.sleep =
          0 + (sleepHoursEndTime - sleepHoursStartTime) / 60
      }
    }

    calculationOfInsights.sleep = calculationOfInsights.sleep * this.daysPerWeek
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
    calculationOfInsights.other = otherHours
    const insightsNeededTobeSent = []
    Object.keys(calculationOfInsights).forEach((key) => {
      calculationOfInsights[key] =
        (Number(calculationOfInsights[key]) * 100) / numberOfHours
      const selectedRelationhip = relationships.find(
        (relationship) => relationship.relation === key,
      )
      insightsNeededTobeSent.push({
        tag: key,
        relationshipId: selectedRelationhip?.id,
        hours: calculationOfInsights[key],
        startDate: startDate,
        endDate: endDate,
      })
    })

    return insightsNeededTobeSent
  }

  async getInsightsOfOthers(): Promise<InsightModel[]> {
    return await this.insightRepository.getCohortInsights()
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
