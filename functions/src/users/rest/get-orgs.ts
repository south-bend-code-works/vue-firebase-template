import {Request, Response} from 'express'
import * as admin from 'firebase-admin'

export const getOrgs = async (req: Request, res: Response) => {
  const uid = req.params.userId
  const tokenUserId = req['user'].token.user_id
  if (uid !== tokenUserId) {
    return res.status(403).send({message: `Requested user ID and token user ID do not match: requested: ${uid}, token: ${tokenUserId}`})
  }

  const orgUserRelationships = (await admin.firestore().collection('orgUserRelationships').where('user_id', '==', uid).get()).docs.map(doc => doc.data())
  if (orgUserRelationships.length < 1) {
    return res.status(400).send({message: `No orgs were found for the following user: ${uid}`})
  }

  const orgs = (await Promise.all(orgUserRelationships.map(rel => admin.firestore().collection('orgs').doc(rel.org_id).get()))).map(ss => ss.data())
  const orgsPrivate = (await Promise.all(orgUserRelationships.map(rel => admin.firestore().collection('private/entities/orgs').doc(rel.org_id).get()))).map(ss => ss.data())
  
  return res.send({
    orgUserRelationships,
    orgs,
    orgsPrivate,
  })
}