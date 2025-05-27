import { Schema } from 'mongoose';
import { Document, Types } from 'mongoose';


export interface IWholesaleOrderItem {
  product: string; // Reference to Product ID
  quantity: number;
  price: number;
  unit: 'sack' | 'half-sack' | 'kg';
  totalPrice: number;
}

export interface IWholesaleOrder extends Document {
  order: Schema.Types.ObjectId // Reference to Order ID
  minOrderQuantity: number;
  deliveryDate: Date;
  truckDriverInfo: {
    name: string;
    contact: string;
    vehicleNumber: string;
  };
  items: IWholesaleOrderItem[];
  isDelivered: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}