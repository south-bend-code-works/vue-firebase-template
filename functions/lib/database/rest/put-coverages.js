"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const coverages_1 = require("../../json/coverages");
exports.putCoverages = async (req, res) => {
    Object.keys(coverages_1.default).forEach(async (id) => {
        admin.firestore().collection('coverages').doc(id).set(coverages_1.default[id]).then(_ => _).catch(_ => _);
    });
    res.send('OK');
};
//# sourceMappingURL=put-coverages.js.map