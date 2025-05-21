import mongoose, { Schema } from "mongoose";
import { OrderStatus, OrderType, PaymentStatus } from "../types";
import { IOrder } from "./order.interface";
import { generateOrderNumber } from "../../helpers/generateOrderNumber";

const orderSchema = new Schema<IOrder>({
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      unit: { type: String },
      price: { type: Number, required: true },
    }],
    totalAmount: { type: Number, required: true },
    orderType: { 
      type: String, 
      enum: Object.values(OrderType), 
      required: true 
    },
    status: { 
      type: String, 
      enum: Object.values(OrderStatus), 
      default: OrderStatus.PENDING 
    },
    paymentStatus: { 
      type: String, 
      enum: Object.values(PaymentStatus), 
      default: PaymentStatus.PENDING 
    },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    deliveryDate: { type: Date },
    notes: { type: String },
  }, { timestamps: true });


  orderSchema.pre('save', async function (next) {
    // Skip if not a new order or orderNumber already exists
    if (!this.isNew || this.orderNumber) {
      return next();
    }
  
    try {
      // Generate and assign orderNumber
      this.orderNumber = await generateOrderNumber(this.orderType);
      next();
    } catch (error) {
      next(error as Error); // Handle errors
    }
  });
  
  export const Order = mongoose.model<IOrder>('Order', orderSchema);