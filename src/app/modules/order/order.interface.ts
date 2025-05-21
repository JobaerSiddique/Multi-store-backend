import mongoose from "mongoose";
import { OrderStatus, OrderType, PaymentStatus } from "../types";

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    unit?: string; // kg, gram, etc for local sales
    price: number;
  }
  
  export interface IOrder extends Document {
    orderNumber: string;
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    orderType: OrderType;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paidAmount?: number;
    dueAmount?: number;
    deliveryDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }