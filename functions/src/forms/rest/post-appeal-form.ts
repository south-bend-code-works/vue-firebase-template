import {Request, Response} from 'express'
import * as admin from 'firebase-admin'
import SignrequestClient from '../../utils/signrequest'
import { send3, getFirebaseFileBase64 } from '../../utils/email'
import { isLocal, getLocalFile } from '../../utils/methods'


export const postAppealForm = async (req: Request, res: Response) => {
  const applicationId = req.body.applicationId
  const form = req.body.form
  const origin = req.body.origin

  if (!(applicationId && origin)) return res.status(400).send({message: 'Post must include applicationId, and origin'})

  const firestore = admin.firestore()
  const applicationsRef = firestore.collection('applications')

  let application
  try {
    application = (await applicationsRef.doc(applicationId).get()).data()
  } catch (err) {
    console.error('Trouble retrieving application:', err)
    return res.status(400).send({message: 'Could not retrieve application.'})
  }

  if (!application) return res.status(400).send({message: 'No application associated with the applicationId.'})

  let signRequest
  try {
    signRequest = await createDocument(form, origin)
  } catch (err) {
    console.error('Trouble with creating Sign Request document:', err)
    return res.status(400).send({message: 'Could not send Sign Request.'})
  }

  try {
    await admin.firestore().collection('applications').doc(applicationId).update({sign_request_id: signRequest.uuid})
  } catch (err) {
    console.error('Trouble with saving document ID:', err)
    return res.status(400).send({message: 'Could not save appeal form ID.'})
  }

  try {
    await sendApplicantEmail(application)
  } catch (err) {
    console.error('Could not send applicant email after appeal form created:', err)
    return res.status(400).send({message: 'Could not send applicant email.'})
  }


  res.send('OK')
}

const sendApplicantEmail = application => new Promise(async (resolve, reject) => {
  //this ebook file must be kept in the 'utils' directory in order to be found by the util function
  const ebook = getLocalFile('Appealing Your Assessment, What Your Assessor Won’t Tell You.pdf')
  const evidenceFiles = await Promise.all(application.evidence.map(evidence => getFirebaseFileBase64(`evidence/${application.id}/${evidence.name}`)))

  try {
    await send3({
      to: application.email,
      html: '_', //needs to be here for SOME EFFING REASON PISSING ME OFF IS PROLLY WHY LIKE WHY THE FRIGGIN FRIG
      template: 'appeal_form_created_to_applicant',
      replyTo: 'beth@correctpropertytax.com',
      substitutions: {
        user_name: application.name,
      },
      // first, attach the ebook and then any evidence thereafter
      attachments: [
        {
          content: ebook,
          filename: 'Appealing Your Assessment, What Your Assessor Won’t Tell You.pdf',
          type: 'application/pdf',
        },
        ...evidenceFiles.map((file, idx) => ({
          content: file,
          filename: application.evidence[idx].name,
          type: application.evidence[idx].type,
        }))
      ],
    })
    resolve()
  } catch (err) {
    reject(err)
  }
})

const createDocument = (form, origin) => new Promise(async (resolve, reject) => {
  const apiInstance = new SignrequestClient.SignrequestQuickCreateApi()
  const data = new SignrequestClient.SignRequestQuickCreate()

  // this template_id can be found and changed at https://codeworks.signrequest.com/api/v1/templates/
  const systemIds = (await admin.firestore().collection('system').doc('ids').get()).data()
  data.template = systemIds ? systemIds.sign_request_template : ''
  data.from_email = isLocal() ? 'josh@southbendcodeschool.com' : 'beth@correctpropertytax.com'
  data.redirect_url = `${origin}/signed-success` //brings the user back to our site instead of SignRequest's site

  data.signers = [{
    email: form.email,
  }]

  //must delete reasons_for_request because the 'text' field is an array which causes an error
  const reasonsForRequest = form.reasons_for_request
  delete form.reasons_for_request

  data.prefill_tags = [
    ...Object.keys(form).map(field => ({external_id: field, text: form[field]})),
    {
      external_id: 'year',
      text: String(new Date().getFullYear() - 2000), //only wants the last 2 digits
    },
    {
      external_id: 'phone_area_code',
      text: form.phone.slice(-10, -7),
    },
    {
      external_id: 'phone_remaining',
      text: form.phone.slice(-7),
    },
    ...reasonsForRequest.map((reason, idx) => ({external_id: `reasons_for_request_${idx}`, text: reason})), //allows those line breaks in the reasons for request
  ]

  //prevents people from filling in text that just isn't filled in
  data.disable_text = true

  apiInstance.signrequestQuickCreateCreate(data, (error, resData) => {
    if (error) return reject(error)
    resolve(resData)
  })
})