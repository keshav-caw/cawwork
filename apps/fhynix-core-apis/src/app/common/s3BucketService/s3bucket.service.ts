import { injectable } from 'inversify'
import 'reflect-metadata'
import { IS3Bucket } from '../interfaces/s3Bucket-service.interface'
import AWS from 'aws-sdk'
import { environment } from 'apps/fhynix-core-apis/src/environments/environment'

@injectable()
export class S3BucketService implements IS3Bucket {
  s3
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: environment.awsAccesskeyId,
      secretAccessKey: environment.awsSecretAccessKey,
    })
  }

  async uploadImageToS3Bucket(imageBase64Object: string, filename: string) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${filename}.jpg`,
      Body: imageBase64Object,
    }

    const data = await this.s3.upload(params)
    return data
  }
}
