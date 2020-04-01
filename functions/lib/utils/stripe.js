"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
exports.stripe = require('stripe')(functions.config().stripe.key);
//# sourceMappingURL=stripe.js.map