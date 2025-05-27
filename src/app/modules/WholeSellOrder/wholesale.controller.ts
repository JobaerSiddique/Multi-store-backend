import  httpStatus  from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WholeSaleService } from "./wholesale.service";


const getAllWholeSale = catchAsync(async(req,res)=>{
    const result = await WholeSaleService.getAllWholeSaleOrder()
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Whole sale Retrived Successfully",
        data:result
    })
})


export const WholeSaleController = {
    getAllWholeSale
}