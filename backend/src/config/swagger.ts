import swaggerJsdoc from 'swagger-jsdoc';

const options = {
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
        url: 'http://localhost:3001',
        description: 'Local development server',
      },
      {
        url: 'https://hazardreport-backend.onrender.com',
        description: 'Production server (Render)',
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

export const swaggerSpec = swaggerJsdoc(options);
