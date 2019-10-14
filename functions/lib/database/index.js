"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const functions = require("firebase-functions");
const databaseApp = express();
const rest_1 = require("./rest");
databaseApp.use('', rest_1.default);
exports.database = functions.https.onRequest(databaseApp);
//# sourceMappingURL=index.js.map