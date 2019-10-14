"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const functions = require("firebase-functions");
const usersApp = express();
const rest_1 = require("./rest");
usersApp.use('', rest_1.default);
exports.users = functions.https.onRequest(usersApp);
//# sourceMappingURL=index.js.map