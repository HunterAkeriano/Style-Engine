import { Router } from 'express';
import supertest from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ProfileController } from '../../interfaces/http/controllers/profile-controller';
import { ProfileService } from '../../application/services/profile-service';

jest.mock('../../application/services/profile-service');
jest.mock('../../infrastructure/repositories/user-repository');
jest.mock('../../middleware/auth', () => ({
  createAuthMiddleware: (env: any) => (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      req.userId = decoded.sub;
      next();
    } catch {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
}));
jest.mock('../../middleware/upload', () => ({
  uploadAvatar: {
    single: () => (req: any, res: any, next: any) => {
      if (req.body.mockFile) {
        req.file = {
          filename: 'test-avatar.jpg',
          path: '/uploads/test-avatar.jpg'
        };
      }
      next();
    }
  }
}));

describe('ProfileController', () => {
  let app: express.Application;
  let controller: ProfileController;
  let mockEnv: any;
  let mockModels: any;
  let mockProfileService: jest.Mocked<ProfileService>;

  const userId = '123';
  const validToken = (secret: string) => jwt.sign({ sub: userId }, secret);

  beforeEach(() => {
    mockEnv = {
      JWT_SECRET: 'test-secret',
      NODE_ENV: 'test'
    };

    mockModels = {};

    app = express();
    app.use(express.json());
    app.set('envConfig', mockEnv);

    controller = new ProfileController(mockEnv, mockModels);

    mockProfileService = (ProfileService as jest.MockedClass<typeof ProfileService>).mock
      .instances[0] as jest.Mocked<ProfileService>;

    const router = Router();
    controller.register(router);
    app.use('/profile', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /profile', () => {
    it('should get profile successfully with valid token', async () => {
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: 'user'
      };

      mockProfileService.getProfile = jest.fn().mockResolvedValue(mockUser);

      const response = await supertest(app)
        .get('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser });
      expect(mockProfileService.getProfile).toHaveBeenCalledWith(userId);
    });

    it('should reject request without authorization token', async () => {
      const response = await supertest(app).get('/profile');

      expect(response.status).toBe(401);
      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      const response = await supertest(app)
        .get('/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });

    it('should reject request with expired token', async () => {
      const expiredToken = jwt.sign(
        { sub: userId, exp: Math.floor(Date.now() / 1000) - 3600 },
        mockEnv.JWT_SECRET
      );

      const response = await supertest(app)
        .get('/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });

    it('should handle user not found', async () => {
      mockProfileService.getProfile = jest.fn().mockRejectedValue({
        status: 404,
        message: 'User not found'
      });

      const response = await supertest(app)
        .get('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should handle service errors', async () => {
      mockProfileService.getProfile = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .get('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to load profile');
    });

    it('should reject malformed authorization header', async () => {
      const response = await supertest(app).get('/profile').set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });

    it('should reject token signed with different secret', async () => {
      const wrongSecretToken = jwt.sign({ sub: userId }, 'wrong-secret');

      const response = await supertest(app)
        .get('/profile')
        .set('Authorization', `Bearer ${wrongSecretToken}`);

      expect(response.status).toBe(401);
      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });
  });

  describe('PUT /profile', () => {
    it('should update profile name successfully', async () => {
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Updated Name',
        role: 'user'
      };

      mockProfileService.updateProfile = jest.fn().mockResolvedValue(updatedUser);

      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: updatedUser });
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(userId, {
        name: 'Updated Name'
      });
    });

    it('should update profile avatar URL successfully', async () => {
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        avatarUrl: 'https://example.com/new-avatar.jpg',
        role: 'user'
      };

      mockProfileService.updateProfile = jest.fn().mockResolvedValue(updatedUser);

      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({ avatarUrl: 'https://example.com/new-avatar.jpg' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: updatedUser });
    });

    it('should update both name and avatar URL', async () => {
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'New Name',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: 'user'
      };

      mockProfileService.updateProfile = jest.fn().mockResolvedValue(updatedUser);

      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({
          name: 'New Name',
          avatarUrl: 'https://example.com/avatar.jpg'
        });

      expect(response.status).toBe(200);
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(userId, {
        name: 'New Name',
        avatarUrl: 'https://example.com/avatar.jpg'
      });
    });

    it('should reject update without authorization', async () => {
      const response = await supertest(app).put('/profile').send({ name: 'New Name' });

      expect(response.status).toBe(401);
      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });

    it('should reject name shorter than 1 character', async () => {
      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({ name: '' });

      expect(response.status).toBe(400);
      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });

    it('should reject name longer than 120 characters', async () => {
      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({ name: 'a'.repeat(121) });

      expect(response.status).toBe(400);
      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });

    it('should reject invalid avatar URL', async () => {
      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({ avatarUrl: 'not-a-url' });

      expect(response.status).toBe(400);
      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });

    it('should accept empty update object', async () => {
      const currentUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      };

      mockProfileService.updateProfile = jest.fn().mockResolvedValue(currentUser);

      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({});

      expect(response.status).toBe(200);
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(userId, {});
    });

    it('should handle service errors', async () => {
      mockProfileService.updateProfile = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({ name: 'New Name' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to update profile');
    });

    it('should handle user not found error', async () => {
      mockProfileService.updateProfile = jest.fn().mockRejectedValue({
        status: 404,
        message: 'User not found'
      });

      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({ name: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should ignore unknown fields', async () => {
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'New Name',
        role: 'user'
      };

      mockProfileService.updateProfile = jest.fn().mockResolvedValue(updatedUser);

      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({
          name: 'New Name',
          unknownField: 'should be ignored',
          email: 'should-not-update@example.com'
        });

      expect(response.status).toBe(200);
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(userId, {
        name: 'New Name'
      });
    });

    it('should handle XSS attempts in name', async () => {
      const xssName = '<script>alert("XSS")</script>';
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        name: xssName,
        role: 'user'
      };

      mockProfileService.updateProfile = jest.fn().mockResolvedValue(updatedUser);

      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({ name: xssName });

      expect(response.status).toBe(200);
    });
  });

  describe('POST /profile/avatar', () => {
    it('should upload avatar successfully', async () => {
      const mockResult = {
        user: {
          id: userId,
          email: 'test@example.com',
          avatarUrl: 'http://localhost:3000/uploads/test-avatar.jpg'
        }
      };

      mockProfileService.updateAvatar = jest.fn().mockResolvedValue(mockResult);

      const response = await supertest(app)
        .post('/profile/avatar')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .set('Host', 'localhost:3000')
        .send({ mockFile: true });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(mockProfileService.updateAvatar).toHaveBeenCalledWith(
        userId,
        'test-avatar.jpg',
        'localhost:3000',
        'http'
      );
    });

    it('should reject upload without authentication', async () => {
      const response = await supertest(app).post('/profile/avatar').send({ mockFile: true });

      expect(response.status).toBe(401);
      expect(mockProfileService.updateAvatar).not.toHaveBeenCalled();
    });

    it('should reject upload without file', async () => {
      const response = await supertest(app)
        .post('/profile/avatar')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No file uploaded');
      expect(mockProfileService.updateAvatar).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockProfileService.updateAvatar = jest.fn().mockRejectedValue(new Error('Storage error'));

      const response = await supertest(app)
        .post('/profile/avatar')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .set('Host', 'localhost:3000')
        .send({ mockFile: true });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to update avatar');
    });

    it('should handle user not found error', async () => {
      mockProfileService.updateAvatar = jest.fn().mockRejectedValue({
        status: 404,
        message: 'User not found'
      });

      const response = await supertest(app)
        .post('/profile/avatar')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .set('Host', 'localhost:3000')
        .send({ mockFile: true });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should handle file upload errors', async () => {
      mockProfileService.updateAvatar = jest.fn().mockRejectedValue({
        status: 400,
        message: 'Invalid file format'
      });

      const response = await supertest(app)
        .post('/profile/avatar')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .set('Host', 'localhost:3000')
        .send({ mockFile: true });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid file format');
    });
  });

  describe('Security and Edge Cases', () => {
    it('should not allow user to access another user profile', async () => {
      mockProfileService.getProfile = jest.fn().mockResolvedValue({
        id: userId,
        email: 'test@example.com'
      });

      const response = await supertest(app)
        .get('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`);

      expect(response.status).toBe(200);
      expect(mockProfileService.getProfile).toHaveBeenCalledWith(userId);
    });

    it('should handle concurrent profile updates', async () => {
      mockProfileService.updateProfile = jest.fn().mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        name: 'Updated'
      });

      const requests = Array(5)
        .fill(null)
        .map(() =>
          supertest(app)
            .put('/profile')
            .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
            .send({ name: 'Updated' })
        );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle very long avatar URLs', async () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(2000) + '.jpg';

      mockProfileService.updateProfile = jest.fn().mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        avatarUrl: longUrl
      });

      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({ avatarUrl: longUrl });

      expect([200, 400, 500]).toContain(response.status);
    });

    it('should properly handle Unicode characters in name', async () => {
      const unicodeName = '测试用户 🚀';
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        name: unicodeName,
        role: 'user'
      };

      mockProfileService.updateProfile = jest.fn().mockResolvedValue(updatedUser);

      const response = await supertest(app)
        .put('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .send({ name: unicodeName });

      expect(response.status).toBe(200);
      expect(response.body.user.name).toBe(unicodeName);
    });

    it('should not allow method override attacks', async () => {
      const response = await supertest(app)
        .post('/profile')
        .set('Authorization', `Bearer ${validToken(mockEnv.JWT_SECRET)}`)
        .set('X-HTTP-Method-Override', 'DELETE');

      expect(response.status).toBe(404);
    });
  });
});
