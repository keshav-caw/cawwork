import multer from 'multer'

import { v4 as uuidv4 } from 'uuid'

export const fileStorage = multer.diskStorage({
  destination: function (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) {
    callback(null, './')
  },
  filename: function (_req: Express.Request, file: any, cb: any) {
    cb(null, uuidv4())
  },
})
