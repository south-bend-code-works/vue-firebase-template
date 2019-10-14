"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG + '');
const serviceAccount = JSON.parse(functions.config().system.service_account.replace(new RegExp('\'', 'g'), '"') + '');
admin.initializeApp(Object.assign({}, firebaseConfig, { credential: admin.credential.cert(serviceAccount) }));
// export * from './database'
// export * from './files'
__export(require("./users"));
//# sourceMappingURL=index.js.map