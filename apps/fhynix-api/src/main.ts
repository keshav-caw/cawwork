// import express from 'express';
// import { Message } from '@monorepo-react-node/api-interfaces';
import Bootstrapper from './app/bootstrapper'
import errorMiddleWare from './app/middlewares/error.middleware'
import { CommonContainer } from './app/common/container'
import * as bodyParser from 'body-parser'
import { InversifyExpressServer } from 'inversify-express-utils'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger.json'

Bootstrapper.initialize()

// create server
const server = new InversifyExpressServer(CommonContainer)
server.setConfig((app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  )
  app.use(bodyParser.json())
})

server.setErrorConfig((appForErrorConfig) => {
  appForErrorConfig.use(errorMiddleWare)
})
const app = server.build()
app.listen(3000)
