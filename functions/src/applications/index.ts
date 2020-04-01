import * as express from 'express'
import * as functions from 'firebase-functions'

const applicationsApp = express()

import * as routers from './rest'

applicationsApp.use('', routers.restRouter)
applicationsApp.use('', routers.adminRouter)

export const applications = functions.https.onRequest(applicationsApp)