"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const functions = require("firebase-functions");
const filesApp = express();
const rest_1 = require("./rest");
filesApp.use('', rest_1.default);
exports.files = functions.https.onRequest(filesApp);
//# sourceMappingURL=index.js.map