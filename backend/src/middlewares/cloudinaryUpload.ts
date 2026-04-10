import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string
});

const hazardStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'hazardwatch/hazards/pictures',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    } as any
});

const announcementStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'hazardwatch/announcements',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'mp4', 'mov'],
        resource_type: 'auto' as any
    } as any
});

export const uploadHazardFiles = multer({
    storage: hazardStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export const uploadAnnouncementFiles = multer({
    storage: announcementStorage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'video/mp4', 'video/quicktime'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed: images, PDF, DOC, MP4, MOV'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

export default uploadHazardFiles;
