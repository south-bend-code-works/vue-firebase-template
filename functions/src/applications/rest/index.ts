import routers from '../../utils/routers'

export const restRouter = routers.whitelisted
export const adminRouter = routers.admin

import { postApplication } from './post-application'
restRouter.post('', postApplication)

import { putApplicationStatus } from './put-application-status'
adminRouter.put('/:applicationId/status', putApplicationStatus)

import { postApplicationPayment } from './post-application-payment'
restRouter.post('/:applicationId/payment', postApplicationPayment)

import { postApplicationPaymentEmail } from './post-application-payment-email'
adminRouter.post('/:applicationId/payment/email', postApplicationPaymentEmail)

import { postApplicationQuestionnaire } from './post-application-questionnaire'
restRouter.post('/:applicationId/questionnaire', postApplicationQuestionnaire)

import { postApplicationQuestionnaireEmail } from './post-application-questionnaire-email'
adminRouter.post('/:applicationId/questionnaire/email', postApplicationQuestionnaireEmail)

import { postApplicationAssessorsEmail } from './post-application-assessors-email'
adminRouter.post('/:applicationId/assessors-email', postApplicationAssessorsEmail)