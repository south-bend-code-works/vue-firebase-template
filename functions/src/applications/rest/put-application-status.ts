import {Request, Response} from 'express'
import * as admin from 'firebase-admin'
import { send } from '../../utils/email'

const VALID_STATUSES = ['APPROVED', 'NOT_APPEALED']
const STATUS_TO_TEMPLATE = {
  APPROVED: 'application_approved_to_applicant',
  NOT_APPEALED: 'application_not_appealed_to_applicant',
}

export const putApplicationStatus = async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId
  if (!applicationId) return res.status(400).send({message: 'Must include application id.'})

  const applicationsRef = admin.firestore().collection('applications')

  const status = req.body.status
  const origin = req.body.origin
  const application = (await applicationsRef.doc(applicationId).get()).data()

  if (!(application && origin && VALID_STATUSES.includes(status))) return res.status(400).send({message: 'Must include valid application and status.'})

  try {
    await admin.firestore().collection('applications').doc(applicationId).update({status})
  } catch (err) {
    console.error(err)
    return res.status(400).send({message: 'Could not update application status.'})
  }

  try {
    await send({
      to: application.email,
      template: STATUS_TO_TEMPLATE[status],
      substitutions: {
        applicant_name: application.name,
        link_to_pay: `${origin}/agreement-and-payment?applicationId=${applicationId}`, //won't be used in a denial but fine to keep here
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(400).send({message: 'Changed status but could not send email.'})
  }

  return res.send({message: 'OK'})
}