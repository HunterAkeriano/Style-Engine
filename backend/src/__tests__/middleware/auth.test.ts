import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createAuthMiddleware, createOptionalAuthMiddleware, requireAdmin, type AuthRequest } from '../../middleware/auth';
import type { Env } from '../../config/env';
import * as apiError from '../../utils/apiError';
import * as db from '../../config/db';

jest.mock('jsonwebtoken');
jest.mock('../../utils/apiError');
jest.mock('../../config/db');

describe('Auth Middleware', () => {
  let mockEnv: Env;
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockUser: any;
  let mockUserModel: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockEnv = {
      JWT_SECRET: 'test-secret-minimum-12-chars',
      DATABASE_URL: 'postgres://test:5432/db',
      SUPER_ADMIN_EMAIL: 'admin@example.com',
      SUPER_ADMIN_PASSWORD: 'test-password',
      NODE_ENV: 'test'
    };

    mockUser = {
      id: 'user-123',
      isAdmin: false,
      isSuperAdmin: false,
      isPayment: true,
      subscriptionTier: 'pro',
      email: 'user@example.com',
      get: jest.fn()
    };

    mockUser.get.mockReturnValue(mockUser);

    mockUserModel = {
      findByPk: jest.fn().mockResolvedValue(mockUser)
    };

    (db.getModels as jest.Mock).mockReturnValue({
      User: mockUserModel
    });

    mockReq = {
      headers: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();

    (apiError.sendApiError as jest.Mock).mockImplementation((res, code, message) => {
      res.status?.(code);
      res.json?.({ error: message });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createAuthMiddleware', () => {
    it('should return 401 if authorization header is missing', async () => {
      const middleware = createAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(apiError.sendApiError).toHaveBeenCalledWith(mockRes, 401, 'Missing authorization header');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header is invalid', async () => {
      mockReq.headers = { authorization: 'Bearer' };
      const middleware = createAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(apiError.sendApiError).toHaveBeenCalledWith(mockRes, 401, 'Invalid authorization header');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const middleware = createAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(apiError.sendApiError).toHaveBeenCalledWith(mockRes, 401, 'Invalid or expired token');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
      mockReq.headers = { authorization: 'Bearer valid-token' };
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });
      mockUserModel.findByPk.mockResolvedValue(null);

      const middleware = createAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(apiError.sendApiError).toHaveBeenCalledWith(mockRes, 401, 'User not found');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should authenticate user successfully', async () => {
      mockReq.headers = { authorization: 'Bearer valid-token' };
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });

      const middleware = createAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', mockEnv.JWT_SECRET);
      expect(mockUserModel.findByPk).toHaveBeenCalledWith('user-123', {
        attributes: ['id', 'email', 'isAdmin', 'isSuperAdmin', 'isPayment', 'subscriptionTier']
      });
      expect(mockReq.userId).toBe('user-123');
      expect(mockReq.authUser).toEqual({
        id: 'user-123',
        role: 'user',
        isAdmin: false,
        isSuperAdmin: false,
        isPayment: true,
        subscriptionTier: 'pro'
      });
      expect(mockNext).toHaveBeenCalled();
      expect(apiError.sendApiError).not.toHaveBeenCalled();
    });

    it('should convert isAdmin to boolean', async () => {
      const adminUser = {
        id: 'admin-user',
        isAdmin: 1,
        isPayment: true,
        subscriptionTier: 'pro',
        get: jest.fn()
      };
      adminUser.get.mockReturnValue(adminUser);

      const localUserModel = {
        findByPk: jest.fn().mockResolvedValue(adminUser)
      };
      (db.getModels as jest.Mock).mockReturnValue({ User: localUserModel });

      mockReq = { headers: { authorization: 'Bearer admin-token' } };
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'admin-user' });

      const middleware = createAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockReq.authUser?.isAdmin).toBe(true);
    });

    it('should convert isPayment to boolean', async () => {
      const nonPayingUser = {
        id: 'non-paying-user',
        isAdmin: false,
        isPayment: 0,
        subscriptionTier: 'free',
        get: jest.fn()
      };
      nonPayingUser.get.mockReturnValue(nonPayingUser);

      const localUserModel2 = {
        findByPk: jest.fn().mockResolvedValue(nonPayingUser)
      };
      (db.getModels as jest.Mock).mockReturnValue({ User: localUserModel2 });

      mockReq = { headers: { authorization: 'Bearer non-paying-token' } };
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'non-paying-user' });

      const middleware = createAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockReq.authUser?.isPayment).toBe(false);
    });

    it('should default to free tier if subscriptionTier is null', async () => {
      const userWithNoTier = {
        id: 'no-tier-user',
        isAdmin: false,
        isPayment: false,
        subscriptionTier: null,
        get: jest.fn()
      };
      userWithNoTier.get.mockReturnValue(userWithNoTier);

      const localUserModel3 = {
        findByPk: jest.fn().mockResolvedValue(userWithNoTier)
      };
      (db.getModels as jest.Mock).mockReturnValue({ User: localUserModel3 });

      mockReq = { headers: { authorization: 'Bearer no-tier-token' } };
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'no-tier-user' });

      const middleware = createAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockReq.authUser?.subscriptionTier).toBe('free');
    });


    it('should expire cache after TTL', async () => {
      jest.useRealTimers();
      const freshUserModel2 = {
        findByPk: jest.fn().mockResolvedValue(mockUser)
      };
      (db.getModels as jest.Mock).mockReturnValue({ User: freshUserModel2 });

      mockReq.headers = { authorization: 'Bearer valid-token-2' };
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-456' });

      const middleware = createAuthMiddleware(mockEnv);

      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);
      expect(freshUserModel2.findByPk).toHaveBeenCalledTimes(1);

      await new Promise(resolve => setTimeout(resolve, 61));

      mockReq = { headers: { authorization: 'Bearer valid-token-2' } };
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);
      expect(freshUserModel2.findByPk).toHaveBeenCalledTimes(2);

      jest.useFakeTimers();
    });

    it('should handle different subscription tiers', async () => {
      const tiers: Array<'free' | 'pro' | 'premium'> = ['free', 'pro', 'premium'];

      for (const tier of tiers) {
        mockReq = { headers: { authorization: 'Bearer valid-token' } };
        (jwt.verify as jest.Mock).mockReturnValue({ sub: `user-${tier}` });
        mockUser.id = `user-${tier}`;
        mockUser.subscriptionTier = tier;
        mockUserModel.findByPk.mockResolvedValue(mockUser);

        const middleware = createAuthMiddleware(mockEnv);
        await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

        expect(mockReq.authUser?.subscriptionTier).toBe(tier);
      }
    });
  });

  describe('createOptionalAuthMiddleware', () => {
    it('should continue without authentication if no header provided', async () => {
      const middleware = createOptionalAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.userId).toBeUndefined();
      expect(mockReq.authUser).toBeUndefined();
    });

    it('should continue without authentication if header is invalid', async () => {
      mockReq.headers = { authorization: 'Bearer' };
      const middleware = createOptionalAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.userId).toBeUndefined();
    });

    it('should continue without authentication if token is invalid', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const middleware = createOptionalAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.userId).toBeUndefined();
    });

    it('should continue without authentication if user not found', async () => {
      const freshUserModel3 = {
        findByPk: jest.fn().mockResolvedValue(null)
      };
      (db.getModels as jest.Mock).mockReturnValue({ User: freshUserModel3 });

      mockReq = { headers: { authorization: 'Bearer valid-token-new' } };
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-nonexistent' });

      const middleware = createOptionalAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.userId).toBeUndefined();
    });

    it('should authenticate user if valid token provided', async () => {
      mockReq.headers = { authorization: 'Bearer valid-token' };
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });

      const middleware = createOptionalAuthMiddleware(mockEnv);
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockReq.userId).toBe('user-123');
      expect(mockReq.authUser).toEqual({
        id: 'user-123',
        role: 'user',
        isAdmin: false,
        isSuperAdmin: false,
        isPayment: true,
        subscriptionTier: 'pro'
      });
      expect(mockNext).toHaveBeenCalled();
    });


    it('should not throw error on any exception', async () => {
      mockReq.headers = { authorization: 'Bearer valid-token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const middleware = createOptionalAuthMiddleware(mockEnv);
      await expect(
        middleware(mockReq as AuthRequest, mockRes as Response, mockNext)
      ).resolves.not.toThrow();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('should return 403 if user is not authenticated', () => {
      requireAdmin(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(apiError.sendApiError).toHaveBeenCalledWith(mockRes, 403, 'Admin access required');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
      mockReq.authUser = {
        id: 'user-123',
        role: 'user',
        isAdmin: false,
        isSuperAdmin: false,
        isPayment: true,
        subscriptionTier: 'pro'
      };

      requireAdmin(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(apiError.sendApiError).toHaveBeenCalledWith(mockRes, 403, 'Admin access required');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next if user is admin', () => {
      mockReq.authUser = {
        id: 'admin-123',
        role: 'moderator',
        isAdmin: true,
        isSuperAdmin: false,
        isPayment: true,
        subscriptionTier: 'premium'
      };

      requireAdmin(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(apiError.sendApiError).not.toHaveBeenCalled();
    });
  });

  describe('Auth cache behavior', () => {
    it('should cache different users separately', async () => {
      const middleware = createAuthMiddleware(mockEnv);

      mockReq.headers = { authorization: 'Bearer token1' };
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-1' });
      mockUser.id = 'user-1';
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      mockReq = { headers: { authorization: 'Bearer token2' } };
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-2' });
      mockUser.id = 'user-2';
      await middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith('user-1', expect.any(Object));
      expect(mockUserModel.findByPk).toHaveBeenCalledWith('user-2', expect.any(Object));
    });

  });
});
