import mongoose, { Schema } from "mongoose";
import { IProduct } from "./product.interface";
import { ProductCategory, ProductSize, SaleChannel } from "../types";


const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: Object.values(ProductCategory), required: true },
    size: { type: String, enum: Object.values(ProductSize) },
    prices: {
      local: { type: Number, required: true },
      wholesale: { type: Number, required: true },
      online: { type: Number, required: true },
    },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    saleChannels: [{ type: String, enum: Object.values(SaleChannel) }],
    isDeleted:{type:Boolean,default:false}
  }, { timestamps: true });
  
  export const Product = mongoose.model<IProduct>('Product', productSchema);