import httpStatus  from 'http-status';
import AppError from "../../errors/AppError"
import { IUser } from "./user.interface"
import { User } from './user.model';


const createUserDB = async(payload:IUser)=>{
    console.log({payload});
    const existEmail = await User.findOne({
        email:payload.email
    })

    if(existEmail){
        throw new AppError(httpStatus.BAD_REQUEST,"This Email Already Exists")
    }

    const newUser = await User.create(payload);
    return newUser
}

const createAdminDB = async(payload:IUser)=>{
    const existEmail = await User.findOne({
        email:payload.email
    })

    if(existEmail){
        throw new AppError(httpStatus.BAD_REQUEST,"This Email Already Exists")
    }

    const adminPayload = { ...payload, role: 'admin' };

   
    const newAdmin = await User.create(adminPayload);

    return newAdmin; 

    
}


const createLocalUserFromDB = async(payload:IUser)=>{
    const existEmail = await User.findOne({
        email:payload.email
    })

    if(existEmail){
        throw new AppError(httpStatus.BAD_REQUEST,"This Email Already Exists")
    }

    const LocalPayload = { ...payload, role: 'local_customer' };

   
    const newUser = await User.create(LocalPayload);

    return newUser; 
}

const createWholerIntoDB = async(payload:IUser)=>{
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Email already exists');
    }

    
    
      if (!payload.storeName || !payload.storeAddress) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Store name and address are required for wholesale sellers'
        );
      }
    
    const userData = {
        ...payload,
        role:'wholesale_customer'
        
      };
      const newUser = await User.create(userData)
      return newUser;
}
const getAllUserIntoDB = async()=>{
    const user = await User.find()
    return user;
}
export const UserService={
    createUserDB,
    createAdminDB,
    getAllUserIntoDB,
    createLocalUserFromDB,
    createWholerIntoDB
}