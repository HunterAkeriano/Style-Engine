import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { AuthService } from '../../application/services/auth-service';
import { UserRepository } from '../../infrastructure/repositories/user-repository';
import { RefreshTokenRepository } from '../../infrastructure/repositories/refresh-token-repository';
import { PasswordResetRepository } from '../../infrastructure/repositories/password-reset-repository';
import { TokenService } from '../../application/services/token-service';

jest.mock('bcryptjs');
jest.mock('crypto');
jest.mock('../../config/super-admin', () => ({
  isSuperAdminEmail: jest.fn((env: any, email: string) => {
    return email === 'admin@example.com';
  })
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockEnv: any;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockRefreshTokenRepo: jest.Mocked<RefreshTokenRepository>;
  let mockPasswordResetRepo: jest.Mocked<PasswordResetRepository>;
  let mockTokenService: jest.Mocked<TokenService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    name: 'Test User',
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isPayment: false,
    isAdmin: false,
    subscriptionTier: 'free',
    subscriptionExpiresAt: null,
    get: jest.fn().mockReturnThis()
  };

  beforeEach(() => {
    mockEnv = {
      JWT_SECRET: 'test-secret',
      SUPER_ADMIN_EMAIL: 'admin@example.com'
    };

    mockUserRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    } as any;

    mockRefreshTokenRepo = {
      create: jest.fn(),
      findValid: jest.fn(),
      revokeByHash: jest.fn()
    } as any;

    mockPasswordResetRepo = {
      create: jest.fn(),
      findValid: jest.fn(),
      markUsed: jest.fn()
    } as any;

    mockTokenService = {
      signPair: jest.fn(),
      issueAccess: jest.fn(),
      hashResetToken: jest.fn()
    } as any;

    authService = new AuthService(
      mockEnv,
      mockUserRepo,
      mockRefreshTokenRepo,
      mockPasswordResetRepo,
      mockTokenService
    );

    // Reset mocks
    jest.clearAllMocks();

    // Setup bcrypt mock
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Setup crypto mock
    (crypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('token-hash')
    } as any);
    (crypto.randomBytes as jest.Mock).mockReturnValue({
      toString: jest.fn().mockReturnValue('reset-token-hex')
    } as any);

    // Setup user mock - make sure get() returns the user data
    mockUser.get = jest.fn(() => ({
      id: mockUser.id,
      email: mockUser.email,
      passwordHash: mockUser.passwordHash,
      name: mockUser.name,
      avatarUrl: mockUser.avatarUrl,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
      isPayment: mockUser.isPayment,
      isAdmin: mockUser.isAdmin,
      subscriptionTier: mockUser.subscriptionTier,
      subscriptionExpiresAt: mockUser.subscriptionExpiresAt
    })) as any;
  });

  describe('toSafeUser', () => {
    it('should convert user to safe user without password', () => {
      const result = authService.toSafeUser(mockUser as any);

      expect(result).toBeDefined();
      expect(result?.email).toBe('test@example.com');
      expect(result).toHaveProperty('isSuperAdmin');
      expect((result as any)?.passwordHash).toBeUndefined();
    });

    it('should mark super admin correctly', () => {
      const adminUser = {
        ...mockUser,
        email: 'admin@example.com',
        get: jest.fn(() => ({
          id: mockUser.id,
          email: 'admin@example.com',
          passwordHash: mockUser.passwordHash,
          name: mockUser.name,
          avatarUrl: mockUser.avatarUrl,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
          isPayment: mockUser.isPayment,
          isAdmin: mockUser.isAdmin,
          subscriptionTier: mockUser.subscriptionTier,
          subscriptionExpiresAt: mockUser.subscriptionExpiresAt
        }))
      };

      const result = authService.toSafeUser(adminUser as any);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('isSuperAdmin');
    });

    it('should return null for null user', () => {
      const result = authService.toSafeUser(null);
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue(mockUser as any);
      mockTokenService.signPair.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        refreshHash: 'refresh-hash',
        refreshExpires: new Date()
      });

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.user.email).toBe('test@example.com');
      expect(mockUserRepo.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        name: 'Test User'
      });
      expect(mockRefreshTokenRepo.create).toHaveBeenCalled();
    });

    it('should lowercase email on registration', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue(mockUser as any);
      mockTokenService.signPair.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        refreshHash: 'refresh-hash',
        refreshExpires: new Date()
      });

      await authService.register({
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      });

      expect(mockUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com'
        })
      );
    });

    it('should throw error if user already exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password123'
        })
      ).rejects.toMatchObject({
        status: 409,
        message: 'User already exists'
      });
    });

    it('should handle missing name field', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue(mockUser as any);
      mockTokenService.signPair.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        refreshHash: 'refresh-hash',
        refreshExpires: new Date()
      });

      await authService.register({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(mockUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: null
        })
      );
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);
      mockTokenService.signPair.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        refreshHash: 'refresh-hash',
        refreshExpires: new Date()
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.user.email).toBe('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
    });

    it('should throw error if user not found', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
      ).rejects.toMatchObject({
        status: 401,
        message: 'Invalid credentials'
      });
    });

    it('should throw error if password is invalid', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrong-password'
        })
      ).rejects.toMatchObject({
        status: 401,
        message: 'Invalid credentials'
      });
    });

    it('should create refresh token on successful login', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);
      const expiresAt = new Date();
      mockTokenService.signPair.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        refreshHash: 'refresh-hash',
        refreshExpires: expiresAt
      });

      await authService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(mockRefreshTokenRepo.create).toHaveBeenCalledWith({
        userId: 'user-123',
        tokenHash: 'refresh-hash',
        expiresAt,
        revoked: false
      });
    });
  });

  describe('refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      mockRefreshTokenRepo.findValid.mockResolvedValue({
        userId: 'user-123',
        tokenHash: 'token-hash',
        expiresAt: new Date(),
        revoked: false
      } as any);
      mockUserRepo.findById.mockResolvedValue(mockUser as any);
      mockTokenService.issueAccess.mockReturnValue('new-access-token');

      const result = await authService.refresh('refresh-token');

      expect(result.accessToken).toBe('new-access-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error if refresh token is invalid', async () => {
      mockRefreshTokenRepo.findValid.mockResolvedValue(null);

      await expect(authService.refresh('invalid-token')).rejects.toMatchObject({
        status: 401,
        message: 'Invalid refresh token'
      });
    });

    it('should throw error if user not found', async () => {
      mockRefreshTokenRepo.findValid.mockResolvedValue({
        userId: 'user-123',
        tokenHash: 'token-hash',
        expiresAt: new Date(),
        revoked: false
      } as any);
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(authService.refresh('refresh-token')).rejects.toMatchObject({
        status: 401,
        message: 'Invalid refresh token'
      });
    });

    it('should hash refresh token before lookup', async () => {
      mockRefreshTokenRepo.findValid.mockResolvedValue({
        userId: 'user-123',
        tokenHash: 'token-hash',
        expiresAt: new Date(),
        revoked: false
      } as any);
      mockUserRepo.findById.mockResolvedValue(mockUser as any);
      mockTokenService.issueAccess.mockReturnValue('new-access-token');

      await authService.refresh('refresh-token');

      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
      expect(mockRefreshTokenRepo.findValid).toHaveBeenCalledWith('token-hash');
    });
  });

  describe('logout', () => {
    it('should revoke refresh token on logout', async () => {
      await authService.logout('refresh-token');

      expect(mockRefreshTokenRepo.revokeByHash).toHaveBeenCalledWith('token-hash');
    });

    it('should handle undefined refresh token', async () => {
      await authService.logout(undefined);

      expect(mockRefreshTokenRepo.revokeByHash).not.toHaveBeenCalled();
    });

    it('should hash token before revoking', async () => {
      await authService.logout('refresh-token');

      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
    });
  });

  describe('forgotPassword', () => {
    it('should create password reset token', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);
      mockTokenService.hashResetToken.mockReturnValue('hashed-reset-token');

      const result = await authService.forgotPassword('test@example.com');

      expect(result.token).toBe('reset-token-hex');
      expect(result.userEmail).toBe('test@example.com');
      expect(mockPasswordResetRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          tokenHash: 'hashed-reset-token',
          used: false
        })
      );
    });

    it('should throw error if email not found', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(authService.forgotPassword('nonexistent@example.com')).rejects.toMatchObject({
        status: 404,
        message: 'Email not found'
      });
    });

    it('should generate random token', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);
      mockTokenService.hashResetToken.mockReturnValue('hashed-reset-token');

      await authService.forgotPassword('test@example.com');

      expect(crypto.randomBytes).toHaveBeenCalledWith(24);
    });

    it('should set expiration time to 1 hour', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);
      mockTokenService.hashResetToken.mockReturnValue('hashed-reset-token');
      const beforeCall = Date.now();

      await authService.forgotPassword('test@example.com');

      const call = mockPasswordResetRepo.create.mock.calls[0][0];
      expect(call.expiresAt).toBeDefined();
      const expirationTime = call.expiresAt!.getTime() - beforeCall;
      expect(expirationTime).toBeGreaterThan(3590000); // ~59 mins
      expect(expirationTime).toBeLessThan(3610000); // ~60 mins
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const mockReset = {
        userId: 'user-123',
        tokenHash: 'token-hash',
        expiresAt: new Date(),
        used: false
      };
      mockPasswordResetRepo.findValid.mockResolvedValue(mockReset as any);
      mockUserRepo.findById.mockResolvedValue(mockUser as any);
      mockTokenService.hashResetToken.mockReturnValue('token-hash');

      await authService.resetPassword({
        token: 'reset-token',
        password: 'new-password'
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
      expect(mockUserRepo.update).toHaveBeenCalledWith(
        mockUser,
        expect.objectContaining({
          passwordHash: 'hashed-password'
        })
      );
      expect(mockPasswordResetRepo.markUsed).toHaveBeenCalledWith(mockReset);
    });

    it('should throw error if reset token is invalid', async () => {
      mockPasswordResetRepo.findValid.mockResolvedValue(null);
      mockTokenService.hashResetToken.mockReturnValue('token-hash');

      await expect(
        authService.resetPassword({
          token: 'invalid-token',
          password: 'new-password'
        })
      ).rejects.toMatchObject({
        status: 400,
        message: 'Invalid or expired token'
      });
    });

    it('should throw error if user not found', async () => {
      mockPasswordResetRepo.findValid.mockResolvedValue({
        userId: 'user-123',
        tokenHash: 'token-hash',
        expiresAt: new Date(),
        used: false
      } as any);
      mockUserRepo.findById.mockResolvedValue(null);
      mockTokenService.hashResetToken.mockReturnValue('token-hash');

      await expect(
        authService.resetPassword({
          token: 'reset-token',
          password: 'new-password'
        })
      ).rejects.toMatchObject({
        status: 400,
        message: 'Invalid or expired token'
      });
    });
  });

  describe('changePassword', () => {
    it('should change password with valid current password', async () => {
      mockUserRepo.findById.mockResolvedValue(mockUser as any);

      await authService.changePassword({
        userId: 'user-123',
        currentPassword: 'old-password',
        newPassword: 'new-password'
      });

      expect(bcrypt.compare).toHaveBeenCalledWith('old-password', 'hashed-password');
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
      expect(mockUserRepo.update).toHaveBeenCalledWith(
        mockUser,
        expect.objectContaining({
          passwordHash: 'hashed-password'
        })
      );
    });

    it('should throw error if user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(
        authService.changePassword({
          userId: 'nonexistent',
          currentPassword: 'old-password',
          newPassword: 'new-password'
        })
      ).rejects.toMatchObject({
        status: 401,
        message: 'User not found'
      });
    });

    it('should throw error if current password is invalid', async () => {
      mockUserRepo.findById.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.changePassword({
          userId: 'user-123',
          currentPassword: 'wrong-password',
          newPassword: 'new-password'
        })
      ).rejects.toMatchObject({
        status: 400,
        message: 'Invalid current password'
      });
    });
  });
});
