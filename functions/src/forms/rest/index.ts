import routers from '../../utils/routers'

/// export const restRouter = routers.whitelisted
export const adminRouter = routers.admin
export const unsecureRouter = routers.unsecure

import { postAppealForm } from './post-appeal-form'
adminRouter.post('/appeal-form', postAppealForm)

import { postSignRequestEvent } from './post-sign-request-event'
unsecureRouter.post('/sign-request-event', postSignRequestEvent)

import { putAppealFormEmail } from './put-appeal-form-email'
adminRouter.put('/appeal-forms/:signrequestId/email', putAppealFormEmail)