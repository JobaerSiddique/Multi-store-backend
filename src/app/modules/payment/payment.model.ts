import { model, Schema } from "mongoose";

const paymentSchema = new Schema({
  order:{type:Schema.Types.ObjectId, ref:'Order', required:true},
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
    enum:['AmarPay',"SSLCommerz"],
    
  },
  paymentDetails: Schema.Types.Mixed, // To store raw response from SSLCommerz
  paidAt: {
    type: Date
  }
}, { timestamps: true });



export const Payment = model('payment',paymentSchema)