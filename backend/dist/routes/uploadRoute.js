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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure Cloudinary Storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            folder: "food-images", // Cloudinary folder name
            resource_type: "image", // Specify resource type
            public_id: file.originalname.split(".")[0], // Use the file name without the extension
            allowed_formats: ["jpg", "png", "jpeg"]
        });
    }),
});
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary.v2,
//     params: {
//       folder: "food-images",
//       allowed_formats: ["jpg", "png", "jpeg"],
//     },
//   });
// Initialize Multer with Cloudinary storage
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
// Define upload route
router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    // Respond with the Cloudinary URL for the uploaded file
    res.status(200).json({ url: req.file.path });
});
exports.default = router;
// import { v2 as cloudinary } from 'cloudinary';
// import { Request, Response } from 'express';
// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add to your .env
//   api_key: process.env.CLOUDINARY_API_KEY, // Add to your .env
//   api_secret: process.env.CLOUDINARY_API_SECRET, // Add to your .env
// });
// // Endpoint to Upload Image
// export const uploadImage = async (req: any, res: Response) => {
//   try {
//     const file = req.file.path; // Assuming you're using `multer` for file upload
//     const result = await cloudinary.uploader.upload(file, {
//       folder: 'food_items', // Optional: specify a folder in Cloudinary
//     });
//     // Get the secure URL from Cloudinary
//     const imageUrl = result.secure_url;
//     // Return the image URL
//     return res.status(200).json({ imageUrl });
//   } catch (error) {
//     return res.status(500).json({ error: 'Image upload failed', details: error });
//   }
// };
