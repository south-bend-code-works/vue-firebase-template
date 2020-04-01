import * as express from 'express'
import * as functions from 'firebase-functions'

const formsApp = express()

import * as routers from './rest'

formsApp.use('', routers.unsecureRouter)
formsApp.use('', routers.adminRouter)

export const forms = functions.https.onRequest(formsApp)