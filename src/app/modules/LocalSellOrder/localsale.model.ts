import mongoose, { Schema } from "mongoose";

const localOrderSchema = new Schema({
  order: { 
    type: Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true,
    unique: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'payment_gateway', 'due'],
    required: true 
  },
  cashReceived: { type: Number, min: 0 },
  changeGiven: { type: Number, min: 0 },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 0.01 }, // Allow decimal for kg/liters
    price: { type: Number, required: true, min: 0 },
    unit: { 
      type: String, 
      enum: ['kg', 'gram', 'piece', 'liter', 'bundle'],
      required: true 
    },
    totalPrice: { type: Number, required: true }
  }],
  customer: {
    name: String,
    phone: String,
    address: String
  },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

export const LocalOrder = mongoose.model('LocalOrder', localOrderSchema);