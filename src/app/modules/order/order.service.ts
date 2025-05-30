import httpStatus  from 'http-status';
import mongoose from "mongoose";
import { Product } from "../product/product.model";
import { WholeSale } from "../WholeSellOrder/wholesell.model";
import { Order } from "./order.model";
import { IWholesaleOrder } from "../WholeSellOrder/wholesale.interface";
import { IOrder } from "./order.interface";
import AppError from "../../errors/AppError";



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

const createWholeSaleOrderIntoDB = async (orderData: IOrder, wholesaleData: IWholesaleOrder) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if(orderData.orderType !=="WHOLESALE"){
      throw new AppError(httpStatus.BAD_REQUEST,"Order Type must be Whole sale ")
    }

    // Step 1: Check for duplicate wholesale orders
    const existingWholesaleOrder = await WholeSale.findOne({
      "items.product": { $all: wholesaleData.items.map((item) => item.product) },
      minOrderQuantity: wholesaleData.minOrderQuantity,
      deliveryDate: wholesaleData.deliveryDate,
    }).session(session);

    if (existingWholesaleOrder) {
      throw new AppError(httpStatus.BAD_REQUEST, "Duplicate wholesale order detected.");
    }

    // Step 2: Validate items and calculate total amount
    let totalAmount = 0;

    for (const item of wholesaleData.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, `Product with ID ${item.product} not found.`);
      }

      // Check if stock is sufficient
      if (product.stock < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for product "${product.name}". Requested: ${item.quantity}, Available: ${product.stock}`
        );
      }

      // Check if item.quantity meets the minOrderQuantity
      if (item.quantity < 5) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `The quantity of product "${product.name}" (${item.quantity}) is less than the minimum order quantity (${5}).`
        );
      }

      // Multiply quantity by the wholesale price for the product
      const itemTotal = item.quantity * product.prices.wholesale;
      totalAmount += itemTotal;

      // Assign the wholesale price to the item
      item.price = product.prices.wholesale;

    
      
    }

    // Step 3: Create the order
    const order = new Order({
      ...orderData,
      
      totalAmount, // Use the calculated total amount
    });
    const savedOrder = await order.save({ session });

    // Step 4: Create the wholesale order
    wholesaleData.order = savedOrder._id; // Link the saved order to wholesale order
    const wholesaleOrder = new WholeSale(wholesaleData);
    const savedWholesaleOrder = await wholesaleOrder.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    const populatedWholesaleOrder = await WholeSale.findById(savedWholesaleOrder._id)
      .populate("order") // Populate the linked order
      .populate("items.product") // Populate product details
      .exec();

    return populatedWholesaleOrder;
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


export const OrderService = {
    createWholeSaleOrderIntoDB
}