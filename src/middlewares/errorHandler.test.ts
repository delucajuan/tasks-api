import { Request, Response, NextFunction } from 'express';
import errorHandler from '../middlewares/errorHandler';
import { HttpError } from '../types/types';

describe('errorHandler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    mockRequest = {};
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
    // Mock console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleErrorSpy.mockRestore();
  });

  it('should return 500 and generic message for unhandled errors', () => {
    const mockError: HttpError = new Error('Unhandled error');
    errorHandler(mockError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 500,
      message: 'Internal server error',
    });
  });

  it('should return the correct error status and message for custom HttpError', () => {
    const mockError = new Error('Resource not found') as HttpError;
    mockError.status = 404;

    errorHandler(mockError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 404,
      message: 'Resource not found',
    });
  });

  it('should handle SyntaxError for invalid JSON payload', () => {
    const mockSyntaxError = new SyntaxError('Unexpected token') as HttpError;
    (mockSyntaxError as any).type = 'entity.parse.failed';

    errorHandler(mockSyntaxError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 400,
      message: 'Invalid JSON payload',
    });
  });

  it('should include error cause when status is 400 and cause is provided', () => {
    const mockError = new Error('Bad request') as HttpError;
    mockError.status = 400;
    mockError.cause = ['Invalid parameter'];

    errorHandler(mockError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 400,
      message: 'Bad request',
      cause: ['Invalid parameter'],
    });
  });

  it('should log the error for 500 status and not expose the stacktrace', () => {
    const mockError: HttpError = new Error('Critical server error');
    mockError.status = 500;
    mockError.errorData = { stacktrace: 'Secret data' };

    errorHandler(mockError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 500,
      message: 'Internal server error',
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
  });
});
