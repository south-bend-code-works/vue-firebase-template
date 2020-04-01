import {Request, Response} from 'express'
import * as admin from 'firebase-admin'
import { getFirebaseFileBase64, send3 } from '../../utils/email'
import * as fs from 'fs'
import * as path from 'path'

export const get = async (req: Request, res: Response) => {
  try {
    const fileBase64 = fs.readFileSync(path.resolve(__dirname, 'Appealing Your Assessment, What Your Assessor Won’t Tell You.pdf')).toString('base64')
    console.log(fileBase64)
  } catch (err) {
    console.error(err)
    return res.status(400).send({message: 'NOPE'})
  }
  return res.send('OK')
}