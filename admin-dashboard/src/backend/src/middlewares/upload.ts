// import multer from 'multer';

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath = 'src/uploads/';
//         console.log('Saving files to:', uploadPath); // Log the path for debugging
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload = multer({ storage, 
//     limits: { fileSize: 5 * 1024 * 1024 }, //File size limit
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith("image/")) {
//             cb(null, true);
//         } else {
//             cb(new Error("Invalid file type, only images are allowed!"));
//         }
//     }
// });

// export default upload;



import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string
});

// Define the storage configuration with proper types
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'hazardwatch/hazards/pictures',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    } as any // CloudinaryStorage params can be complex, using 'any' for flexibility
});

 // Create the upload middleware
const upload = multer({
    storage: cloudinaryStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Export as default
export default upload;




