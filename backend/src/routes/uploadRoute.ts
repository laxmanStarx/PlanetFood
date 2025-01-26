import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "food-images", // Cloudinary folder name
    resource_type: "image", // Specify resource type
    public_id: file.originalname.split(".")[0], // Use the file name without the extension
    allowed_formats: ["jpg", "png", "jpeg"]
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
const upload = multer({ storage });

const router = express.Router();

// Define upload route
router.post("/upload", upload.single("file"), (req:any, res:any) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Respond with the Cloudinary URL for the uploaded file
  res.status(200).json({ url: req.file.path });
});

export default router;






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











