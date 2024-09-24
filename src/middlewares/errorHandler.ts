import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/types';

const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const development = process.env.NODE_ENV === 'developmente';

  // Default to 500 Internal Server Error
  let status = err.status ?? 500;
  let message = err.message ?? 'Internal server error';

  // Handle SyntaxError for malformed JSON
  if (err instanceof SyntaxError && 'type' in err && err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON payload';
  }

  const errorResponse: { status: number; message: string; error?: unknown } = {
    status,
    // No stacktraces leaked to user unless in development environment or status 400, 401, 404
    message:
      development || [400, 401, 404].includes(status ?? 0) ? message : 'Internal server error',
  };

  // Include error in development. Do not include it if only has status in it.
  if (development && Object.keys(err).length > 1) {
    errorResponse.error = err;
  }

  // Log if internal error
  if (errorResponse.status === 500) {
    console.error(err);
  }
  res.status(errorResponse.status).json(errorResponse);
};

export default errorHandler;
