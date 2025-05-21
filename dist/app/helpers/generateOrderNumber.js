"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = void 0;
const order_model_1 = require("../modules/order/order.model");
const types_1 = require("../modules/types");
// Helper function to get prefix based on order type
const getOrderPrefix = (orderType) => {
    const prefixes = {
        [types_1.OrderType.LOCAL]: 'LOC', // Example: "LOC" for Local orders
        [types_1.OrderType.WHOLESALE]: 'WHO', // "WHO" for Wholesale orders
        [types_1.OrderType.ONLINE]: 'ONL' // "ONL" for Online orders
    };
    return prefixes[orderType] || 'ORD'; // Default: "ORD"
};
// Function to generate a unique order number
const generateOrderNumber = (orderType) => __awaiter(void 0, void 0, void 0, function* () {
    const prefix = getOrderPrefix(orderType);
    const today = new Date();
    // Format: YYYYMMDD (e.g., 20240515 for May 15, 2024)
    const datePart = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    // Find the latest order with the same prefix and date
    const lastOrder = yield order_model_1.Order.findOne({ orderNumber: new RegExp(`^${prefix}${datePart}`) }, // Matches prefix + date
    { orderNumber: 1 }, { sort: { orderNumber: -1 } } // Sort by orderNumber (descending)
    ).exec();
    // Start sequence from 1 (if no orders exist) or increment the last sequence
    let sequence = 1;
    if (lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.orderNumber) {
        const lastSequence = parseInt(lastOrder.orderNumber.slice(-3), 10); // Extract last 3 digits
        sequence = lastSequence + 1;
    }
    // Format: [PREFIX][YYYYMMDD][3-digit sequence]
    return `${prefix}${datePart}${sequence.toString().padStart(3, '0')}`;
});
exports.generateOrderNumber = generateOrderNumber;
