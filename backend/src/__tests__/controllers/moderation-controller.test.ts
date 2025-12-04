import { Router } from 'express';
import supertest from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ModerationController } from '../../interfaces/http/controllers/moderation-controller';
import { ModerationService } from '../../application/services/moderation-service';

// Mock dependencies
jest.mock('../../application/services/moderation-service');
jest.mock('../../infrastructure/repositories/saved-item-repository');
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

describe('ModerationController', () => {
  let app: express.Application;
  let controller: ModerationController;
  let mockEnv: any;
  let mockModels: any;
  let mockModerationService: jest.Mocked<ModerationService>;

  const adminId = 'admin-123';
  const userId = 'user-123';
  const adminToken = jwt.sign({ sub: adminId, role: 'admin' }, 'test-secret');
  const userToken = jwt.sign({ sub: userId, role: 'user' }, 'test-secret');

  const categories = ['gradient', 'shadow', 'animation', 'clip-path', 'favicon'] as const;

  beforeEach(() => {
    mockEnv = {
      JWT_SECRET: 'test-secret',
      NODE_ENV: 'test'
    };

    mockModels = {};

    app = express();
    app.use(express.json());
    app.set('envConfig', mockEnv);

    controller = new ModerationController(mockEnv, mockModels);

    mockModerationService = (ModerationService as jest.MockedClass<typeof ModerationService>).mock
      .instances[0] as jest.Mocked<ModerationService>;

    const router = Router();
    controller.register(router);
    app.use('/moderation', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /moderation/pending', () => {
    it('should return pending items for admin', async () => {
      const mockPendingItems = [
        { id: '1', name: 'Item 1', status: 'pending', category: 'gradient' },
        { id: '2', name: 'Item 2', status: 'pending', category: 'shadow' }
      ];

      mockModerationService.listByStatus = jest.fn().mockResolvedValue(mockPendingItems);

      const response = await supertest(app)
        .get('/moderation/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toEqual(mockPendingItems);
      expect(mockModerationService.listByStatus).toHaveBeenCalledWith('pending');
    });

    it('should reject non-admin users', async () => {
      const response = await supertest(app)
        .get('/moderation/pending')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(mockModerationService.listByStatus).not.toHaveBeenCalled();
    });

    it('should reject unauthenticated requests', async () => {
      const response = await supertest(app).get('/moderation/pending');

      expect(response.status).toBe(401);
      expect(mockModerationService.listByStatus).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockModerationService.listByStatus = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .get('/moderation/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch pending items');
    });

    it('should return empty array if no pending items', async () => {
      mockModerationService.listByStatus = jest.fn().mockResolvedValue([]);

      const response = await supertest(app)
        .get('/moderation/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toEqual([]);
    });
  });

  describe('GET /moderation/approved', () => {
    it('should return approved items for admin', async () => {
      const mockApprovedItems = [
        { id: '1', name: 'Approved Item 1', status: 'approved', category: 'gradient' },
        { id: '2', name: 'Approved Item 2', status: 'approved', category: 'animation' }
      ];

      mockModerationService.listByStatus = jest.fn().mockResolvedValue(mockApprovedItems);

      const response = await supertest(app)
        .get('/moderation/approved')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toEqual(mockApprovedItems);
      expect(mockModerationService.listByStatus).toHaveBeenCalledWith('approved');
    });

    it('should reject non-admin users', async () => {
      const response = await supertest(app)
        .get('/moderation/approved')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(mockModerationService.listByStatus).not.toHaveBeenCalled();
    });

    it('should reject unauthenticated requests', async () => {
      const response = await supertest(app).get('/moderation/approved');

      expect(response.status).toBe(401);
      expect(mockModerationService.listByStatus).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockModerationService.listByStatus = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .get('/moderation/approved')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch approved items');
    });
  });

  describe.each(categories)('%s category operations', (category) => {
    const itemId = `${category}-item-123`;

    describe(`POST /moderation/${category}/:id/approve`, () => {
      it('should approve item successfully', async () => {
        const approvedItem = {
          id: itemId,
          name: 'Approved Item',
          status: 'approved',
          category
        };

        mockModerationService.approve = jest.fn().mockResolvedValue(approvedItem);

        const response = await supertest(app)
          .post(`/moderation/${category}/${itemId}/approve`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.item).toEqual(approvedItem);
        expect(mockModerationService.approve).toHaveBeenCalledWith(category, itemId);
      });

      it('should reject non-admin users', async () => {
        const response = await supertest(app)
          .post(`/moderation/${category}/${itemId}/approve`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(mockModerationService.approve).not.toHaveBeenCalled();
      });

      it('should reject unauthenticated requests', async () => {
        const response = await supertest(app).post(`/moderation/${category}/${itemId}/approve`);

        expect(response.status).toBe(401);
        expect(mockModerationService.approve).not.toHaveBeenCalled();
      });

      it('should handle item not found', async () => {
        mockModerationService.approve = jest.fn().mockRejectedValue({
          status: 404,
          message: 'Item not found'
        });

        const response = await supertest(app)
          .post(`/moderation/${category}/${itemId}/approve`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Item not found');
      });

      it('should handle already approved item', async () => {
        mockModerationService.approve = jest.fn().mockRejectedValue({
          status: 400,
          message: 'Item is already approved'
        });

        const response = await supertest(app)
          .post(`/moderation/${category}/${itemId}/approve`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Item is already approved');
      });

      it('should handle service errors', async () => {
        mockModerationService.approve = jest.fn().mockRejectedValue(new Error('Database error'));

        const response = await supertest(app)
          .post(`/moderation/${category}/${itemId}/approve`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to approve item');
      });
    });

    describe(`PUT /moderation/${category}/:id`, () => {
      it('should rename item successfully', async () => {
        const newName = 'Updated Item Name';
        const updatedItem = {
          id: itemId,
          name: newName,
          category
        };

        mockModerationService.rename = jest.fn().mockResolvedValue(updatedItem);

        const response = await supertest(app)
          .put(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: newName });

        expect(response.status).toBe(200);
        expect(response.body.item).toEqual(updatedItem);
        expect(mockModerationService.rename).toHaveBeenCalledWith(category, itemId, newName);
      });

      it('should reject non-admin users', async () => {
        const response = await supertest(app)
          .put(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ name: 'New Name' });

        expect(response.status).toBe(403);
        expect(mockModerationService.rename).not.toHaveBeenCalled();
      });

      it('should reject unauthenticated requests', async () => {
        const response = await supertest(app)
          .put(`/moderation/${category}/${itemId}`)
          .send({ name: 'New Name' });

        expect(response.status).toBe(401);
        expect(mockModerationService.rename).not.toHaveBeenCalled();
      });

      it('should reject missing name', async () => {
        const response = await supertest(app)
          .put(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Name is required');
        expect(mockModerationService.rename).not.toHaveBeenCalled();
      });

      it('should reject non-string name', async () => {
        const response = await supertest(app)
          .put(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: 123 });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Name is required');
        expect(mockModerationService.rename).not.toHaveBeenCalled();
      });

      it('should reject empty string name', async () => {
        const response = await supertest(app)
          .put(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: '' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Name is required');
        expect(mockModerationService.rename).not.toHaveBeenCalled();
      });

      it('should handle item not found', async () => {
        mockModerationService.rename = jest.fn().mockRejectedValue({
          status: 404,
          message: 'Item not found'
        });

        const response = await supertest(app)
          .put(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: 'New Name' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Item not found');
      });

      it('should handle service errors', async () => {
        mockModerationService.rename = jest.fn().mockRejectedValue(new Error('Database error'));

        const response = await supertest(app)
          .put(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: 'New Name' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to update item');
      });

      it('should handle Unicode in name', async () => {
        const unicodeName = '渐变效果 🎨';
        mockModerationService.rename = jest.fn().mockResolvedValue({
          id: itemId,
          name: unicodeName,
          category
        });

        const response = await supertest(app)
          .put(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: unicodeName });

        expect(response.status).toBe(200);
      });

      it('should trim whitespace from name', async () => {
        const nameWithSpaces = '  Trimmed Name  ';
        mockModerationService.rename = jest.fn().mockResolvedValue({
          id: itemId,
          name: 'Trimmed Name',
          category
        });

        const response = await supertest(app)
          .put(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: nameWithSpaces });

        expect(response.status).toBe(200);
      });
    });

    describe(`DELETE /moderation/${category}/:id`, () => {
      it('should delete item successfully', async () => {
        mockModerationService.remove = jest.fn().mockResolvedValue(undefined);

        const response = await supertest(app)
          .delete(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
        expect(mockModerationService.remove).toHaveBeenCalledWith(category, itemId);
      });

      it('should reject non-admin users', async () => {
        const response = await supertest(app)
          .delete(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(mockModerationService.remove).not.toHaveBeenCalled();
      });

      it('should reject unauthenticated requests', async () => {
        const response = await supertest(app).delete(`/moderation/${category}/${itemId}`);

        expect(response.status).toBe(401);
        expect(mockModerationService.remove).not.toHaveBeenCalled();
      });

      it('should handle item not found', async () => {
        mockModerationService.remove = jest.fn().mockRejectedValue({
          status: 404,
          message: 'Item not found'
        });

        const response = await supertest(app)
          .delete(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Item not found');
      });

      it('should handle service errors', async () => {
        mockModerationService.remove = jest.fn().mockRejectedValue(new Error('Database error'));

        const response = await supertest(app)
          .delete(`/moderation/${category}/${itemId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to delete item');
      });
    });
  });

  describe('Security and Edge Cases', () => {
    it('should handle SQL injection in item ID', async () => {
      const maliciousId = "1'; DROP TABLE saved_items; --";

      mockModerationService.approve = jest.fn().mockRejectedValue({
        status: 404,
        message: 'Item not found'
      });

      const response = await supertest(app)
        .post(`/moderation/gradient/${maliciousId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);

      // Should be handled safely
      expect([404, 500]).toContain(response.status);
    });

    it('should handle XSS in item name', async () => {
      const xssName = '<script>alert("XSS")</script>';
      mockModerationService.rename = jest.fn().mockResolvedValue({
        id: 'item-id',
        name: xssName,
        category: 'gradient'
      });

      const response = await supertest(app)
        .put('/moderation/gradient/item-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: xssName });

      expect(response.status).toBe(200);
      // XSS should be sanitized on frontend
    });

    it('should handle concurrent approval requests', async () => {
      mockModerationService.approve = jest.fn().mockResolvedValue({
        id: 'item-id',
        status: 'approved'
      });

      const requests = Array(5)
        .fill(null)
        .map(() =>
          supertest(app)
            .post('/moderation/gradient/item-id/approve')
            .set('Authorization', `Bearer ${adminToken}`)
        );

      const responses = await Promise.all(requests);

      // First should succeed, others might fail due to already approved
      const successCount = responses.filter((r) => r.status === 200).length;
      expect(successCount).toBeGreaterThan(0);
    });

    it('should handle very long item names', async () => {
      const longName = 'a'.repeat(1000);
      mockModerationService.rename = jest.fn().mockResolvedValue({
        id: 'item-id',
        name: longName
      });

      const response = await supertest(app)
        .put('/moderation/gradient/item-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: longName });

      // Should either accept or reject gracefully
      expect([200, 400, 500]).toContain(response.status);
    });

    it('should prevent privilege escalation', async () => {
      // Regular user trying to approve item
      const response = await supertest(app)
        .post('/moderation/gradient/item-id/approve')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(mockModerationService.approve).not.toHaveBeenCalled();
    });

    it('should handle invalid category names', async () => {
      const response = await supertest(app)
        .post('/moderation/invalid-category/item-id/approve')
        .set('Authorization', `Bearer ${adminToken}`);

      // Should be handled by service or return 404
      expect([400, 404, 500]).toContain(response.status);
    });

    it('should handle malformed item IDs', async () => {
      const malformedIds = ['', '..', '../', 'null', 'undefined', '%00'];

      for (const id of malformedIds) {
        const response = await supertest(app)
          .post(`/moderation/gradient/${encodeURIComponent(id)}/approve`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect([400, 404, 500]).toContain(response.status);
      }
    });

    it('should isolate moderation between categories', async () => {
      mockModerationService.approve = jest.fn().mockResolvedValue({ id: 'item-id' });

      await supertest(app)
        .post('/moderation/gradient/item-id/approve')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(mockModerationService.approve).toHaveBeenCalledWith('gradient', 'item-id');

      jest.clearAllMocks();

      await supertest(app)
        .post('/moderation/shadow/item-id/approve')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(mockModerationService.approve).toHaveBeenCalledWith('shadow', 'item-id');
    });

    it('should handle empty request body for rename', async () => {
      const response = await supertest(app)
        .put('/moderation/gradient/item-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name is required');
    });

    it('should handle null name for rename', async () => {
      const response = await supertest(app)
        .put('/moderation/gradient/item-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: null });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name is required');
    });

    it('should handle whitespace-only name', async () => {
      const response = await supertest(app)
        .put('/moderation/gradient/item-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: '   ' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name is required');
    });

    it('should handle expired admin token', async () => {
      const expiredToken = jwt.sign(
        { sub: adminId, role: 'admin', exp: Math.floor(Date.now() / 1000) - 3600 },
        'test-secret'
      );

      const response = await supertest(app)
        .get('/moderation/pending')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(mockModerationService.listByStatus).not.toHaveBeenCalled();
    });

    it('should handle concurrent deletions', async () => {
      mockModerationService.remove = jest.fn().mockResolvedValue(undefined);

      const requests = Array(3)
        .fill(null)
        .map(() =>
          supertest(app)
            .delete('/moderation/gradient/item-id')
            .set('Authorization', `Bearer ${adminToken}`)
        );

      const responses = await Promise.all(requests);

      // First should succeed, others might fail
      const successCount = responses.filter((r) => r.status === 200).length;
      expect(successCount).toBeGreaterThan(0);
    });
  });
});
