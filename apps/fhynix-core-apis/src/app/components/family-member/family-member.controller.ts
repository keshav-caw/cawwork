import * as express from 'express'
import {
  interfaces,
  controller,
  request,
  response,
  httpPost,
  httpGet,
  httpDelete,
  next,
  queryParam,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { CommonTypes } from '../../common/common.types'
import { FamilyMemberService } from './family-member.service'
import { FamilyMemberTypes } from './family-member.types'
import { RequestContext } from '../../common/jwtservice/requests-context.service'
import multer from 'multer'
import { fileStorage } from '../../common/multerService/multer.service'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { HabitsService } from '../habits/habits.service'
import { HabitsTypes } from '../habits/habits.types'

@controller('/family-members')
export class FamilyMemberController implements interfaces.Controller {
  constructor(
    @inject(FamilyMemberTypes.familyMember)
    private familyMemberService: FamilyMemberService,
    @inject(CommonTypes.requestContext)
    private requestContext: RequestContext,
    @inject(HabitsTypes.habits)
    private habitsService: HabitsService,
  ) {}

  @httpGet('/', CommonTypes.jwtAuthMiddleware)
  public async getFamilyMembers(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const userId = this.requestContext.getUserId()
    const details = await this.familyMemberService.getFamilyMembers(userId)
    return res.send(details)
  }

  @httpPost('/', CommonTypes.jwtAuthMiddleware)
  private async createFamilyMember(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const familyDetails = await this.handleCreateFamilyMember(req, res)
    res.send(familyDetails)
  }

  @httpPost('/profile-pic', CommonTypes.jwtAuthMiddleware)
  private async updateProfilePic(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const familyMemberId = req.query.familyMemberId.toString()
    const uploadedResponse = await this.handleProfileImageUpload(
      req,
      res,
      familyMemberId,
    )
    res.send(uploadedResponse)
  }

  @httpDelete('/', CommonTypes.jwtAuthMiddleware)
  private async deleteFamilyMember(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const familyMemberId = req.query.familyMemberId.toString()
    res.send(await this.familyMemberService.deleteFamilyMember(familyMemberId))
  }

  handleProfileImageUpload(req, res, familyMemberId) {
    const upload = multer({ storage: fileStorage })
    return new Promise((resolve) => {
      return upload.single('file')(req, res, async (error: any) => {
        if (error) {
          throw new ArgumentValidationError(
            'Request is not valid',
            req.file,
            ApiErrorCode.E0003,
          )
        }

        resolve(
          await this.familyMemberService.updateProfileImage(
            req.file,
            familyMemberId,
          ),
        )
      })
    })
  }

  handleCreateFamilyMember(req, res) {
    const upload = multer({ storage: fileStorage })
    return new Promise((resolve) => {
      return upload.single('file')(req, res, async (error: any) => {
        if (error) {
          throw new ArgumentValidationError(
            'Request is not valid',
            req.file,
            ApiErrorCode.E0003,
          )
        }
        const familyMember =
          await this.familyMemberService.createFamilyMemberForUser(
            JSON.parse(req.body.userData),
          )
        const habits = JSON.parse(req.body.habits)
        habits.forEach((habit) => (habit.familyMemberId = familyMember[0].id))
        await this.habitsService.createHabitsForRelationship(habits)
        resolve(
          await this.familyMemberService.updateProfileImage(
            req.file,
            familyMember[0].id,
          ),
        )
      })
    })
  }
}
