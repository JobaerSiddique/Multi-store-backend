"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = void 0;
const generateTransactionId = () => {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 10000);
    return `TXN-${timestamp}-${random}`;
};
exports.generateTransactionId = generateTransactionId;
