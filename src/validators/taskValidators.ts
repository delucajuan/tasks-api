import Joi from 'joi';
import { TaskStatus } from '../entities/Task';

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
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

const deleteTaskSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().min(1).optional(),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional(),
}).or('title', 'description', 'status');

export {
  createTaskSchema,
  getTaskByIdSchema,
  updateTaskSchema,
  deleteTaskSchema,
  getTasksByStatusSchema,
};
