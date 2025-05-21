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
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
// Cloudinary Configuration
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloud_name,
    api_key: config_1.default.cloud_api,
    api_secret: config_1.default.cloud_secrect,
});
// Multer Storage Configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(process.cwd(), "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
// Multer Upload Middleware
const upload = (0, multer_1.default)({ storage: storage });
// Cloudinary Upload Function
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file, (error, result) => {
            // Cleanup: Delete file after attempting upload
            if (fs_1.default.existsSync(file)) {
                try {
                    fs_1.default.unlinkSync(file);
                }
                catch (unlinkError) {
                    console.error("Failed to delete temporary file:", unlinkError);
                }
            }
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
});
// Export File Uploader Utilities
exports.fileUploader = {
    upload,
    uploadToCloudinary,
};
