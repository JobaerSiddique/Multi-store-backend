import httpStatus from 'http-status';
import AppError from "../../errors/AppError";
import { IProduct } from "./product.interface";
import { Product } from './product.model';


import { fileUploader } from '../../helpers/fileUploader';
import QueryBuilder from '../../builder/QueryBuilder';
import { productSearchableFields } from './product.constant';



const createProductIntoDB = async (
  payload: IProduct,
  files: Express.Multer.File[]
) => {
  // 1. Validate files
  if (!files || files.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product images are required');
  }

  // 2. Check for duplicate product
  const duplicateConditions: any = {
    name: payload.name,
    category: payload.category,
  };

  if (payload.size) {
    duplicateConditions.size = payload.size;
  }

  const existingProduct = await Product.findOne({duplicateConditions,isDeleted:false});
  if (existingProduct) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Product with name "${payload.name}", category "${payload.category}"${
        payload.size ? ` and size "${payload.size}"` : ''
      } already exists`
    );
  }

  // 3. Upload images to Cloudinary
  const uploadedImages: string[] = [];
  try {
    for (const file of files) {
      const uploadResult = await fileUploader.uploadToCloudinary(file);
      
      if (uploadResult) {
        uploadedImages.push(uploadResult.secure_url);
      }
     
    }
  

    // 4. Create product with image URLs
    const productData = {
      ...payload,
      images: uploadedImages,
    };

    const product = await Product.create(productData);
    return product;
  } catch (error) {
    console.log(error);
  }
};

const getAllProductIntoDB = async (query: Record<string, unknown>) => {
  try {
    // Initialize query builder
    const productQuery = new QueryBuilder(
      Product.find(), 
      query
    )
      .search(productSearchableFields)
      .filter()
      .sort()
      .fields()
      .paginate();

    // Execute query and get total count with the same filters
    const [result, total] = await Promise.all([
      productQuery.modelQuery.exec(),
      Product.countDocuments(productQuery.modelQuery.getFilter())
    ]);

    // Calculate pagination metadata
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const totalPage = Math.ceil(total / limit);

    return {
      meta: {
        page,
        limit,
        total,
        totalPage
      },
      data: result
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve products"
    );
  }
};

const getSingleProductIntoDB = async(id:string)=>{
  const product = await Product.findOne({_id:id,isDeleted:false})
  if(!product){
    throw new AppError(httpStatus.NOT_FOUND,"Product not found or has been deleted")
  }
  return product
}


const deleteProductIntoDB = async(id:string)=>{
    const product = await Product.findOne({_id:id,isDeleted:false})
    if(!product){
      throw new AppError(httpStatus.NOT_FOUND,"Product Not Found");
    }
    if(product.isDeleted){
      throw new AppError(httpStatus.BAD_REQUEST,"Product Already Deleted")
    }

   const deleteProduct = await Product.findByIdAndUpdate({_id:product._id},{
    isDeleted:true
   })
   return deleteProduct
}

const updateProductIntoDB =async (id: string, payload: Partial<IProduct>)=>{
    const product = await Product.findOne({_id:id,isDeleted:false})
    if(!product){
      throw new AppError(httpStatus.NOT_FOUND,"Product Not Found")
    }

    if(product.isDeleted){
      throw new AppError(httpStatus.BAD_REQUEST,"Product Already Deleted")
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      {_id:product._id},
      { $set: payload },
      { new: true, runValidators: true }
    );
    return updatedProduct;
}
export const ProductService = {
    createProductIntoDB,
    getAllProductIntoDB,
    getSingleProductIntoDB,
    deleteProductIntoDB,
    updateProductIntoDB
};