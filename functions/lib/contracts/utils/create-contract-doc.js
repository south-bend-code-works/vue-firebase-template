"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const money_1 = require("../../utils/money");
const admin = require("firebase-admin");
const stream = require("stream");
exports.createAndUploadFileDoc = async (file) => {
    return new Promise((resolve) => {
        const findLimit = (id) => file.limits.find(limit => limit.id === id);
        const template = fs
            .readFileSync(path.resolve(__dirname, 'file_template.docx'), 'binary');
        const bucket = admin.storage().bucket();
        const file = bucket.file(`files/${file.id}.docx`);
        const zip = new PizZip(template);
        const doc = new Docxtemplater();
        doc.loadZip(zip);
        const limitData = file.limits.reduce((obj, limit) => {
            obj[`${limit.id}.notes`] = limit.notes;
            obj[`${limit.id}.amounts`] = limit.amounts.map(amount => Number.isInteger(amount) ? money_1.default(amount) : amount).join(' / ');
            return obj;
        }, {});
        // for the 1 doubled amount in the whole table
        limitData['General Liability.amounts.doubled'] = money_1.default(findLimit('General Liability').amounts[0] * 2);
        const data = Object.assign({}, limitData, { seller_vendor_name: file.seller_vendor_name, client_name: file.client_name });
        doc.setData(data);
        doc.render();
        const buf = doc.getZip().generate(); // returns base64 buffer
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(buf, 'base64'));
        bufferStream.pipe(file.createWriteStream())
            .on('finish', async () => {
            resolve((await file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491',
            }))[0]);
        });
    });
};
exports.default = exports.createAndUploadFileDoc;
//# sourceMappingURL=create-file-doc.js.map