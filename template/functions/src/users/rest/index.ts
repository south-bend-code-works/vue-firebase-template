import routers from '../../utils/routers'

const restRouter = routers.whitelisted

import { postUser } from './post-user'
restRouter.post('', postUser)

import { getOrgs } from './get-orgs'
restRouter.get(':userId/orgs', getOrgs)

export default restRouter