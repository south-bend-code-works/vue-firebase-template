import routers from '../../utils/routers'

const restRouter = routers.whitelisted

import { get } from './get'
restRouter.get('', get)

export default restRouter