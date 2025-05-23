import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'online_customer' | 'local_customer' | 'wholesale_customer';
  phone?: string;
  address?: string;
  isActive: boolean;
  isDeleted:boolean;
  creditLimit?: number;
  dueAmount?: number;
  storeName?: string;        // Added for wholesale users
  storeAddress?: string;     // Added for wholesale users
  createdAt: Date;
  updatedAt: Date;

}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}