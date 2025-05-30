import { Schema } from "mongoose";
import { OrderStatus, OrderType, PaymentStatus } from "../types";


export interface IOrder extends Document {
  orderNumber: string;
  user: Schema.Types.ObjectId;
 
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  orderType: OrderType;
  isDeleted:boolean
}