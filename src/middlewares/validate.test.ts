import { Request, Response, NextFunction } from 'express';
import validate from './validate';
import { ValidationSchemas } from '../types/types';
import Joi from 'joi';

describe('validate middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should call next when validation passes', () => {
    const mockSchema: ValidationSchemas = {
      body: Joi.object({
        name: Joi.string().required(),
      }),
    };

    mockRequest.body = { name: 'test' };

    const middleware = validate(mockSchema);

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalledWith(expect.any(Error));
  });

  it('should return validation errors for invalid request body', () => {
    const mockSchema: ValidationSchemas = {
      body: Joi.object({
        name: Joi.string().required(),
      }),
    };

    mockRequest.body = { name: '' }; // Invalid body

    const middleware = validate(mockSchema);

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext.mock.calls[0][0]).toHaveProperty('status', 400); // Expect error status to be 400
    expect(mockNext.mock.calls[0][0]).toHaveProperty('cause', expect.any(Array)); // Expect error cause to be an array of errors
  });

  it('should return validation errors for invalid request params', () => {
    const mockSchema: ValidationSchemas = {
      params: Joi.object({
        id: Joi.number().required(),
      }),
    };

    mockRequest.params = { id: 'abc' }; // Invalid param, should be number

    const middleware = validate(mockSchema);

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext.mock.calls[0][0]).toHaveProperty('status', 400);
    expect(mockNext.mock.calls[0][0]).toHaveProperty('cause', expect.any(Array));
  });

  it('should return validation errors when unknown keys are present in the request body', () => {
    const mockSchema: ValidationSchemas = {
      body: Joi.object({
        name: Joi.string().required(),
      }),
    };

    mockRequest.body = { name: 'test', unknownKey: 'should not be allowed' };

    const middleware = validate(mockSchema);

    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext.mock.calls[0][0]).toHaveProperty('status', 400);
    expect(mockNext.mock.calls[0][0]).toHaveProperty('cause', expect.any(Array));
  });
});
