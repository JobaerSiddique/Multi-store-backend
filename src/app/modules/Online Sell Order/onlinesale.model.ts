import mongoose, { Schema } from "mongoose";

const onlineOrderSchema = new Schema({
  order: { 
    type: Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true,
    unique: true 
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: { 
    type: String, 
    enum: ['card', 'payment_gateway', 'cod'],
    required: true 
  },
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'pickup'],
    required: true
  },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    totalPrice: { type: Number, required: true }
  }],
  trackingNumber: String,
  isShipped: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false }
}, { timestamps: true });

export const OnlineOrder = mongoose.model('OnlineOrder', onlineOrderSchema);