import { injectable } from 'inversify'
import 'reflect-metadata'
import { StorageProviderInterface } from '../interfaces/storage-provider.interface'
import AWS from 'aws-sdk'
import { environment } from 'apps/fhynix-core-apis/src/environments/environment'
import * as fs from 'fs'
import { ArgumentValidationError } from '../errors/custom-errors/argument-validation.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'

@injectable()
export class StorageProvider implements StorageProviderInterface {
  s3
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: environment.awsAccesskeyId,
      secretAccessKey: environment.awsSecretAccessKey,
    })
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileStream = fs.readFileSync('./' + file.path)
    const params = {
      Bucket: environment.s3BucketName,
      Key: `${file.path}.jpg`,
      Body: fileStream,
    }

    fs.unlinkSync('./' + file.path)
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
