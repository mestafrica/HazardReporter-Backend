declare module "multer-storage-cloudinary" {
  import { StorageEngine } from "multer";

  interface CloudinaryStorageParams {
    folder?: string;
    allowed_formats?: string[];
    public_id?: (req: any, file: any) => string;
    resource_type?: (req: any, file: any) => string;
    format?: (req: any, file: any) => string;
    [key: string]: any;
  }

  interface CloudinaryStorageOptions {
    cloudinary: any;
    params:
      | CloudinaryStorageParams
      | ((req: any, file: any) => CloudinaryStorageParams);
  }

  class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(
      req: any,
      file: any,
      callback: (error: Error | null, info?: any) => void,
    ): void;
    _removeFile(
      req: any,
      file: any,
      callback: (error: Error | null) => void,
    ): void;
  }

  export { CloudinaryStorage };
}
