import { model, Schema } from "mongoose";
import { IUser, IUserMethods } from "./user.interface";
import bcrypt from 'bcrypt'
import config from "../../config";
const userSchema = new Schema<IUser, {}, IUserMethods>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { 
      type: String, 
      enum: ['super_admin', 'admin', 'online_customer', 'local_customer', 'wholesale_customer'],
      default: 'online_customer'
    },
    phone: String,
    address: String,
    isActive: { type: Boolean, default: true },
    creditLimit: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    storeName: { 
      type: String,
      required: function() { return this.role === 'wholesale_customer'; }
    },
    storeAddress: {
      type: String,
      required: function() { return this.role === 'wholesale_customer'; }
    },
    isDeleted:{
      type:Boolean,
      default:false
    },

  }, { timestamps: true });
  
  userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  };
  userSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, Number(config.salt));
    next();
  });
  
  export const User = model<IUser>('user', userSchema);