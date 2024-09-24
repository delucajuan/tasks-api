import Joi from 'joi';
import { TaskStatus } from '../entities/Task';

export type HttpError = Error & {
  status?: number;
  msg?: string;
  errorData?: unknown;
  cause?: Joi.ValidationErrorItem[];
};

export type ErrorResponse = {
  status: number;
  message: string;
  error?: unknown;
  cause?: Joi.ValidationErrorItem[];
};

export type CreateTaskInput = {
  title: string;
  description: string;
  status?: TaskStatus;
};
