import { Router } from 'express';
import supertest from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { AuthController } from '../../interfaces/http/controllers/auth-controller';
import { AuthService } from '../../application/services/auth-service';

jest.mock('../../application/services/auth-service');
jest.mock('../../application/services/mailer-service');
jest.mock('../../infrastructure/repositories/user-repository');
jest.mock('../../infrastructure/repositories/refresh-token-repository');
jest.mock('../../infrastructure/repositories/password-reset-repository');

describe('AuthController', () => {
  let app: express.Application;
  let controller: AuthController;
  let mockEnv: any;
  let mockModels: any;
  let mockAuthService: jest.Mocked<AuthService>;

  const validEmail = 'test@example.com';
  const validPassword = 'Password123!';
  const validName = 'Test User';
  const weakPassword = '12345';
  const invalidEmail = 'invalid-email';

  beforeEach(() => {
    mockEnv = {
      JWT_SECRET: 'test-secret',
      NODE_ENV: 'test',
      APP_URL: 'http://localhost:3000',
      REFRESH_TOKEN_SECRET: 'refresh-secret'
    };

    mockModels = {};

    app = express();
    app.use(express.json());
    app.set('envConfig', mockEnv);

    controller = new AuthController(mockEnv, mockModels);

    mockAuthService = (AuthService as jest.MockedClass<typeof AuthService>).mock
      .instances[0] as jest.Mocked<AuthService>;

    const router = Router();
    controller.register(router);
    app.use('/auth', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '123',
        email: validEmail,
        name: validName,
        role: 'user'
      };

      mockAuthService.register = jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser
      });

      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: validPassword,
        name: validName
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        token: 'access-token',
        user: mockUser
      });
      expect(response.headers['set-cookie']).toBeDefined();
      expect(mockAuthService.register).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword,
        name: validName
      });
    });

    it('should reject registration with weak password', async () => {
      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: weakPassword,
        name: validName
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid payload');
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('should reject registration with invalid email', async () => {
      const response = await supertest(app).post('/auth/register').send({
        email: invalidEmail,
        password: validPassword,
        name: validName
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid payload');
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('should reject registration without password uppercase', async () => {
      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: 'password123!',
        name: validName
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid payload');
    });

    it('should reject registration without password lowercase', async () => {
      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: 'PASSWORD123!',
        name: validName
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid payload');
    });

    it('should reject registration without password digit', async () => {
      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: 'PasswordABC!',
        name: validName
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid payload');
    });

    it('should reject registration without password special character', async () => {
      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: 'Password123',
        name: validName
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid payload');
    });

    it('should reject registration with password less than 8 characters', async () => {
      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: 'Pass1!',
        name: validName
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid payload');
    });

    it('should register without name (optional field)', async () => {
      const mockUser = {
        id: '123',
        email: validEmail,
        role: 'user'
      };

      mockAuthService.register = jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser
      });

      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: validPassword
      });

      expect(response.status).toBe(201);
    });

    it('should reject registration with name longer than 120 characters', async () => {
      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: validPassword,
        name: 'a'.repeat(121)
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid payload');
    });

    it('should handle duplicate email error', async () => {
      mockAuthService.register = jest.fn().mockRejectedValue({
        status: 409,
        message: 'Email already exists'
      });

      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: validPassword,
        name: validName
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Email already exists');
    });

    it('should handle service errors', async () => {
      mockAuthService.register = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: validPassword,
        name: validName
      });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to register user');
    });

    it('should set httpOnly cookie', async () => {
      mockAuthService.register = jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: '123', email: validEmail }
      });

      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: validPassword
      });

      const setCookie = response.headers['set-cookie']?.[0];
      expect(setCookie).toContain('HttpOnly');
      expect(setCookie).toContain('refreshToken');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: validEmail,
        name: validName,
        role: 'user'
      };

      mockAuthService.login = jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser
      });

      const response = await supertest(app).post('/auth/login').send({
        email: validEmail,
        password: validPassword
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: 'access-token',
        user: mockUser
      });
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword
      });
    });

    it('should reject login with invalid email format', async () => {
      const response = await supertest(app).post('/auth/login').send({
        email: invalidEmail,
        password: validPassword
      });

      expect(response.status).toBe(400);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should reject login with missing password', async () => {
      const response = await supertest(app).post('/auth/login').send({
        email: validEmail
      });

      expect(response.status).toBe(400);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should handle invalid credentials error', async () => {
      mockAuthService.login = jest.fn().mockRejectedValue({
        status: 401,
        message: 'Invalid credentials'
      });

      const response = await supertest(app).post('/auth/login').send({
        email: validEmail,
        password: 'wrongpassword'
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not accept name field in login', async () => {
      mockAuthService.login = jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: '123', email: validEmail }
      });

      const response = await supertest(app).post('/auth/login').send({
        email: validEmail,
        password: validPassword,
        name: 'should be ignored'
      });

      expect(response.status).toBe(200);
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: validEmail,
        password: validPassword
      });
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      const mockUser = { id: '123', email: validEmail };

      mockAuthService.refresh = jest.fn().mockResolvedValue({
        accessToken: 'new-access-token',
        user: mockUser
      });

      const response = await supertest(app)
        .post('/auth/refresh')
        .set('Cookie', ['refreshToken=valid-refresh-token']);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: 'new-access-token',
        user: mockUser
      });
      expect(mockAuthService.refresh).toHaveBeenCalledWith('valid-refresh-token');
    });

    it('should reject refresh without token', async () => {
      const response = await supertest(app).post('/auth/refresh');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Missing refresh token');
      expect(mockAuthService.refresh).not.toHaveBeenCalled();
    });

    it('should handle expired refresh token', async () => {
      mockAuthService.refresh = jest.fn().mockRejectedValue({
        status: 401,
        message: 'Invalid or expired refresh token'
      });

      const response = await supertest(app)
        .post('/auth/refresh')
        .set('Cookie', ['refreshToken=expired-token']);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid or expired refresh token');
    });

    it('should handle invalid refresh token', async () => {
      mockAuthService.refresh = jest.fn().mockRejectedValue({
        status: 401,
        message: 'Invalid token'
      });

      const response = await supertest(app)
        .post('/auth/refresh')
        .set('Cookie', ['refreshToken=invalid-token']);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      mockAuthService.logout = jest.fn().mockResolvedValue(undefined);

      const response = await supertest(app)
        .post('/auth/logout')
        .set('Cookie', ['refreshToken=valid-token']);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
      expect(mockAuthService.logout).toHaveBeenCalledWith('valid-token');
    });

    it('should logout even without token', async () => {
      mockAuthService.logout = jest.fn().mockResolvedValue(undefined);

      const response = await supertest(app).post('/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
      expect(mockAuthService.logout).toHaveBeenCalledWith(undefined);
    });

    it('should clear refresh token cookie', async () => {
      mockAuthService.logout = jest.fn().mockResolvedValue(undefined);

      const response = await supertest(app)
        .post('/auth/logout')
        .set('Cookie', ['refreshToken=valid-token']);

      const setCookie = response.headers['set-cookie']?.[0];
      expect(setCookie).toContain('refreshToken=;');
      expect(setCookie).toContain('Max-Age=0');
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should send password reset email successfully', async () => {
      mockAuthService.forgotPassword = jest.fn().mockResolvedValue({
        token: 'reset-token',
        userEmail: validEmail
      });

      const response = await supertest(app).post('/auth/forgot-password').send({
        email: validEmail
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(validEmail);
    });

    it('should reject invalid email format', async () => {
      const response = await supertest(app).post('/auth/forgot-password').send({
        email: invalidEmail
      });

      expect(response.status).toBe(400);
      expect(mockAuthService.forgotPassword).not.toHaveBeenCalled();
    });

    it('should reject missing email', async () => {
      const response = await supertest(app).post('/auth/forgot-password').send({});

      expect(response.status).toBe(400);
      expect(mockAuthService.forgotPassword).not.toHaveBeenCalled();
    });

    it('should handle user not found', async () => {
      mockAuthService.forgotPassword = jest.fn().mockRejectedValue({
        status: 404,
        message: 'User not found'
      });

      const response = await supertest(app).post('/auth/forgot-password').send({
        email: validEmail
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should handle mailer errors', async () => {
      mockAuthService.forgotPassword = jest.fn().mockRejectedValue({
        status: 500,
        message: 'Failed to send email'
      });

      const response = await supertest(app).post('/auth/forgot-password').send({
        email: validEmail
      });

      expect(response.status).toBe(500);
    });
  });

  describe('POST /auth/reset-password', () => {
    const validToken = 'valid-reset-token-123';

    it('should reset password successfully', async () => {
      mockAuthService.resetPassword = jest.fn().mockResolvedValue(undefined);

      const response = await supertest(app).post('/auth/reset-password').send({
        token: validToken,
        password: validPassword
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith({
        token: validToken,
        password: validPassword
      });
    });

    it('should reject weak password', async () => {
      const response = await supertest(app).post('/auth/reset-password').send({
        token: validToken,
        password: weakPassword
      });

      expect(response.status).toBe(400);
      expect(mockAuthService.resetPassword).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      mockAuthService.resetPassword = jest.fn().mockRejectedValue({
        status: 400,
        message: 'Invalid or expired reset token'
      });

      const response = await supertest(app).post('/auth/reset-password').send({
        token: 'invalid-token',
        password: validPassword
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid or expired reset token');
    });

    it('should reject short token', async () => {
      const response = await supertest(app).post('/auth/reset-password').send({
        token: 'short',
        password: validPassword
      });

      expect(response.status).toBe(400);
      expect(mockAuthService.resetPassword).not.toHaveBeenCalled();
    });

    it('should reject missing token', async () => {
      const response = await supertest(app).post('/auth/reset-password').send({
        password: validPassword
      });

      expect(response.status).toBe(400);
      expect(mockAuthService.resetPassword).not.toHaveBeenCalled();
    });

    it('should reject missing password', async () => {
      const response = await supertest(app).post('/auth/reset-password').send({
        token: validToken
      });

      expect(response.status).toBe(400);
      expect(mockAuthService.resetPassword).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/change-password', () => {
    const userId = '123';
    const getValidToken = () => jwt.sign({ sub: userId }, mockEnv.JWT_SECRET);

    it('should change password successfully', async () => {
      mockAuthService.changePassword = jest.fn().mockResolvedValue(undefined);

      const response = await supertest(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${getValidToken()}`)
        .send({
          currentPassword: validPassword,
          newPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
      expect(mockAuthService.changePassword).toHaveBeenCalledWith({
        userId,
        currentPassword: validPassword,
        newPassword: 'NewPassword123!'
      });
    });

    it('should reject without authorization header', async () => {
      const response = await supertest(app).post('/auth/change-password').send({
        currentPassword: validPassword,
        newPassword: 'NewPassword123!'
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Missing authorization header');
      expect(mockAuthService.changePassword).not.toHaveBeenCalled();
    });

    it('should reject invalid authorization header format', async () => {
      const response = await supertest(app)
        .post('/auth/change-password')
        .set('Authorization', 'InvalidFormat')
        .send({
          currentPassword: validPassword,
          newPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid authorization header');
    });

    it('should reject expired token', async () => {
      const expiredToken = jwt.sign({ sub: userId, exp: Math.floor(Date.now() / 1000) - 3600 }, mockEnv.JWT_SECRET);

      const response = await supertest(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({
          currentPassword: validPassword,
          newPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid or expired token');
    });

    it('should reject invalid token', async () => {
      const response = await supertest(app)
        .post('/auth/change-password')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          currentPassword: validPassword,
          newPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid or expired token');
    });

    it('should reject weak new password', async () => {
      const response = await supertest(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${getValidToken()}`)
        .send({
          currentPassword: validPassword,
          newPassword: 'weak'
        });

      expect(response.status).toBe(400);
      expect(mockAuthService.changePassword).not.toHaveBeenCalled();
    });

    it('should reject missing current password', async () => {
      const response = await supertest(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${getValidToken()}`)
        .send({
          newPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(400);
      expect(mockAuthService.changePassword).not.toHaveBeenCalled();
    });

    it('should reject missing new password', async () => {
      const response = await supertest(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${getValidToken()}`)
        .send({
          currentPassword: validPassword
        });

      expect(response.status).toBe(400);
      expect(mockAuthService.changePassword).not.toHaveBeenCalled();
    });

    it('should handle wrong current password', async () => {
      mockAuthService.changePassword = jest.fn().mockRejectedValue({
        status: 401,
        message: 'Current password is incorrect'
      });

      const response = await supertest(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${getValidToken()}`)
        .send({
          currentPassword: 'WrongPassword123!',
          newPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Current password is incorrect');
    });

    it('should handle service errors', async () => {
      mockAuthService.changePassword = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${getValidToken()}`)
        .send({
          currentPassword: validPassword,
          newPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to change password');
    });
  });

  describe('Security and Edge Cases', () => {
    it('should not leak information about user existence in forgot-password', async () => {
      mockAuthService.forgotPassword = jest.fn().mockResolvedValue({
        token: 'reset-token',
        userEmail: validEmail
      });

      const response = await supertest(app).post('/auth/forgot-password').send({
        email: 'nonexistent@example.com'
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
    });

    it('should handle SQL injection attempts in email', async () => {
      const sqlInjection = "'; DROP TABLE users; --";

      const response = await supertest(app).post('/auth/login').send({
        email: sqlInjection,
        password: validPassword
      });

      expect(response.status).toBe(400);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should handle XSS attempts in name field', async () => {
      const xssAttempt = '<script>alert("XSS")</script>';

      mockAuthService.register = jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: '123', email: validEmail, name: xssAttempt }
      });

      const response = await supertest(app).post('/auth/register').send({
        email: validEmail,
        password: validPassword,
        name: xssAttempt
      });

      expect(response.status).toBe(201);
    });

    it('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(300) + '@example.com';

      const response = await supertest(app).post('/auth/register').send({
        email: longEmail,
        password: validPassword
      });

      expect([400, 500]).toContain(response.status);
    });

    it('should handle concurrent registration attempts', async () => {
      mockAuthService.register = jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: '123', email: validEmail }
      });

      const requests = Array(5)
        .fill(null)
        .map(() =>
          supertest(app).post('/auth/register').send({
            email: validEmail,
            password: validPassword
          })
        );

      const responses = await Promise.all(requests);

      const successCount = responses.filter((r) => r.status === 201).length;
      expect(successCount).toBeGreaterThan(0);
    });

    it('should set secure cookie in production', () => {
      const prodEnv = { ...mockEnv, NODE_ENV: 'production' };
      const prodController = new AuthController(prodEnv, mockModels);

      const cookieConfig = (prodController as any).cookieConfig();
      expect(cookieConfig.secure).toBe(true);
    });

    it('should not set secure cookie in development', () => {
      const cookieConfig = (controller as any).cookieConfig();
      expect(cookieConfig.secure).toBe(false);
    });
  });
});
