"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slug = void 0;
const slug = (text) => {
    return text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};
exports.slug = slug;
