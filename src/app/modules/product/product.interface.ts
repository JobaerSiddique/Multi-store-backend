import { ProductCategory, ProductSize, SaleChannel } from '../types';

export interface IPrice {
    local: number;
    wholesale: number;
    online: number;
  }
  
  export interface IProduct  {
    name: string;
    description: string;
    category: ProductCategory;
    size: ProductSize;
    prices: IPrice;
    stock: number;
    images: string[];
    saleChannels: SaleChannel[];
    isDeleted:boolean;
    createdAt: Date;
    updatedAt: Date;
  }