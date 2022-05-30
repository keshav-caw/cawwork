import { injectable } from 'inversify'
import 'reflect-metadata'
import { IS3Bucket } from '../interfaces/s3Bucket-service.interface'
import AWS from 'aws-sdk'
import { environment } from 'apps/fhynix-core-apis/src/environments/environment'
import * as fs from 'fs'
import { ArgumentValidationError } from '../errors/custom-errors/argument-validation.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'

@injectable()
export class S3BucketService implements IS3Bucket {
  s3
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: environment.awsAccesskeyId,
      secretAccessKey: environment.awsSecretAccessKey,
    })
  }

  async uploadImageToS3Bucket(file: Express.Multer.File): Promise<string> {
    const fileStream = fs.readFileSync('./' + file.path)
    const params = {
      Bucket: environment.s3BucketName,
      Key: `${file.path}.jpg`,
      Body: fileStream,
    }

    return new Promise((resolve) => {
      return this.s3.upload(params, function (err, data) {
        if (err) {
          throw new ArgumentValidationError(
            'Failed to upload file to s3 bucket',
            file,
            ApiErrorCode.E0022,
          )
        }
        resolve(data.Location)
      })
    })
  }
}
