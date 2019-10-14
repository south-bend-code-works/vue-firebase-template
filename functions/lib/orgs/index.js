"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const functions = require("firebase-functions");
const orgsApp = express();
const rest_1 = require("./rest");
orgsApp.use('', rest_1.default);
exports.orgs = functions.https.onRequest(orgsApp);
//# sourceMappingURL=index.js.map