
import * as SignrequestClient from 'signrequest-client'
import * as functions from 'firebase-functions'


const defaultClient = SignrequestClient.ApiClient.instance
const Token = defaultClient.authentications['Token']
Token.apiKey = functions.config().sign_request.key
Token.apiKeyPrefix = 'Token'

export default SignrequestClient