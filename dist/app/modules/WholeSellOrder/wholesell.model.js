"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WholeSale = void 0;
const mongoose_1 = require("mongoose");
const wholesaleOrderSchema = new mongoose_1.Schema({
    order: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true },
    minOrderQuantity: { type: Number, default: 5 },
    deliveryDate: { type: Date, required: true },
    truckDriverInfo: {
        name: String,
        contact: String,
        vehicleNumber: String
    },
    items: [{
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, enum: ['sack', 'half-sack', 'kg'], default: 'sack' }
        }]
});
exports.WholeSale = (0, mongoose_1.model)('wholeSaleOrder', wholesaleOrderSchema);
