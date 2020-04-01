import * as functions from 'firebase-functions'

export const stripe = require('stripe')(functions.config().stripe.key)