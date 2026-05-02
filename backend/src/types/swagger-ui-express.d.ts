declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';
  
  export interface SwaggerUiOptions {
    swaggerOptions?: {
      url?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  export function setup(swaggerDoc: any, options?: SwaggerUiOptions): RequestHandler;
  export const serve: RequestHandler;
}
