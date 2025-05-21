import  httpStatus  from 'http-status';
import express, { NextFunction, Request, Response } from 'express'

import { ProductController } from './product.controller';
import { fileUploader } from '../../helpers/fileUploader';
import validateRequest from '../../middlewares/validateRequest';

import AppError from '../../errors/AppError';
import { ProductValidation } from './product.validate';

const router = express.Router();

// router.post('/',fileUploader.upload.array('files'),(req:Request,res:Response,next:NextFunction)=>{
    
//    req.body= JSON.parse(req.body.data)
//    console.log(req.body);
//     next()
// },
// validateRequest(productValidation.createProductSchema),
// ProductController.createProduct)

router.post(
    '/',
    fileUploader.upload.array('files', 5), // Limit to 5 files
    (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.body.data) {
          throw new AppError(httpStatus.BAD_REQUEST, "Missing product data");
        }
        req.body = JSON.parse(req.body.data);
        console.log(req.body);
        next();
      } catch (error) {
        next(new AppError(httpStatus.BAD_REQUEST, "Invalid product data format"));
      }
    },
    // validateRequest(ProductValidation.createProductSchema),
    ProductController.createProduct
  );

router.get('/',ProductController.getAllProduct)
router.get("/:id",ProductController.getSingleProduct)
router.put('/:id',ProductController.deleteProduct)
router.patch("/:id",ProductController.updateProduct)



export const ProductRoutes = router;