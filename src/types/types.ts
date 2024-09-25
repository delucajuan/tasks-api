import { ObjectSchema } from 'joi';
import { TaskStatus } from '../entities/Task';

export type HttpError = Error & {
  status?: number;
  msg?: string;
  errorData?: unknown;
  cause?: string[];
};

export type ErrorResponse = {
  status: number;
  message: string;
  error?: unknown;
  cause?: string[];
};

export type CreateTaskInput = {
  title: string;
  description: string;
  status?: TaskStatus;
};

export type UpdateTaskInput = {
  id: number;
  title?: string;
  description?: string;
};

export type ChangeTaskStatusInput = {
  id: number;
  status: TaskStatus;
};

export type ValidationSchemas = {
  body?: ObjectSchema;
  params?: ObjectSchema;
};
