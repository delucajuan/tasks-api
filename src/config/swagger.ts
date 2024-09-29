import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi, { SwaggerOptions } from 'swagger-ui-express';
import { Express } from 'express';
import { TaskStatus } from '../entities/Task';

// Get the status values
const statusEnumValues = Object.values(TaskStatus).filter((value) => typeof value === 'string');

const options: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task API',
      version: '1.0.0',
      description: 'API for managing tasks',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Juan De Luca',
        url: 'https://github.com/delucajuan',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
    components: {
      schemas: {
        // Task Schema
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Task ID', example: 1 },
            title: { type: 'string', description: 'Task title', example: 'Buy groceries' },
            description: {
              type: 'string',
              description: 'Task description',
              example: 'Milk, Bread, Eggs',
            },
            status: {
              type: 'string',
              enum: statusEnumValues,
              description: 'Task status',
              example: 'pending',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date',
              example: '2023-09-28T12:34:56Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date',
              example: '2023-09-29T08:21:30Z',
            },
          },
        },
        // CreateTaskInput Schema
        CreateTaskInput: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: { type: 'string', description: 'Task title', example: 'Buy groceries' },
            description: {
              type: 'string',
              description: 'Task description',
              example: 'Milk, Bread, Eggs',
            },
            status: {
              type: 'string',
              enum: statusEnumValues,
              description: 'Task status',
              example: 'pending',
            },
          },
        },
        // UpdateTaskInput Schema
        UpdateTaskInput: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Buy groceries and fruits',
            },
            description: {
              type: 'string',
              description: 'Task description',
              example: 'Milk, Bread, Eggs, Apples',
            },
          },
        },
        // ChangeTaskStatusInput Schema
        ChangeTaskStatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: statusEnumValues,
              description: 'New status of the task',
              example: 'completed',
            },
          },
        },
        // GetTasksByStatus Schema
        GetTasksByStatus: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: statusEnumValues,
              description: 'Task status',
              example: 'in-progress',
            },
          },
        },
        // SuccessResponse Schema
        SuccessResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              description: 'Status code',
              example: 200,
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Task successfully deleted',
            },
          },
        },
        // InvalidInputResponse Schema
        InvalidInputResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              description: 'Error status code',
              example: 400,
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Bad request',
            },
            cause: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of validation errors',
              example: ['"id" must be a number'],
            },
          },
        },
        // NotFoundResponse Schema
        NotFoundResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              description: 'Error status code',
              example: 404,
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Task not found',
            },
          },
        },
      },
      parameters: {
        StatusParam: {
          name: 'status',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            enum: statusEnumValues,
          },
          description: 'The task status',
          example: 'completed',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwaggerDocs = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default setupSwaggerDocs;
