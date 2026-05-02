import swaggerJsdoc from 'swagger-jsdoc';
import { Request } from 'express';

const baseOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HazardWatch API',
      version: '1.0.0',
      description: 'API documentation for HazardWatch - Hazard reporting and management system',
      contact: {
        name: 'HazardWatch Support',
      },
    },
    servers: [
      {
        url: '/',
        description: 'Current server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'API and database health check endpoints',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authorization header using the Bearer scheme',
        },
      },
      schemas: {
        HazardReport: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            hazardtype: { type: 'string' },
            description: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            location: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
            user: { type: 'string' },
            status: { type: 'string', enum: ['open', 'in progress', 'resolved'] },
            upvotes: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/router/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(baseOptions);

// Generate swagger spec with dynamic server URL based on request
export const getSwaggerSpec = (req: Request) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const serverUrl = `${protocol}://${host}/api`;

  const dynamicOptions = {
    ...baseOptions,
    definition: {
      ...baseOptions.definition,
      servers: [
        {
          url: serverUrl,
          description: 'Current server',
        },
      ],
    },
  };

  return swaggerJsdoc(dynamicOptions);
};
