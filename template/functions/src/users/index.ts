import * as express from 'express'
import * as functions from 'firebase-functions'

const usersApp = express()

import restRouter from './rest'
usersApp.use('', restRouter)

export const users = functions.https.onRequest(usersApp)