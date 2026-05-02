import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Define the storage configuration with proper types
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hazardwatch/hazards/pictures",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  } as Record<string, string | string[]>,
});

// Create the upload middleware
const upload = multer({
  storage: cloudinaryStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}) as any;

// Export as default
export default upload;
