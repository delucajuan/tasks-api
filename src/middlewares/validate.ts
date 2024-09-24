import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { HttpError } from '../types/types';

const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const options = {
    abortEarly: false, // Include all errors
    allowUnknown: true, // Allow unknown keys that are not defined in the schema
    stripUnknown: true, // Remove unknown keys from the validated data
  };

  const { error: validationError, value } = schema.validate(req.body, options);

  if (validationError) {
    // Map Joi errors into a single error message
    const errorMessage = validationError.details.map((detail) => detail.message).join(', ');
    const error: HttpError = new Error(errorMessage);
    error.status = 400;

    return next(error);
  }

  req.body = value;
  next();
};

export default validate;
