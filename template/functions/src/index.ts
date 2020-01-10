import * as admin from 'firebase-admin'
import * as serviceAccount from './service-account.json'

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG + '')

admin.initializeApp({
  ...firebaseConfig,
  credential: admin.credential.cert(serviceAccount as any)
})
// export * from './database'
// export * from './files'
export * from './users'