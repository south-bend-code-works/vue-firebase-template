"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.get = async (req, res) => {
    try {
        const fileBase64 = fs.readFileSync(path.resolve(__dirname, 'Appealing Your Assessment, What Your Assessor Won’t Tell You.pdf')).toString('base64');
        console.log(fileBase64);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send({ message: 'NOPE' });
    }
    return res.send('OK');
};
//# sourceMappingURL=get.js.map