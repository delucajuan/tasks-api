import Joi from 'joi';
import { TaskStatus } from '../entities/Task';

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional(),
});

const getTaskByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const getTasksByStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .required(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().min(1).optional(),
}).or('title', 'description');

export { createTaskSchema, getTaskByIdSchema, updateTaskSchema, getTasksByStatusSchema };
