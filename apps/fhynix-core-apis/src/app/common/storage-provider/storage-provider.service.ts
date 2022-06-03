import { injectable } from 'inversify'
import 'reflect-metadata'
import { StorageProviderInterface } from '../interfaces/storage-provider.interface'
import AWS, { S3 } from 'aws-sdk'
import { environment } from 'apps/fhynix-core-apis/src/environments/environment'
import * as fs from 'fs'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { ThirdPartyAPIError } from '../errors/custom-errors/third-party.error'

@injectable()
export class StorageProvider implements StorageProviderInterface {
  s3: S3
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: environment.awsAccesskeyId,
      secretAccessKey: environment.awsSecretAccessKey,
    })
  }

  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<string> {
    const fileStream = fs.readFileSync('./' + file.path)
    const fileExt = file.originalname?.split('.')
    const fileExtension = fileExt?.[fileExt?.length - 1]
    const params = {
      Bucket: environment.s3BucketName + '/uploads',
      Key: `${folderName}/${file.path}.${fileExtension}`,
      Body: fileStream,
    }

    fs.unlinkSync('./' + file.path)
    try {
      const uploadedData = await this.s3.upload(params).promise()
      return uploadedData.Location
    } catch (e) {
      throw new ThirdPartyAPIError(ApiErrorCode.E0022)
    }
  }
}
