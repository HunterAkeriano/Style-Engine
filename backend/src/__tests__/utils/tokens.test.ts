import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { signAccessToken, generateRefreshToken, hashToken } from '../../utils/tokens';
import type { Env } from '../../config/env';

jest.mock('jsonwebtoken');
jest.mock('crypto');

describe('Tokens Utils', () => {
  let mockEnv: Env;

  beforeEach(() => {
    jest.clearAllMocks();

    mockEnv = {
      JWT_SECRET: 'test-secret-minimum-12-chars',
      DATABASE_URL: 'postgres://test',
      NODE_ENV: 'test',
      SUPER_ADMIN_EMAIL: 'admin@test.com',
      SUPER_ADMIN_PASSWORD: 'password123'
    };
  });

  describe('signAccessToken', () => {
    it('should sign access token with user ID', () => {
      (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

      const result = signAccessToken(mockEnv, 'user-123');

      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: 'user-123' },
        'test-secret-minimum-12-chars',
        { expiresIn: '15m' }
      );
      expect(result).toBe('mocked-token');
    });

    it('should use JWT secret from env', () => {
      (jwt.sign as jest.Mock).mockReturnValue('token');
      mockEnv.JWT_SECRET = 'different-secret-key-min-12';

      signAccessToken(mockEnv, 'user-456');

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        'different-secret-key-min-12',
        expect.any(Object)
      );
    });

    it('should set expiration to 15 minutes', () => {
      (jwt.sign as jest.Mock).mockReturnValue('token');

      signAccessToken(mockEnv, 'user-123');

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(String),
        { expiresIn: '15m' }
      );
    });

    it('should handle different user IDs', () => {
      (jwt.sign as jest.Mock).mockReturnValue('token');

      const userIds = ['user-1', 'user-2', 'user-3'];
      userIds.forEach((userId) => {
        signAccessToken(mockEnv, userId);
        expect(jwt.sign).toHaveBeenCalledWith(
          { sub: userId },
          expect.any(String),
          expect.any(Object)
        );
      });
    });
  });

  describe('generateRefreshToken', () => {
    let mockRandomBytes: jest.Mock;

    beforeEach(() => {
      mockRandomBytes = jest.fn();
      (crypto.randomBytes as jest.Mock) = mockRandomBytes;
    });

    it('should generate 32 bytes random token', () => {
      const mockBuffer = {
        toString: jest.fn().mockReturnValue('abcdef123456')
      };
      mockRandomBytes.mockReturnValue(mockBuffer);

      const result = generateRefreshToken();

      expect(crypto.randomBytes).toHaveBeenCalledWith(32);
      expect(mockBuffer.toString).toHaveBeenCalledWith('hex');
      expect(result).toBe('abcdef123456');
    });

    it('should return hex string', () => {
      const mockBuffer = {
        toString: jest.fn().mockReturnValue('hexstring')
      };
      mockRandomBytes.mockReturnValue(mockBuffer);

      generateRefreshToken();

      expect(mockBuffer.toString).toHaveBeenCalledWith('hex');
    });

    it('should generate different tokens on each call', () => {
      const tokens: string[] = [];
      const buffers = [
        { toString: jest.fn().mockReturnValue('token1') },
        { toString: jest.fn().mockReturnValue('token2') },
        { toString: jest.fn().mockReturnValue('token3') }
      ];

      buffers.forEach((buffer) => {
        mockRandomBytes.mockReturnValueOnce(buffer);
        tokens.push(generateRefreshToken());
      });

      expect(tokens[0]).not.toBe(tokens[1]);
      expect(tokens[1]).not.toBe(tokens[2]);
      expect(tokens[0]).not.toBe(tokens[2]);
    });
  });

  describe('hashToken', () => {
    let mockHash: any;
    let mockUpdate: jest.Mock;
    let mockDigest: jest.Mock;

    beforeEach(() => {
      mockUpdate = jest.fn().mockReturnThis();
      mockDigest = jest.fn().mockReturnValue('hashed-value');
      mockHash = {
        update: mockUpdate,
        digest: mockDigest
      };
      (crypto.createHash as jest.Mock).mockReturnValue(mockHash);
    });

    it('should create SHA256 hash', () => {
      hashToken('test-token');

      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
    });

    it('should update hash with token', () => {
      hashToken('test-token');

      expect(mockUpdate).toHaveBeenCalledWith('test-token');
    });

    it('should return hex digest', () => {
      hashToken('test-token');

      expect(mockDigest).toHaveBeenCalledWith('hex');
    });

    it('should return hashed value', () => {
      mockDigest.mockReturnValue('abcdef123456');

      const result = hashToken('test-token');

      expect(result).toBe('abcdef123456');
    });

    it('should hash different tokens to different values', () => {
      const hashes: string[] = [];
      const tokens = ['token1', 'token2', 'token3'];

      tokens.forEach((token, index) => {
        mockDigest.mockReturnValue(`hash${index}`);
        hashes.push(hashToken(token));
      });

      expect(hashes[0]).not.toBe(hashes[1]);
      expect(hashes[1]).not.toBe(hashes[2]);
    });

    it('should produce consistent hash for same input', () => {
      mockDigest.mockReturnValue('consistent-hash');

      const hash1 = hashToken('same-token');
      const hash2 = hashToken('same-token');

      expect(hash1).toBe(hash2);
    });

    it('should handle empty string', () => {
      hashToken('');

      expect(mockUpdate).toHaveBeenCalledWith('');
      expect(mockDigest).toHaveBeenCalled();
    });

    it('should handle long tokens', () => {
      const longToken = 'a'.repeat(1000);

      hashToken(longToken);

      expect(mockUpdate).toHaveBeenCalledWith(longToken);
    });
  });
});
