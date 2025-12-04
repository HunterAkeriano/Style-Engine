import { Router } from 'express';
import supertest from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { UsersController } from '../../interfaces/http/controllers/users-controller';
import { UserService } from '../../application/services/user-service';

jest.mock('../../application/services/user-service');
jest.mock('../../infrastructure/repositories/user-repository');
jest.mock('../../middleware/auth', () => ({
  createAuthMiddleware: (env: any) => (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      req.userId = decoded.sub;
      req.userRole = decoded.role || 'user';
      next();
    } catch {
      res.status(401).json({ message: 'Invalid token' });
    }
  },
  requireAdmin: (req: any, res: any, next: any) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }
}));

describe('UsersController', () => {
  let app: express.Application;
  let controller: UsersController;
  let mockEnv: any;
  let mockModels: any;
  let mockUserService: jest.Mocked<UserService>;

  const adminId = 'admin-123';
  const userId = 'user-123';
  const adminToken = jwt.sign({ sub: adminId, role: 'admin' }, 'test-secret');
  const userToken = jwt.sign({ sub: userId, role: 'user' }, 'test-secret');

  beforeEach(() => {
    mockEnv = {
      JWT_SECRET: 'test-secret',
      NODE_ENV: 'test'
    };

    mockModels = {};

    app = express();
    app.use(express.json());
    app.set('envConfig', mockEnv);

    controller = new UsersController(mockEnv, mockModels);

    mockUserService = (UserService as jest.MockedClass<typeof UserService>).mock
      .instances[0] as jest.Mocked<UserService>;

    const router = Router();
    controller.register(router);
    app.use('/users', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users/public', () => {
    it('should return public users list without authentication', async () => {
      const mockUsers = {
        users: [
          { id: '1', name: 'User 1', email: 'user1@test.com' },
          { id: '2', name: 'User 2', email: 'user2@test.com' }
        ],
        total: 2,
        page: 1,
        limit: 20
      };

      mockUserService.fetchUsers = jest.fn().mockResolvedValue(mockUsers);

      const response = await supertest(app).get('/users/public');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(mockUserService.fetchUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        tier: 'all',
        sortBy: 'createdat',
        sortOrder: 'desc'
      });
    });

    it('should support pagination', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app).get('/users/public?page=2&limit=10');

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        tier: 'all',
        sortBy: 'createdat',
        sortOrder: 'desc'
      });
    });

    it('should support tier filtering', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app).get('/users/public?tier=pro');

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        tier: 'pro',
        sortBy: 'createdat',
        sortOrder: 'desc'
      });
    });

    it('should support sorting', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app).get('/users/public?sortBy=name&sortOrder=asc');

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        tier: 'all',
        sortBy: 'name',
        sortOrder: 'asc'
      });
    });

    it('should sanitize invalid page numbers', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app).get('/users/public?page=-1');

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1
        })
      );
    });

    it('should cap limit at 100', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app).get('/users/public?limit=1000');

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 100
        })
      );
    });

    it('should handle invalid tier values', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app).get('/users/public?tier=invalid');

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          tier: 'all'
        })
      );
    });

    it('should handle invalid sortBy values', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app).get('/users/public?sortBy=invalid');

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: 'createdat'
        })
      );
    });

    it('should handle service errors', async () => {
      mockUserService.fetchUsers = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await supertest(app).get('/users/public');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to load users');
    });
  });

  describe('GET /users', () => {
    it('should return users list for admin', async () => {
      const mockUsers = {
        users: [
          { id: '1', name: 'User 1', email: 'user1@test.com', role: 'user' },
          { id: '2', name: 'User 2', email: 'user2@test.com', role: 'admin' }
        ],
        total: 2,
        page: 1,
        limit: 20
      };

      mockUserService.fetchUsers = jest.fn().mockResolvedValue(mockUsers);

      const response = await supertest(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it('should reject non-admin users', async () => {
      const response = await supertest(app)
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(mockUserService.fetchUsers).not.toHaveBeenCalled();
    });

    it('should reject unauthenticated requests', async () => {
      const response = await supertest(app).get('/users');

      expect(response.status).toBe(401);
      expect(mockUserService.fetchUsers).not.toHaveBeenCalled();
    });

    it('should support all query parameters like public endpoint', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app)
        .get('/users?page=3&limit=50&tier=premium&sortBy=email&sortOrder=asc')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith({
        page: 3,
        limit: 50,
        tier: 'premium',
        sortBy: 'email',
        sortOrder: 'asc'
      });
    });
  });

  describe('PUT /users/:id', () => {
    const targetUserId = 'target-user-123';

    it('should update user successfully as admin', async () => {
      const updates = {
        name: 'Updated Name',
        email: 'updated@test.com',
        role: 'admin'
      };

      const updatedUser = {
        id: targetUserId,
        ...updates
      };

      mockUserService.updateUser = jest.fn().mockResolvedValue(updatedUser);

      const response = await supertest(app)
        .put(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(updatedUser);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(targetUserId, updates);
    });

    it('should reject non-admin users', async () => {
      const response = await supertest(app)
        .put(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(403);
      expect(mockUserService.updateUser).not.toHaveBeenCalled();
    });

    it('should reject missing user id', async () => {
      const response = await supertest(app)
        .put('/users/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
    });

    it('should handle user not found', async () => {
      mockUserService.updateUser = jest.fn().mockRejectedValue({
        status: 404,
        message: 'User not found'
      });

      const response = await supertest(app)
        .put(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should handle duplicate email error', async () => {
      mockUserService.updateUser = jest.fn().mockRejectedValue({
        code: '23505'
      });

      const response = await supertest(app)
        .put(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'existing@test.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already in use');
    });

    it('should accept partial updates', async () => {
      mockUserService.updateUser = jest.fn().mockResolvedValue({
        id: targetUserId,
        name: 'Only Name Updated'
      });

      const response = await supertest(app)
        .put(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Only Name Updated' });

      expect(response.status).toBe(200);
    });

    it('should accept empty update object', async () => {
      mockUserService.updateUser = jest.fn().mockResolvedValue({
        id: targetUserId
      });

      const response = await supertest(app)
        .put(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(200);
    });

    it('should handle service errors', async () => {
      mockUserService.updateUser = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .put(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to update user');
    });

    it('should allow changing subscription tier', async () => {
      mockUserService.updateUser = jest.fn().mockResolvedValue({
        id: targetUserId,
        subscriptionTier: 'premium'
      });

      const response = await supertest(app)
        .put(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ subscriptionTier: 'premium' });

      expect(response.status).toBe(200);
    });

    it('should allow changing role', async () => {
      mockUserService.updateUser = jest.fn().mockResolvedValue({
        id: targetUserId,
        role: 'admin'
      });

      const response = await supertest(app)
        .put(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'admin' });

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /users/:id', () => {
    const targetUserId = 'target-user-123';

    it('should delete user successfully as admin', async () => {
      mockUserService.deleteUser = jest.fn().mockResolvedValue(undefined);

      const response = await supertest(app)
        .delete(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(targetUserId);
    });

    it('should reject non-admin users', async () => {
      const response = await supertest(app)
        .delete(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(mockUserService.deleteUser).not.toHaveBeenCalled();
    });

    it('should reject missing user id', async () => {
      const response = await supertest(app)
        .delete('/users/')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it('should handle user not found', async () => {
      mockUserService.deleteUser = jest.fn().mockRejectedValue({
        status: 404,
        message: 'User not found'
      });

      const response = await supertest(app)
        .delete(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should handle service errors', async () => {
      mockUserService.deleteUser = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .delete(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to delete user');
    });

    it('should not return body on successful deletion', async () => {
      mockUserService.deleteUser = jest.fn().mockResolvedValue(undefined);

      const response = await supertest(app)
        .delete(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should prevent deleting own account', async () => {
      mockUserService.deleteUser = jest.fn().mockRejectedValue({
        status: 400,
        message: 'Cannot delete your own account'
      });

      const response = await supertest(app)
        .delete(`/users/${adminId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Cannot delete your own account');
    });
  });

  describe('Security and Edge Cases', () => {
    it('should handle SQL injection in query parameters', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app).get("/users/public?sortBy=name'; DROP TABLE users; --");

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: 'createdat'
        })
      );
    });

    it('should handle XSS in update payload', async () => {
      const xssPayload = {
        name: '<script>alert("XSS")</script>'
      };

      mockUserService.updateUser = jest.fn().mockResolvedValue({
        id: 'user-id',
        ...xssPayload
      });

      const response = await supertest(app)
        .put('/users/user-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(xssPayload);

      expect(response.status).toBe(200);
    });

    it('should handle concurrent user updates', async () => {
      mockUserService.updateUser = jest.fn().mockResolvedValue({ id: 'user-id' });

      const requests = Array(5)
        .fill(null)
        .map(() =>
          supertest(app)
            .put('/users/user-id')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Updated' })
        );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle zero page number', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app).get('/users/public?page=0');

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1
        })
      );
    });

    it('should handle zero limit', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app).get('/users/public?limit=0');

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 1
        })
      );
    });

    it('should handle invalid sortOrder values', async () => {
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      await supertest(app).get('/users/public?sortOrder=invalid');

      expect(mockUserService.fetchUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          sortOrder: 'desc'
        })
      );
    });

    it('should handle Unicode in user names', async () => {
      mockUserService.updateUser = jest.fn().mockResolvedValue({
        id: 'user-id',
        name: '用户名 👤'
      });

      const response = await supertest(app)
        .put('/users/user-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: '用户名 👤' });

      expect(response.status).toBe(200);
    });

    it('should prevent privilege escalation attempts', async () => {
      const response = await supertest(app)
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it('should validate all tier values', async () => {
      const validTiers = ['all', 'free', 'pro', 'premium'];
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      for (const tier of validTiers) {
        await supertest(app).get(`/users/public?tier=${tier}`);

        expect(mockUserService.fetchUsers).toHaveBeenCalledWith(
          expect.objectContaining({
            tier
          })
        );

        jest.clearAllMocks();
      }
    });

    it('should validate all sortBy values', async () => {
      const validSortFields = ['name', 'email', 'createdat', 'subscriptiontier'];
      mockUserService.fetchUsers = jest.fn().mockResolvedValue({ users: [], total: 0 });

      for (const sortBy of validSortFields) {
        await supertest(app).get(`/users/public?sortBy=${sortBy}`);

        expect(mockUserService.fetchUsers).toHaveBeenCalledWith(
          expect.objectContaining({
            sortBy
          })
        );

        jest.clearAllMocks();
      }
    });
  });
});
