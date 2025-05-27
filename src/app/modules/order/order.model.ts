import mongoose, { Schema } from "mongoose";
import { OrderStatus, OrderType, PaymentStatus } from "../types";
import { IOrder } from "./order.interface";
import { generateOrderNumber } from "../../helpers/generateOrderNumber";

const orderSchema = new Schema<IOrder>({
  orderNumber: { type: String,  },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  paymentStatus: { 
    type: String, 
    enum: Object.values(PaymentStatus), 
    default: PaymentStatus.PENDING 
  },
  status: { 
    type: String, 
    enum: Object.values(OrderStatus), 
    default: OrderStatus.PENDING 
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  timestamps: true, 
 
});

// Pre-save hook for order number generation
orderSchema.pre('save', async function (next) {
  if (!this.isNew || this.orderNumber) return next();

  try {
    this.orderNumber = await generateOrderNumber(this.orderType);
    next();
  } catch (error) {
    next(error as Error);
  }
});
orderSchema.pre("save", function (next) {
  if (this.paymentStatus === "PAID") {
    this.dueAmount = 0;
  } else {
    this.dueAmount = this.totalAmount;
  }
  next();
});

  
  export const Order = mongoose.model<IOrder>('Order', orderSchema);