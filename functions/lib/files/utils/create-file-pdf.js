"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HummusRecipe = require("hummus-recipe");
const money_1 = require("../../utils/money");
const standardStyle = {
    color: '000000',
    fontSize: 9,
    font: 'Helvatica',
};
const MARGIN_LEFT = 50;
const createTitle = (pdf) => {
    pdf
        .text('Insurance Requirements', MARGIN_LEFT, 50, Object.assign({}, standardStyle, { bold: true }))
        .rectangle(MARGIN_LEFT, 60, 105, 1, {
        fill: '000000',
    });
};
const createBulletedHeading = (pdf, options) => {
    pdf
        .text(options.count, MARGIN_LEFT, options.y, Object.assign({}, standardStyle, { bold: true }))
        .text(options.title, MARGIN_LEFT + 20, options.y, Object.assign({}, standardStyle, { bold: true }));
};
const createStandaloneParagraph = (pdf, options) => {
    pdf
        .text(options.paragraph, MARGIN_LEFT + 20, options.y, Object.assign({}, standardStyle, { textBox: {
            width: 500,
            lineHeight: 10,
        } }));
};
const createNumberedParagraph = (pdf, options) => {
    pdf
        .text(options.number, MARGIN_LEFT + 10, options.y + 1.5, standardStyle);
    createStandaloneParagraph(pdf, options);
};
const createFooter = (pdf, options) => {
    pdf
        .text(options.copy, 'center', 760, Object.assign({}, standardStyle, { align: 'center center', fontSize: 7, textBox: {
            width: 500,
            lineHeight: 9,
            textAlign: 'center',
        } }));
};
const createLimitsHeader = (pdf) => {
    pdf
        .text('Policy', MARGIN_LEFT, 50, Object.assign({}, standardStyle, { bold: true, textBox: {
            width: 100,
            textAlign: 'center'
        } }))
        .text('Limits', MARGIN_LEFT + 100, 50, Object.assign({}, standardStyle, { bold: true, textBox: {
            width: 100,
            textAlign: 'center'
        } }))
        .rectangle(MARGIN_LEFT, 60, 200, 1, {
        fill: '000000',
    });
};
const createLimitTable = (pdf, limitPDFArray) => {
    let runningY = 72;
    limitPDFArray.forEach(limitPDF => {
        pdf.text(limitPDF.title, MARGIN_LEFT, runningY, standardStyle);
        limitPDF.limits.forEach(limit => {
            pdf.text(limit, MARGIN_LEFT + 110, runningY, standardStyle);
            runningY += 11;
        });
        runningY += 15;
    });
};
exports.createFilePDF = (file, destination) => {
    return new Promise((resolve) => {
        const seller = file.form_data.seller_vendor_name;
        const client = file.form_data.client_name;
        const findLimit = (id) => file.limits.find(limit => limit.id === id);
        const limitPDFArray = [
            {
                title: 'General Liability',
                limits: [
                    `${money_1.default(findLimit('General Liability').amounts[0])} per occurrence limit`,
                    `${money_1.default(findLimit('General Liability').amounts[0] * 2)} aggregate limit`,
                ],
            },
            {
                title: 'Auto Liability',
                limits: [
                    `${money_1.default(findLimit('Auto Liability').amounts[0])} combined single limit`,
                ],
            },
            {
                title: 'Workers Compensation',
                limits: [
                    `${findLimit('Workers Compensation').amounts[0]}`,
                ],
            },
            {
                title: 'Employers Liability',
                limits: [
                    `${money_1.default(findLimit('Employers Liability').amounts[0])} per occupational accident limit`,
                    `${money_1.default(findLimit('Employers Liability').amounts[0])} per occupational disease limit`,
                    `${money_1.default(findLimit('Employers Liability').amounts[0])} aggregate limit`,
                ],
            },
            {
                title: 'Umbrella',
                limits: [
                    `${money_1.default(findLimit('Umbrella').amounts[0])} aggregate limit`,
                ],
            },
            {
                title: 'Crime',
                limits: [
                    `${money_1.default(findLimit('Crime').amounts[0])} limit`,
                ],
            },
            {
                title: 'Professional Liability',
                limits: [
                    `${findLimit('Professional Liability').amounts.map(amount => money_1.default(amount)).join(' / ')} limit`,
                ],
            },
            {
                title: 'Environmental Liability',
                limits: [
                    `${money_1.default(findLimit('Environmental Liability').amounts[0])} limit`,
                ],
            },
        ];
        const pdfDoc = new HummusRecipe('new', destination, {
            author: 'No Hands',
            title: 'No Hands File',
        });
        pdfDoc
            .createPage('letter-size');
        createTitle(pdfDoc);
        let runningY = 80;
        createBulletedHeading(pdfDoc, {
            count: 'a.',
            title: 'Required Policies',
            y: runningY,
        });
        createStandaloneParagraph(pdfDoc, {
            paragraph: `${seller} shall procure and maintain for the duration of the file insurance against claims for injuries to persons or damages to property which may arise from or in connection with the performance of the work by ${seller}, its agents, representatives or employees.`,
            y: runningY += 10,
        });
        createNumberedParagraph(pdfDoc, {
            number: '1.',
            paragraph: 'Commercial General Liability on an occurrence basis, including products and completed operations, property damage, bodily injury and personal & advertising injury with limits no less than described. If a general aggregate limit applies, either the general aggregate limit shall apply separately to this project or location, or the general aggregate shall be twice the required occurrence limit.',
            y: runningY += 45,
        });
        createNumberedParagraph(pdfDoc, {
            number: '2.',
            paragraph: `Automobile Liability covering owned, hired, and non-owned autos with limit no less than described. If ${seller} has no owned autos, coverage shall be provided for hired and non-owned autos. ${findLimit('Auto Liability').notes}`,
            y: runningY += 50,
        });
        createNumberedParagraph(pdfDoc, {
            number: '3.',
            paragraph: `Workers Compensation and Employers Liability as required by statute with limits no less than described. ${findLimit('Workers Compensation').notes}`,
            y: runningY += 40,
        });
        createNumberedParagraph(pdfDoc, {
            number: '4.',
            paragraph: `Umbrella coverage on a follow-form basis with limits no less than described.`,
            y: runningY += 30,
        });
        createNumberedParagraph(pdfDoc, {
            number: '5.',
            paragraph: `Crime coverage with limits no less than described. ${findLimit('Crime').notes}`,
            y: runningY += 25,
        });
        createNumberedParagraph(pdfDoc, {
            number: '6.',
            paragraph: `Professional Liability with limits no less than described.`,
            y: runningY += 25,
        });
        createNumberedParagraph(pdfDoc, {
            number: '7.',
            paragraph: `Environmental Liability with limits no less than described.`,
            y: runningY += 25,
        });
        createStandaloneParagraph(pdfDoc, {
            paragraph: `${client}, its officers, officials, employees, and volunteers are to be covered additional insureds on the CGL policy with respect to liability arising out of work or operations performed by or on behalf of ${seller}. If ${seller} maintains broader coverage and/or higher limits than the minimums shown above, ${client} requires and shall be entitled to the broader coverage and/or higher limits maintained by ${seller}. Any available insurance proceeds in excess of the specified minimum limits of insurance and coverage shall be available to ${client}.`,
            y: runningY += 25,
        });
        createBulletedHeading(pdfDoc, {
            count: 'b.',
            title: 'Certificates of Insurance',
            y: runningY += 75,
        });
        createStandaloneParagraph(pdfDoc, {
            paragraph: `${seller} must provide ${client} with certificates of insurance evidencing that the required insurance policies are in effect before work begins. Failure to obtain the required documents prior to the work beginning shall not waive ${seller}'s obligation to provide them.`,
            y: runningY += 10,
        });
        createBulletedHeading(pdfDoc, {
            count: 'c.',
            title: 'Cancellation',
            y: runningY += 45,
        });
        createStandaloneParagraph(pdfDoc, {
            paragraph: `${seller} must provide ${client} with a minimum of 30 days' advance notice of cancellation of any of the above policies, except a minimum of 10 days' advance notice in the event of non-payment of premium.`,
            y: runningY += 10,
        });
        createBulletedHeading(pdfDoc, {
            count: 'd.',
            title: 'Acceptability of Insurers',
            y: runningY += 45,
        });
        createStandaloneParagraph(pdfDoc, {
            paragraph: `Insurance is to be placed with insurers authorized to conduct business in the state with a current A.M. Best rating of no less than A-.`,
            y: runningY += 10,
        });
        createBulletedHeading(pdfDoc, {
            count: 'e.',
            title: 'Claims-made Policies',
            y: runningY += 45,
        });
        createStandaloneParagraph(pdfDoc, {
            paragraph: `If any of the required policies provide claims-made coverage, the retroactive date must be shown, and must be before the date of the file or the beginning of file work, and insurance must be maintained for at least 5 years after the completion of the file. If coverage is canceled or non-renewed and not replaced with similar coverage, ${seller} must purchase extended reporting coverage for a minimum of five years after completion of work. `,
            y: runningY += 10,
        });
        createBulletedHeading(pdfDoc, {
            count: 'f.',
            title: 'Primary Coverage',
            y: runningY += 60,
        });
        createStandaloneParagraph(pdfDoc, {
            paragraph: `For any claims related to this file, ${seller}'s insurance coverage shall be primary as respects ${client}, its officers, officials, employees, and volunteers. Any insurance or self-insurance maintained by ${client} shall be excess of ${seller}'s insurance and shall not contribute with it.`,
            y: runningY += 10,
        });
        createFooter(pdfDoc, {
            copy: `This is provided as sample language only. Limits recommended may not be adequate to cover all losses and file language may not apply in all circumstances. These recommendations should not be construed as legal advice.`,
        });
        pdfDoc
            .endPage();
        runningY = 80;
        pdfDoc
            .createPage('letter-size');
        createLimitsHeader(pdfDoc);
        createLimitTable(pdfDoc, limitPDFArray);
        createFooter(pdfDoc, {
            copy: `This is provided as sample language only. Limits recommended may not be adequate to cover all losses and file language may not apply in all circumstances. These recommendations should not be construed as legal advice.`,
        });
        pdfDoc
            .endPage()
            .endPDF(() => {
            resolve('yeet');
        });
    });
};
exports.default = exports.createFilePDF;
//# sourceMappingURL=create-file-pdf.js.map