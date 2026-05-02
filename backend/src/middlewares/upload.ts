import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const storage = multer.memoryStorage();

const hazardUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
});

const announcementUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
});

const profileUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }, // 2MB, single file
});

const streamToCloudinary = (
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "auto" = "image",
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
};

export const uploadHazardFiles = [
  hazardUpload.array("files", 5),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !Array.isArray(req.files)) return next();

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      req.body.uploadedUrls = await Promise.all(
        req.files.map((file) => {
          if (!allowedTypes.includes(file.mimetype)) {
            throw new Error(
              "Invalid file type. Allowed: images only (jpg, jpeg, png, gif).",
            );
          }

          return streamToCloudinary(
            file.buffer,
            "hazardwatch/hazards/pictures",
          );
        }),
      );

      next();
    } catch (err) {
      next(err);
    }
  },
];

export const uploadAnnouncementFiles = [
  announcementUpload.array("files", 5),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !Array.isArray(req.files)) return next();

      req.body.uploadedUrls = await Promise.all(
        req.files.map((file) => {
          if (!file.mimetype.startsWith("image/")) {
            throw new Error("Only image files are allowed!");
          }
          return streamToCloudinary(file.buffer, "hazardwatch/announcements");
        }),
      );

      next();
    } catch (err) {
      next(err);
    }
  },
];

export const uploadProfilePicture = [
  profileUpload.single("avatar"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) return next();

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error("Invalid file type. Allowed: JPEG, PNG, WEBP");
      }

      req.body.avatarUrl = await streamToCloudinary(
        req.file.buffer,
        "hazardwatch/avatars",
      );

      next();
    } catch (err) {
      next(err);
    }
  },
];

export const multerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Max size is 10MB." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ message: "Too many files. Max is 5 files." });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};
