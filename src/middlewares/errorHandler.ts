import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
