import {Request, Response} from 'express'
import * as admin from 'firebase-admin'
import { send } from '../../utils/email'

export const postApplicationPaymentEmail = async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId
  if (!applicationId) return res.status(400).send({message: 'Must include application id'})

  const applicationsRef = admin.firestore().collection('applications')

  const origin = req.body.origin
  const application = (await applicationsRef.doc(applicationId).get()).data()

  if (!(application && origin)) return res.status(400).send({message: 'Must include valid application and origin.'})

  try {
    await send({
      to: application.email,
      template: 'application_approved_to_applicant',
      substitutions: {
        applicant_name: application.name,
        link_to_pay: `${origin}/agreement-and-payment?applicationId=${applicationId}`, //won't be used in a denial but fine to keep here
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(400).send({message: 'Could not send email.'})
  }

  return res.send({message: 'OK'})
}