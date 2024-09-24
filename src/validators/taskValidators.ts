import Joi from 'joi';
import { TaskStatus } from '../entities/Task';

// Validation schema for creating a task
export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).required(),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional(),
});

// Validation schema for updating a task
export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().min(1).optional(),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional(),
}).or('title', 'description', 'status');
