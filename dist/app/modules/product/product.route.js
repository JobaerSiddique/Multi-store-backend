"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const http_status_1 = __importDefault(require("http-status"));
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const fileUploader_1 = require("../../helpers/fileUploader");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const router = express_1.default.Router();
// router.post('/',fileUploader.upload.array('files'),(req:Request,res:Response,next:NextFunction)=>{
//    req.body= JSON.parse(req.body.data)
//    console.log(req.body);
//     next()
// },
// validateRequest(productValidation.createProductSchema),
// ProductController.createProduct)
router.post('/', fileUploader_1.fileUploader.upload.array('files', 5), // Limit to 5 files
(req, res, next) => {
    try {
        if (!req.body.data) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Missing product data");
        }
        req.body = JSON.parse(req.body.data);
        console.log(req.body);
        next();
    }
    catch (error) {
        next(new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid product data format"));
    }
}, 
// validateRequest(ProductValidation.createProductSchema),
product_controller_1.ProductController.createProduct);
router.get('/', product_controller_1.ProductController.getAllProduct);
router.get("/:id", product_controller_1.ProductController.getSingleProduct);
router.put('/:id', product_controller_1.ProductController.deleteProduct);
router.patch("/:id", product_controller_1.ProductController.updateProduct);
exports.ProductRoutes = router;
