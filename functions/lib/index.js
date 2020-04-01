"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
// next line is imported for the side effects that populate process.env.FIREBASE_CONFIG
require("firebase-functions"); // tslint:disable-line
const firebase_cert_1 = require("./utils/firebase-cert");
const firebaseConfig = JSON.parse(String(process.env.FIREBASE_CONFIG));
admin.initializeApp(Object.assign({}, firebaseConfig, { credential: admin.credential.cert(firebase_cert_1.default) }));
__export(require("./test"));
__export(require("./applications"));
__export(require("./forms"));
//# sourceMappingURL=index.js.map