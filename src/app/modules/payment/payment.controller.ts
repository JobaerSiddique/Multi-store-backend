import  httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const createOrderPaymet = catchAsync(async(req,res)=>{
    const {orderId} = req.body;
    console.log({orderId});
    const result = await PaymentService.createPaymentOrderIntoDB(orderId);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"",
        data:result
    })
})
const paymentSuccess = catchAsync(async(req,res)=>{
     const { transactionId } = req.params;
     console.log({transactionId});
     const result = await PaymentService.handlePaymentSuccess(transactionId)
     sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"",
        data:result
     })
})

const createSslPayment = catchAsync(async(req,res)=>{
    const {orderId}=req.params
    const result = await PaymentService.createSslCommerzPayment(orderId)
     sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"",
        data:result
     })
})
const ValidPaymentSSL = catchAsync(async(req,res)=>{
    
     
     const result = await PaymentService.handleSslPaymentSuccess(req.query)
     sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"",
        data:result
     })
})
export const PaymentController ={
    createOrderPaymet,
    paymentSuccess,
    createSslPayment,
    ValidPaymentSSL
}