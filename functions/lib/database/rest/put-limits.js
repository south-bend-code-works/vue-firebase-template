"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse = require("../../utils/parse-csv");
const admin = require("firebase-admin");
const replace_slash_1 = require("../../utils/replace-slash");
const coverageToIndex = {
    general_liability: 0,
    auto_liability: 2,
    workers_comp: 3,
    employers_liability: 3,
    umbrella: 4,
    crime: 5,
    professional_liability: 1,
    environmental_liability: 6,
};
exports.putLimits = async (req, res) => {
    const json = await parse.headerAndColumn('src/csv_files/limits.csv');
    const limitsRef = admin.firestore().collection('limits');
    Object.keys(json).forEach(key => {
        let id = replace_slash_1.default(key); // cannot have '/' in the Firestore ID so replace with |
        let column = json[key];
        /**
         * For some reason during parse, headers that end in the string ')' get lumped into the column as an object.
         * So, we must check if that's the case and then add it to the id if it is
         */
        const firstEle = column[0];
        if (typeof firstEle === 'object') {
            const missingChar = Object.keys(firstEle)[0];
            id = `${id}${missingChar}`;
            column = column.map(obj => obj[missingChar]);
        }
        /**
         * Only numbers are allowed in the database so we filter for such.
         */
        const filteredColumn = column.map(amounts => {
            if (amounts === 'N/A')
                return [0]; // 'N/A'
            if (amounts.indexOf('/') !== -1)
                return amounts.split('/').map(amt => parseInt(amt.replace(/\D+/g, ''))); // '$1,000,000 / $2,000,000'
            return [parseInt(amounts.replace(/\D+/g, ''))];
        });
        const limit = {
            id,
        };
        Object.keys(coverageToIndex).forEach(coverage => {
            const idx = coverageToIndex[coverage];
            limit[coverage] = filteredColumn[idx];
        });
        limitsRef.doc(id).set(limit).then(_ => _).catch(_ => _);
    });
    res.send('OK');
};
//# sourceMappingURL=put-limits.js.map