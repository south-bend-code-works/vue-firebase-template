"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routers_1 = require("../../utils/routers");
const restRouter = routers_1.default.secure;
const put_categories_1 = require("./put-categories");
restRouter.put('/categories', put_categories_1.putCategories);
const put_inquiries_1 = require("./put-inquiries");
restRouter.put('/inquiries', put_inquiries_1.putInquiries);
const put_coverages_1 = require("./put-coverages");
restRouter.put('/coverages', put_coverages_1.putCoverages);
const put_limits_1 = require("./put-limits");
restRouter.put('/limits', put_limits_1.putLimits);
exports.default = restRouter;
//# sourceMappingURL=index.js.map