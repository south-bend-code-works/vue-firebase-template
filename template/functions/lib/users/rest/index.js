"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routers_1 = require("../../utils/routers");
const restRouter = routers_1.default.whitelisted;
const post_user_1 = require("./post-user");
restRouter.post('', post_user_1.postUser);
const get_orgs_1 = require("./get-orgs");
restRouter.get(':userId/orgs', get_orgs_1.getOrgs);
exports.default = restRouter;
//# sourceMappingURL=index.js.map