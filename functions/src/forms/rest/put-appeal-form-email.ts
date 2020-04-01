import {Request, Response} from 'express'
import SignrequestClient from '../../utils/signrequest'


export const putAppealFormEmail = async (req: Request, res: Response) => {
  const signrequestId = req.params.signrequestId
  const apiInstance = new SignrequestClient.SignrequestsApi()
  
  apiInstance.signrequestsResendSignrequestEmail(signrequestId, (error, data, response) => {
    if (error) {
      console.error(error)
      return res.status(400).send({message: 'Could not resend email.'})
    }

    res.send('OK')
  })
}