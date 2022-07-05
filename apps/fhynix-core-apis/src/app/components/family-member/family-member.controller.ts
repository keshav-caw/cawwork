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
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { CommonTypes } from '../../common/common.types'
import { FamilyMemberService } from './family-member.service'
import { FamilyMemberTypes } from './family-member.types'
import { RequestContext } from '../../common/jwtservice/requests-context.service'
import multer from 'multer'
import { ActivityService } from '../activity/activity.service'
import { ActivityTypes } from '../activity/activity.types'
import { StorageProvider } from '../../common/storage-provider/storage-provider.service'
import { fileStorage } from '../../middlewares/multer.middleware'
import { Images } from '../../common/constants/folder-names.constants'

@controller('/family-members')
export class FamilyMemberController implements interfaces.Controller {
  constructor(
    @inject(FamilyMemberTypes.familyMember)
    private familyMemberService: FamilyMemberService,
    @inject(CommonTypes.requestContext)
    private requestContext: RequestContext,
    @inject(ActivityTypes.activity)
    private activityService: ActivityService,
    @inject(CommonTypes.storage)
    private storageProvider: StorageProvider,
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
    let profileImage
    if (req.file) {
      profileImage = await this.storageProvider.uploadFile(req.file, Images)
    }
    const familyMember =
      await this.familyMemberService.createFamilyMemberForUser(
        JSON.parse(req.body.userData),
      )
    const activities = req.body.activities
      ? JSON.parse(req.body.activities)
      : []
    activities.forEach(
      (activity) => (activity.familyMemberId = familyMember[0].id),
    )
    if (activities?.length > 0) {
      await this.activityService.createActivitiesForRelationship(activities)
    }
    let familyDetails
    if (profileImage) {
      familyDetails = await this.familyMemberService.updateProfileImage(
        profileImage,
        familyMember[0].id,
      )
    }
    res.send(familyDetails ? familyDetails : familyMember)
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
    const profileImage = await this.storageProvider.uploadFile(req.file, Images)
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
    const userId = this.requestContext.getUserId()
    res.send(
      await this.familyMemberService.deleteFamilyMember(familyMemberId, userId),
    )
  }
}
