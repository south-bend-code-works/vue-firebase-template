"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse = require("../../utils/parse-csv");
const admin = require("firebase-admin");
const replace_slash_1 = require("../../utils/replace-slash");
exports.putCategories = async (req, res) => {
    const json = await parse.headerAndColumn('src/csv_files/file_type_by_category.csv');
    const categsRef = admin.firestore().collection('categories');
    Object.keys(json).forEach(category => {
        categsRef.doc(category).set({
            id: category,
            file_type_ids: json[category].map(id => replace_slash_1.default(id)),
            display_name: category,
        }).then(_ => _).catch(_ => _);
    });
    res.send('OK');
};
//# sourceMappingURL=put-categories.js.map