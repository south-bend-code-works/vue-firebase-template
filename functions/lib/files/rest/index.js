"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routers_1 = require("../../utils/routers");
const restRouter = routers_1.default.secure;
const post_file_1 = require("./post-file");
restRouter.post('', post_file_1.postFile);
exports.default = restRouter;
//# sourceMappingURL=index.js.map