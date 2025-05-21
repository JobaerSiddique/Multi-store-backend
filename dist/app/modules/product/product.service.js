"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("./product.model");
const fileUploader_1 = require("../../helpers/fileUploader");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const product_constant_1 = require("./product.constant");
const createProductIntoDB = (payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Validate files
    if (!files || files.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Product images are required');
    }
    // 2. Check for duplicate product
    const duplicateConditions = {
        name: payload.name,
        category: payload.category,
    };
    if (payload.size) {
        duplicateConditions.size = payload.size;
    }
    const existingProduct = yield product_model_1.Product.findOne({ duplicateConditions, isDeleted: false });
    if (existingProduct) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, `Product with name "${payload.name}", category "${payload.category}"${payload.size ? ` and size "${payload.size}"` : ''} already exists`);
    }
    // 3. Upload images to Cloudinary
    const uploadedImages = [];
    try {
        for (const file of files) {
            const uploadResult = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
            if (uploadResult) {
                uploadedImages.push(uploadResult.secure_url);
            }
        }
        // 4. Create product with image URLs
        const productData = Object.assign(Object.assign({}, payload), { images: uploadedImages });
        const product = yield product_model_1.Product.create(productData);
        return product;
    }
    catch (error) {
        console.log(error);
    }
});
const getAllProductIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize query builder
        const productQuery = new QueryBuilder_1.default(product_model_1.Product.find(), query)
            .search(product_constant_1.productSearchableFields)
            .filter()
            .sort()
            .fields()
            .paginate();
        // Execute query and get total count with the same filters
        const [result, total] = yield Promise.all([
            productQuery.modelQuery.exec(),
            product_model_1.Product.countDocuments(productQuery.modelQuery.getFilter())
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
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve products");
    }
});
const getSingleProductIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findOne({ _id: id, isDeleted: false });
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found or has been deleted");
    }
    return product;
});
const deleteProductIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findOne({ _id: id, isDeleted: false });
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product Not Found");
    }
    if (product.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Product Already Deleted");
    }
    const deleteProduct = yield product_model_1.Product.findByIdAndUpdate({ _id: product._id }, {
        isDeleted: true
    });
    return deleteProduct;
});
const updateProductIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findOne({ _id: id, isDeleted: false });
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product Not Found");
    }
    if (product.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Product Already Deleted");
    }
    const updatedProduct = yield product_model_1.Product.findByIdAndUpdate({ _id: product._id }, { $set: payload }, { new: true, runValidators: true });
    return updatedProduct;
});
exports.ProductService = {
    createProductIntoDB,
    getAllProductIntoDB,
    getSingleProductIntoDB,
    deleteProductIntoDB,
    updateProductIntoDB
};
