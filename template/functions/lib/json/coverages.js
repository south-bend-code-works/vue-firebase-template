"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    'General Liability': {
        id: 'General Liability',
        display_name: 'General Liability',
        limit_func: ((payload, limits) => {
            return limits.general_liability;
        }).toString(),
        notes_func: ((payload) => {
            return ['On Premises', 'Fileor Transporting'].find(inquiryId => payload[inquiryId]) ? `${payload.client_name} shall be named as additional insured with regard to general liability.` : '';
        }).toString(),
    },
    'Auto Liability': {
        id: 'Auto Liability',
        display_name: 'Auto Liability',
        limit_func: ((payload, limits) => {
            if (payload.file_type_id.toLowerCase().indexOf('charter') !== -1)
                return limits.auto_liability;
            if (payload['More than 12'])
                return [3000000];
            if (payload['Over 19,500'])
                return [2000000];
            if (['Vehicle Integral', 'Fileor Transporting'].find(inquiryId => payload[inquiryId]))
                return limits.auto_liability;
            return [0];
        }).toString(),
        notes_func: ((payload) => {
            return payload['Hazardous Materials'] ? 'The auto policy must include MCS-90 coverage.' : '';
        }).toString(),
    },
    'Workers Compensation': {
        id: 'Workers Compensation',
        display_name: 'Workers Compensation',
        limit_func: ((payload, limits) => {
            return limits.employers_liability[0] === 0 ? [''] : ['Statutory'];
        }).toString(),
        notes_func: ((payload) => {
            return payload['On Premises'] ? `A waiver of subrogation must be provided in favor of ${payload.client_name}.` : '';
        }).toString(),
    },
    'Employers Liability': {
        id: 'Employers Liability',
        display_name: 'Employers Liability',
        limit_func: ((payload, limits) => {
            if (payload['Hazardous Activities'])
                return [1000000];
            return limits.employers_liability;
        }).toString(),
        notes_func: ((payload) => {
            return '';
        }).toString(),
    },
    'Umbrella': {
        id: 'Umbrella',
        display_name: 'Umbrella',
        limit_func: ((payload, limits) => {
            if (payload['Hazardous Activities'])
                return [5000000];
            return limits.umbrella;
        }).toString(),
        notes_func: ((payload) => {
            return '';
        }).toString(),
    },
    'Crime': {
        id: 'Crime',
        display_name: 'Crime',
        limit_func: ((payload, limits) => {
            if (payload['Vendor Handle Sensitive'] && limits.crime[0] === 0)
                return [500000];
            return limits.crime;
        }).toString(),
        notes_func: ((payload) => {
            return payload['Vendor Handle Sensitive'] ? 'The crime policy must include Client coverage.' : '';
        }).toString(),
    },
    'Professional Liability': {
        id: 'Professional Liability',
        display_name: 'Professional Liability',
        limit_func: ((payload, limits) => {
            return limits.professional_liability;
        }).toString(),
        notes_func: ((payload) => {
            return '';
        }).toString(),
    },
    'Environmental Liability': {
        id: 'Environmental Liability',
        display_name: 'Environmental Liability',
        limit_func: ((payload, limits) => {
            return limits.environmental_liability;
        }).toString(),
        notes_func: ((payload) => {
            return '';
        }).toString(),
    },
};
//# sourceMappingURL=coverages.js.map