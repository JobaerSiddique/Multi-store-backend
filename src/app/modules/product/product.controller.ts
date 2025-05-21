import  httpStatus  from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";



const createProduct = catchAsync(async(req,res)=>{
    const data =req.body;
    
    const files = req.files as Express.Multer.File[];
      const filePaths = files.map((file) => file.path);
    const result = await ProductService.createProductIntoDB(data,filePaths)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Product Create Successfully",
        data:result
    })
})

const getAllProduct = catchAsync(async(req,res)=>{
    const result = await ProductService.getAllProductIntoDB(req.query)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Product Retrived Successfully",
        meta:result.meta,
        data:result.data
        
    })
})
const getSingleProduct = catchAsync(async(req,res)=>{
    const {id} = req.params;
    const result = await ProductService.getSingleProductIntoDB(id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Product Retrived Successfully",
        data:result
        
    })
})

const deleteProduct = catchAsync(async(req,res)=>{
    const {id}=req.params;
    console.log(id);
    const result = await ProductService.deleteProductIntoDB(id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Product deleted Successfully",
        data:result
        
    })
})

const updateProduct = catchAsync(async(req,res)=>{
    const {id} = req.params;
    const data = req.body;
    const result = await ProductService.updateProductIntoDB(id,data);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Product Update Successfully",
        data:result
        
    })
})
export const ProductController = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    deleteProduct,
    updateProduct
}