"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const create_file_doc_1 = require("../utils/create-file-doc");
let COVERAGES;
const getCoverages = () => {
    return new Promise((resolve) => {
        if (COVERAGES) {
            resolve(COVERAGES);
            return;
        }
        admin.firestore().collection('coverages').onSnapshot((qs) => {
            COVERAGES = qs.docs.map(doc => doc.data());
            resolve(COVERAGES);
        });
    });
};
getCoverages();
const writingRoles = [
    'OWNER',
];
exports.postFile = async (req, res) => {
    const uid = req['user'].token.uid;
    const file = req.body;
    const role = (await admin.firestore().collection('roles').doc(file.org_id + uid).get()).data();
    if (!role || !writingRoles.includes(role.title))
        return res.status(403).send({ message: 'User does not have writing role.' });
    const coverages = await getCoverages();
    file.limits = [];
    const limits = (await admin.firestore().collection('limits').doc(file.file_type_id).get()).data();
    coverages.forEach(async (coverage) => {
        const amounts = eval(coverage.limit_func)(file, limits);
        const notes = eval(coverage.notes_func)(file, file);
        file.limits.push({
            id: coverage.id,
            amounts,
            notes,
        });
    });
    const downloadUrl = await create_file_doc_1.default(file);
    file.download_url = downloadUrl;
    await admin.firestore().collection('files').doc(file.id).set(file);
    return res.send('OK');
};
//# sourceMappingURL=post-file.js.map