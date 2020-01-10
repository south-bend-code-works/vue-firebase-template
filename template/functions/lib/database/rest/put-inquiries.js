"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const inquiries_1 = require("../../json/inquiries");
exports.putInquiries = async (req, res) => {
    Object.keys(inquiries_1.default).forEach(async (id) => {
        admin.firestore().collection('inquiries').doc(id).set(inquiries_1.default[id]).then(_ => _).catch(_ => _);
    });
    res.send('OK');
};
//# sourceMappingURL=put-inquiries.js.map