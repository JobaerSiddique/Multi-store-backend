import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { ICloudinaryResponse, IFile } from "../interface/file";
import config from "../config";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_api,
  api_secret: config.cloud_secrect,
});

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Multer Upload Middleware
const upload = multer({ storage: storage });

// Cloudinary Upload Function
const uploadToCloudinary = async (file: string): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      (error: Error, result: ICloudinaryResponse) => {
        // Cleanup: Delete file after attempting upload
        if (fs.existsSync(file)) {
          try {
            fs.unlinkSync(file);
          } catch (unlinkError) {
            console.error("Failed to delete temporary file:", unlinkError);
          }
        }

        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// Export File Uploader Utilities
export const fileUploader = {
  upload,
  uploadToCloudinary,
};
