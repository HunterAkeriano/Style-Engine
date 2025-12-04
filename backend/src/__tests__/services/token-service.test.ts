import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { TokenService } from '../../application/services/token-service';
import * as tokenUtils from '../../utils/tokens';

jest.mock('jsonwebtoken');
jest.mock('crypto');
jest.mock('../../utils/tokens');

describe('TokenService', () => {
  let tokenService: TokenService;
  let mockEnv: any;

  beforeEach(() => {
    mockEnv = {
      JWT_SECRET: 'test-secret'
    };

    tokenService = new TokenService(mockEnv);
    jest.clearAllMocks();
  });

  describe('issueAccess', () => {
    it('should issue access token', () => {
      (tokenUtils.signAccessToken as jest.Mock).mockReturnValue('access-token');

      const result = tokenService.issueAccess('user-123');

      expect(result).toBe('access-token');
      expect(tokenUtils.signAccessToken).toHaveBeenCalledWith(mockEnv, 'user-123');
    });
  });

  describe('issueRefresh', () => {
    it('should issue refresh token pair', () => {
      (tokenUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh-token');
      (tokenUtils.hashToken as jest.Mock).mockReturnValue('token-hash');
      (tokenUtils.signAccessToken as jest.Mock).mockReturnValue('access-token');

      const result = tokenService.issueRefresh();

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.refreshHash).toBe('token-hash');
      expect(result.refreshExpires).toBeInstanceOf(Date);
    });

    it('should set refresh expiration to 30 days', () => {
      (tokenUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh-token');
      (tokenUtils.hashToken as jest.Mock).mockReturnValue('token-hash');
      (tokenUtils.signAccessToken as jest.Mock).mockReturnValue('access-token');

      const beforeCall = Date.now();
      const result = tokenService.issueRefresh();
      const afterCall = Date.now();

      const expectedExpiry = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
      const actualExpiry = result.refreshExpires.getTime() - beforeCall;

      expect(actualExpiry).toBeGreaterThanOrEqual(expectedExpiry - 1000);
      expect(actualExpiry).toBeLessThanOrEqual(expectedExpiry + (afterCall - beforeCall) + 1000);
    });
  });

  describe('signPair', () => {
    it('should sign token pair for user', () => {
      (tokenUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh-token');
      (tokenUtils.hashToken as jest.Mock).mockReturnValue('token-hash');
      (tokenUtils.signAccessToken as jest.Mock).mockReturnValue('access-token');

      const result = tokenService.signPair('user-123');

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.refreshHash).toBe('token-hash');
      expect(result.refreshExpires).toBeInstanceOf(Date);
      expect(tokenUtils.signAccessToken).toHaveBeenCalledWith(mockEnv, 'user-123');
    });

    it('should generate unique refresh tokens', () => {
      (tokenUtils.generateRefreshToken as jest.Mock)
        .mockReturnValueOnce('refresh-token-1')
        .mockReturnValueOnce('refresh-token-2');
      (tokenUtils.hashToken as jest.Mock)
        .mockReturnValueOnce('token-hash-1')
        .mockReturnValueOnce('token-hash-2');
      (tokenUtils.signAccessToken as jest.Mock).mockReturnValue('access-token');

      const result1 = tokenService.signPair('user-123');
      const result2 = tokenService.signPair('user-123');

      expect(result1.refreshToken).toBe('refresh-token-1');
      expect(result2.refreshToken).toBe('refresh-token-2');
      expect(result1.refreshHash).toBe('token-hash-1');
      expect(result2.refreshHash).toBe('token-hash-2');
    });
  });

  describe('verifyAccess', () => {
    it('should verify and return user id from token', () => {
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });

      const result = tokenService.verifyAccess('valid-token');

      expect(result).toBe('user-123');
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
    });

    it('should throw error for invalid token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => tokenService.verifyAccess('invalid-token')).toThrow('Invalid token');
    });

    it('should throw error for expired token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token expired');
      });

      expect(() => tokenService.verifyAccess('expired-token')).toThrow('Token expired');
    });
  });

  describe('hashResetToken', () => {
    it('should hash reset token using SHA256', () => {
      const mockHash = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('hashed-token')
      };
      (crypto.createHash as jest.Mock).mockReturnValue(mockHash);

      const result = tokenService.hashResetToken('reset-token');

      expect(result).toBe('hashed-token');
      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
      expect(mockHash.update).toHaveBeenCalledWith('reset-token');
      expect(mockHash.digest).toHaveBeenCalledWith('hex');
    });

    it('should produce consistent hashes for same input', () => {
      const mockHash = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('same-hash')
      };
      (crypto.createHash as jest.Mock).mockReturnValue(mockHash);

      const result1 = tokenService.hashResetToken('reset-token');
      const result2 = tokenService.hashResetToken('reset-token');

      expect(result1).toBe(result2);
    });
  });
});
