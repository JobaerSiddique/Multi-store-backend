"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    order: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true },
    transactionId: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        default: "BDT"
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED"],
        default: "PENDING"
    },
    gateway: {
        type: String,
        enum: ['AmarPay', "SSLCommerz"],
    },
    paymentDetails: mongoose_1.Schema.Types.Mixed, // To store raw response from SSLCommerz
    paidAt: {
        type: Date
    }
}, { timestamps: true });
exports.Payment = (0, mongoose_1.model)('payment', paymentSchema);
