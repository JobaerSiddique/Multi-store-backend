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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = require("../product/product.model");
const wholesell_model_1 = require("../WholeSellOrder/wholesell.model");
const order_model_1 = require("./order.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
// const createWholeSaleOrderIntoDB = async(orderData:IOrder,wholesaleData:IWholesaleOrder)=>{
//     const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     // Step 1: Check for duplicate wholesale orders
//     const existingWholesaleOrder = await WholeSale.findOne({
//       "items.product": { $all: wholesaleData.items.map((item) => item.product) },
//       minOrderQuantity: wholesaleData.minOrderQuantity,
//       deliveryDate: wholesaleData.deliveryDate,
//     }).session(session);
//     if (existingWholesaleOrder) {
//       throw new AppError(httpStatus.BAD_REQUEST,"Duplicate wholesale order detected.");
//     }
//     // Step 2: Calculate total amount
//     let totalAmount = 0;
//     for (const item of wholesaleData.items) {
//       const product = await Product.findById(item.product).session(session);
//       if (!product) {
//         throw new AppError(httpStatus.NOT_FOUND,`Product with ID ${item.product} not found`);
//       }
//       // Multiply quantity by the wholesale price for the product
//       const itemTotal = item.quantity * product.prices.wholesale;
//       totalAmount += itemTotal;
//       // Assign the wholesale price to the item
//       item.price = product.prices.wholesale;
//     }
//     // Step 3: Create the order
//     const order = new Order({
//       ...orderData,
//       totalAmount,
//         // Use the calculated total amount
//     });
//     const savedOrder = await order.save({ session });
//     // Step 4: Create the wholesale order
//     wholesaleData.order = savedOrder._id; // Link the saved order to wholesale order
//     const wholesaleOrder = new WholeSale(wholesaleData);
//     const savedWholesaleOrder = await wholesaleOrder.save({ session });
//     // Commit the transaction
//     await session.commitTransaction();
//     session.endSession();
//       const populatedWholesaleOrder = await WholeSale.findById(
//       savedWholesaleOrder._id
//     )
//       .populate("order") // Populate the linked order
//       .populate("items.product") // Populate product details
//       .exec();
//     return populatedWholesaleOrder;
//   } catch (error) {
//     // Abort the transaction in case of an error
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// }
const createWholeSaleOrderIntoDB = (orderData, wholesaleData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Step 1: Check for duplicate wholesale orders
        const existingWholesaleOrder = yield wholesell_model_1.WholeSale.findOne({
            "items.product": { $all: wholesaleData.items.map((item) => item.product) },
            minOrderQuantity: wholesaleData.minOrderQuantity,
            deliveryDate: wholesaleData.deliveryDate,
        }).session(session);
        if (existingWholesaleOrder) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Duplicate wholesale order detected.");
        }
        // Step 2: Validate items and calculate total amount
        let totalAmount = 0;
        for (const item of wholesaleData.items) {
            const product = yield product_model_1.Product.findById(item.product).session(session);
            if (!product) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product with ID ${item.product} not found.`);
            }
            // Check if stock is sufficient
            if (product.stock < item.quantity) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock for product "${product.name}". Requested: ${item.quantity}, Available: ${product.stock}`);
            }
            // Check if item.quantity meets the minOrderQuantity
            if (item.quantity < 5) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `The quantity of product "${product.name}" (${item.quantity}) is less than the minimum order quantity (${5}).`);
            }
            // Multiply quantity by the wholesale price for the product
            const itemTotal = item.quantity * product.prices.wholesale;
            totalAmount += itemTotal;
            // Assign the wholesale price to the item
            item.price = product.prices.wholesale;
        }
        // Step 3: Create the order
        const order = new order_model_1.Order(Object.assign(Object.assign({}, orderData), { totalAmount }));
        const savedOrder = yield order.save({ session });
        // Step 4: Create the wholesale order
        wholesaleData.order = savedOrder._id; // Link the saved order to wholesale order
        const wholesaleOrder = new wholesell_model_1.WholeSale(wholesaleData);
        const savedWholesaleOrder = yield wholesaleOrder.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        const populatedWholesaleOrder = yield wholesell_model_1.WholeSale.findById(savedWholesaleOrder._id)
            .populate("order") // Populate the linked order
            .populate("items.product") // Populate product details
            .exec();
        return populatedWholesaleOrder;
    }
    catch (error) {
        // Abort the transaction in case of an error
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.OrderService = {
    createWholeSaleOrderIntoDB
};
