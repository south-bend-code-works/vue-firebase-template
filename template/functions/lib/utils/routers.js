"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const corsObj = require("cors");
const admin = require("firebase-admin");
const config = JSON.parse(process.env.FIREBASE_CONFIG + '');
const whitelist = (domains = []) => {
    if (config && config.projectId) {
        domains.unshift('https://' + config.projectId + '.firebaseapp.com');
        domains.unshift('https://' + config.projectId + '.web.app');
        domains.unshift('http://localhost:8080');
        domains.unshift('http://localhost:3000');
        domains.unshift('http://localhost:3001`');
    }
    return (origin, cb) => {
        if (domains.indexOf(origin) !== -1) {
            cb(null, true);
        }
        else {
            cb(new Error('Not allowed by CORS'));
        }
    };
};
const validateUser = (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');
    const authHeader = req.header('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.', 'Make sure you authorize your request by providing the following HTTP header:', 'Authorization: Bearer <Firebase ID Token>');
        res.status(403).send('Forbidden');
        return;
    }
    const idToken = authHeader.split('Bearer ')[1];
    admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
        console.log('ID Token correctly decoded'); // decodedIdToken)
        admin.firestore().collection('users').doc(decodedIdToken.uid).get().then((userSnapshot) => {
            req.user = {
                token: decodedIdToken,
                data: userSnapshot.data()
            };
            next();
        }, () => {
            res.status(500).send('Failed to find UserData for ' + decodedIdToken.uid);
        });
    }).catch((error) => {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(500).send('ID Token correct but no User found associated with token.');
    });
};
exports.default = {
    get unsecure() {
        const anywhere = corsObj({ origin: true });
        const unsecuredRouter = express.Router();
        unsecuredRouter.use(anywhere);
        return unsecuredRouter.use(anywhere);
    },
    get whitelisted() {
        const ourSites = corsObj({ origin: whitelist() });
        const whitelistedRouter = express.Router();
        whitelistedRouter.use(ourSites);
        return whitelistedRouter;
    },
    get secure() {
        const ourSites = corsObj({ origin: whitelist() });
        const userVerifiedRouter = express.Router();
        userVerifiedRouter.use(ourSites, validateUser);
        return userVerifiedRouter;
    },
};
//# sourceMappingURL=routers.js.map