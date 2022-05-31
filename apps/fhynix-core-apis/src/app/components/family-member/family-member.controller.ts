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
import { HabitsService } from '../habits/habits.service'
import { HabitsTypes } from '../habits/habits.types'
import { S3BucketService } from '../../common/s3BucketService/s3bucket.service'

@controller('/family-members')
export class FamilyMemberController implements interfaces.Controller {
  constructor(
    @inject(FamilyMemberTypes.familyMember)
    private familyMemberService: FamilyMemberService,
    @inject(CommonTypes.requestContext)
    private requestContext: RequestContext,
    @inject(HabitsTypes.habits)
    private habitsService: HabitsService,
    @inject(CommonTypes.s3Bucket)
    private s3Bucket: S3BucketService,
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

  @httpPost(
    '/',
    CommonTypes.jwtAuthMiddleware,
    multer({ storage: fileStorage }).single('file'),
  )
  private async createFamilyMember(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const profileImage = await this.s3Bucket.uploadImageToS3Bucket(req.file)
    const familyMember =
      await this.familyMemberService.createFamilyMemberForUser(
        JSON.parse(req.body.userData),
      )
    const habits = JSON.parse(req.body.habits)
    habits.forEach((habit) => (habit.familyMemberId = familyMember[0].id))
    await this.habitsService.createHabitsForRelationship(habits)
    const familyDetails = await this.familyMemberService.updateProfileImage(
      profileImage,
      familyMember[0].id,
    )
    res.send(familyDetails)
  }

  @httpPost(
    '/profile-pic',
    CommonTypes.jwtAuthMiddleware,
    multer({ storage: fileStorage }).single('file'),
  )
  private async updateProfilePic(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const familyMemberId = req.query.familyMemberId.toString()
    const profileImage = await this.s3Bucket.uploadImageToS3Bucket(req.file)
    const uploadedResponse = await this.familyMemberService.updateProfileImage(
      profileImage,
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
}
