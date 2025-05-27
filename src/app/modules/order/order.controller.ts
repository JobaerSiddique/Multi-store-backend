import  httpStatus  from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";




const createWholeSaleOrder = catchAsync(async(req,res)=>{
    const {orderData,wholesaleData} = req.body;
    const result = await OrderService.createWholeSaleOrderIntoDB(orderData,wholesaleData);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Whole Sale Order Create Successfully",
        data:result
        
    })
})


export const OrderController = {
    createWholeSaleOrder
}