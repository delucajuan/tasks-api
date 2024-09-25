import Joi from 'joi';
import { TaskStatus } from '../entities/Task';

// Validation schema for creating a task
const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).required(),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional(),
});

// Validation schema for getting a task by id
const getTaskByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

// Validation schema for updating a task
const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().min(1).optional(),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional(),
}).or('title', 'description', 'status');

export { createTaskSchema, getTaskByIdSchema, updateTaskSchema };
