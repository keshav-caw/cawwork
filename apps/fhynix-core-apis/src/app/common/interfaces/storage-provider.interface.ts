export interface StorageProviderInterface {
  uploadFile(file: Express.Multer.File, filename)
}
