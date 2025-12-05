import type { Response } from 'express';
import { sendApiError, toApiError } from '../../utils/apiError';
import { ApiError } from '../../core/errors/api-error';

describe('apiError Utils', () => {
  let mockRes: Partial<Response>;
  let statusSpy: jest.Mock;
  let jsonSpy: jest.Mock;

  beforeEach(() => {
    jsonSpy = jest.fn().mockReturnThis();
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });

    mockRes = {
      status: statusSpy,
      json: jsonSpy
    };
  });

  describe('sendApiError', () => {
    it('should send basic error response', () => {
      sendApiError(mockRes as Response, 400, 'Bad Request');

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Bad Request'
      });
    });

    it('should send error with code', () => {
      sendApiError(mockRes as Response, 400, 'Validation failed', {
        code: 'VALIDATION_ERROR'
      });

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR'
      });
    });

    it('should send error with details', () => {
      sendApiError(mockRes as Response, 400, 'Validation failed', {
        details: { field: 'email', reason: 'invalid format' }
      });

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Validation failed',
        details: { field: 'email', reason: 'invalid format' }
      });
    });

    it('should send error with code and details', () => {
      sendApiError(mockRes as Response, 400, 'Validation failed', {
        code: 'VALIDATION_ERROR',
        details: { field: 'email' }
      });

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: { field: 'email' }
      });
    });

    it('should handle 401 Unauthorized', () => {
      sendApiError(mockRes as Response, 401, 'Unauthorized');

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
    });

    it('should handle 403 Forbidden', () => {
      sendApiError(mockRes as Response, 403, 'Forbidden');

      expect(statusSpy).toHaveBeenCalledWith(403);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Forbidden'
      });
    });

    it('should handle 404 Not Found', () => {
      sendApiError(mockRes as Response, 404, 'Not Found');

      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Not Found'
      });
    });

    it('should handle 500 Internal Server Error', () => {
      sendApiError(mockRes as Response, 500, 'Internal Server Error');

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });

    it('should not add code if not provided', () => {
      sendApiError(mockRes as Response, 400, 'Error message', {});

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error message'
      });
      expect(jsonSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ code: expect.anything() })
      );
    });

    it('should not add details if not provided', () => {
      sendApiError(mockRes as Response, 400, 'Error message', {});

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error message'
      });
      expect(jsonSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ details: expect.anything() })
      );
    });

    it('should handle empty options object', () => {
      sendApiError(mockRes as Response, 400, 'Error message', {});

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error message'
      });
    });

    it('should handle undefined options', () => {
      sendApiError(mockRes as Response, 400, 'Error message');

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error message'
      });
    });

    it('should handle details with value of 0', () => {
      sendApiError(mockRes as Response, 400, 'Error', {
        details: 0
      });

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error',
        details: 0
      });
    });

    it('should handle details with value of false', () => {
      sendApiError(mockRes as Response, 400, 'Error', {
        details: false
      });

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error',
        details: false
      });
    });

    it('should handle details with empty string', () => {
      sendApiError(mockRes as Response, 400, 'Error', {
        details: ''
      });

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error',
        details: ''
      });
    });

    it('should handle details with null', () => {
      sendApiError(mockRes as Response, 400, 'Error', {
        details: null
      });

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error',
        details: null
      });
    });

    it('should handle details with array', () => {
      sendApiError(mockRes as Response, 400, 'Validation failed', {
        details: ['error1', 'error2']
      });

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Validation failed',
        details: ['error1', 'error2']
      });
    });

    it('should handle details with nested object', () => {
      sendApiError(mockRes as Response, 400, 'Error', {
        details: {
          user: {
            id: 123,
            errors: ['invalid email']
          }
        }
      });

      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error',
        details: {
          user: {
            id: 123,
            errors: ['invalid email']
          }
        }
      });
    });

    it('should return response object', () => {
      const result = sendApiError(mockRes as Response, 400, 'Error');

      expect(result).toHaveProperty('json');
    });

    it('should call both status and json methods', () => {
      sendApiError(mockRes as Response, 400, 'Error');

      expect(statusSpy).toHaveBeenCalled();
      expect(jsonSpy).toHaveBeenCalled();
    });
  });

  describe('toApiError', () => {
    it('should create ApiError with status and message', () => {
      const error = toApiError(400, 'Bad Request');

      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(400);
      expect(error.message).toBe('Bad Request');
    });

    it('should create ApiError with code', () => {
      const error = toApiError(400, 'Validation failed', {
        code: 'VALIDATION_ERROR'
      });

      expect(error.status).toBe(400);
      expect(error.message).toBe('Validation failed');
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should create ApiError with details', () => {
      const error = toApiError(400, 'Error', {
        details: { field: 'email' }
      });

      expect(error.status).toBe(400);
      expect(error.message).toBe('Error');
      expect(error.details).toEqual({ field: 'email' });
    });

    it('should create ApiError with code and details', () => {
      const error = toApiError(400, 'Error', {
        code: 'TEST_ERROR',
        details: { info: 'test' }
      });

      expect(error.status).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.details).toEqual({ info: 'test' });
    });

    it('should create ApiError without options', () => {
      const error = toApiError(500, 'Internal Server Error');

      expect(error.status).toBe(500);
      expect(error.message).toBe('Internal Server Error');
    });

    it('should create ApiError for different status codes', () => {
      const statuses = [400, 401, 403, 404, 500, 503];

      statuses.forEach((status) => {
        const error = toApiError(status, 'Error');
        expect(error.status).toBe(status);
      });
    });

    it('should create ApiError with empty options', () => {
      const error = toApiError(400, 'Error', {});

      expect(error.status).toBe(400);
      expect(error.message).toBe('Error');
    });

    it('should preserve error message', () => {
      const messages = [
        'User not found',
        'Invalid credentials',
        'Insufficient permissions',
        'Resource already exists'
      ];

      messages.forEach((message) => {
        const error = toApiError(400, message);
        expect(error.message).toBe(message);
      });
    });
  });
});
