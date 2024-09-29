import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, HttpError } from '../types/types';

const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const development = process.env.NODE_ENV === 'development';

  // Default to 500 Internal Server Error
  let status = err.status ?? 500;
  let message = err.message ?? 'Internal server error';

  // Handle SyntaxError for malformed JSON
  if (err instanceof SyntaxError && 'type' in err && err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON payload';
  }

  const errorResponse: ErrorResponse = {
    status,
    // No stacktraces leaked to user unless in development environment or status 400, 401, 404
    message:
      development || [400, 401, 404].includes(status ?? 0) ? message : 'Internal server error',
  };

  if (err.status === 400 && err.cause) {
    errorResponse.cause = err.cause;
  }

  // Log if internal error
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json(errorResponse);
};

export default errorHandler;
