import { Document, Types } from "mongoose";

export interface IPayment extends Document {
  order: Types.ObjectId;
  transactionId: string;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  gateway: string;
  paymentDetails: Record<string, any>;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}