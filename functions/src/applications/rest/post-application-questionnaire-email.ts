import {Request, Response} from 'express'
import * as admin from 'firebase-admin'
import { send } from '../../utils/email'

export const postApplicationQuestionnaireEmail = async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId
  if (!applicationId) return res.status(400).send({message: 'Must include application id'})

  const applicationsRef = admin.firestore().collection('applications')

  const origin = req.body.origin
  const application = (await applicationsRef.doc(applicationId).get()).data()

  if (!(application && origin)) return res.status(400).send({message: 'Must include valid application and origin.'})

  try {
    await send({
      to: application.email,
      substitutions: {
        applicant_name: application.name,
        questions_link: `${origin}/appeal-questionnaire?applicationId=${application.id}`,
      },
      template: 'application_paid_to_applicant',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).send({message: 'Could not send email.'})
  }

  return res.send({message: 'OK'})
}