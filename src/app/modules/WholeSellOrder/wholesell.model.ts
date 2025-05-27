import { model, Schema } from "mongoose";



const wholesaleOrderSchema = new Schema({
  order:{type:Schema.Types.ObjectId, ref:'Order', required:true},
  minOrderQuantity: { type: Number, default:5},
  deliveryDate: { type: Date, required: true },
  truckDriverInfo: {
    name: String,
    contact: String,
    vehicleNumber: String
  },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    
    unit: { type: String, enum: ['sack', 'half-sack', 'kg'], default: 'sack' }
  }]
});

export const WholeSale = model('wholeSaleOrder',wholesaleOrderSchema)