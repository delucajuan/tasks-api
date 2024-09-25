import { Request, Response, NextFunction } from 'express';
import { HttpError, ValidationSchemas } from '../types/types';

const validate =
  (schemas: ValidationSchemas) => (req: Request, res: Response, next: NextFunction) => {
    const options = {
      abortEarly: false, // Include all errors
      allowUnknown: false, // Don't allow unknown keys that are not defined in the schema
    };

    const validationErrors = [];

    // Validate request params
    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, options);
      if (error) {
        validationErrors.push(...error.details.map((detail) => detail.message));
      } else {
        req.params = value;
      }
    }

    // Validate request body
    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, options);
      if (error) {
        // Map Joi errors into a single error message
        validationErrors.push(...error.details.map((detail) => detail.message));
      } else {
        req.body = value;
      }
    }

    // If there are any validation errors, respond with 400 Bad Request
    if (validationErrors.length > 0) {
      const error: HttpError = new Error('Bad request');
      error.status = 400;
      error.cause = validationErrors;
      return next(error);
    }

    next();
  };

export default validate;
