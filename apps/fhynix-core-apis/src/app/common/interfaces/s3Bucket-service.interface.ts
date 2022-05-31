export interface IS3Bucket {
  uploadImageToS3Bucket(file: Express.Multer.File, filename)
}
