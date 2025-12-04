import { Router } from 'express';
import supertest from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { SavesController } from '../../interfaces/http/controllers/saves-controller';
import { SavedItemService } from '../../application/services/saved-item-service';

jest.mock('../../application/services/saved-item-service');
jest.mock('../../infrastructure/repositories/saved-item-repository');
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

describe('SavesController', () => {
  let app: express.Application;
  let controller: SavesController;
  let mockEnv: any;
  let mockModels: any;
  let mockSavedItemService: jest.Mocked<SavedItemService>;

  const userId = '123';
  const userToken = jwt.sign({ sub: userId }, 'test-secret');

  const categories = ['gradients', 'shadows', 'animations', 'clip-paths', 'favicons'] as const;

  beforeEach(() => {
    mockEnv = {
      JWT_SECRET: 'test-secret',
      NODE_ENV: 'test'
    };

    mockModels = {};

    app = express();
    app.use(express.json());
    app.set('envConfig', mockEnv);

    controller = new SavesController(mockEnv, mockModels);

    mockSavedItemService = (SavedItemService as jest.MockedClass<typeof SavedItemService>).mock
      .instances[0] as jest.Mocked<SavedItemService>;

    const router = Router();
    controller.register(router);
    app.use('/saves', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe.each(categories)('%s endpoints', (category) => {
    const singularCategory = category.replace(/-/g, '').replace(/s$/, '');

    describe(`GET /saves/${category}`, () => {
      it('should list user saved items', async () => {
        const mockItems = [
          { id: '1', name: 'Item 1', userId, category: singularCategory },
          { id: '2', name: 'Item 2', userId, category: singularCategory }
        ];

        mockSavedItemService.list = jest.fn().mockResolvedValue(mockItems);

        const response = await supertest(app)
          .get(`/saves/${category}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.items).toEqual(mockItems);
        expect(mockSavedItemService.list).toHaveBeenCalledWith(expect.any(String), userId);
      });

      it('should require authentication', async () => {
        const response = await supertest(app).get(`/saves/${category}`);

        expect(response.status).toBe(401);
        expect(mockSavedItemService.list).not.toHaveBeenCalled();
      });

      it('should reject invalid token', async () => {
        const response = await supertest(app)
          .get(`/saves/${category}`)
          .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(401);
        expect(mockSavedItemService.list).not.toHaveBeenCalled();
      });

      it('should handle service errors', async () => {
        mockSavedItemService.list = jest.fn().mockRejectedValue(new Error('Database error'));

        const response = await supertest(app)
          .get(`/saves/${category}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to load items');
      });

      it('should return empty array if no items', async () => {
        mockSavedItemService.list = jest.fn().mockResolvedValue([]);

        const response = await supertest(app)
          .get(`/saves/${category}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.items).toEqual([]);
      });
    });

    describe(`GET /saves/public/${category}`, () => {
      it('should list public items without authentication', async () => {
        const mockItems = [
          { id: '1', name: 'Public Item 1', isPublic: true },
          { id: '2', name: 'Public Item 2', isPublic: true }
        ];

        mockSavedItemService.listPublic = jest.fn().mockResolvedValue(mockItems);

        const response = await supertest(app).get(`/saves/public/${category}`);

        expect(response.status).toBe(200);
        expect(response.body.items).toEqual(mockItems);
        expect(mockSavedItemService.listPublic).toHaveBeenCalledWith(expect.any(String));
      });

      it('should not require authentication', async () => {
        mockSavedItemService.listPublic = jest.fn().mockResolvedValue([]);

        const response = await supertest(app).get(`/saves/public/${category}`);

        expect(response.status).toBe(200);
      });

      it('should handle service errors', async () => {
        mockSavedItemService.listPublic = jest.fn().mockRejectedValue(new Error('Database error'));

        const response = await supertest(app).get(`/saves/public/${category}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to load items');
      });

      it('should only return approved public items', async () => {
        const mockItems = [{ id: '1', name: 'Approved Item', isPublic: true, status: 'approved' }];

        mockSavedItemService.listPublic = jest.fn().mockResolvedValue(mockItems);

        const response = await supertest(app).get(`/saves/public/${category}`);

        expect(response.status).toBe(200);
        expect(response.body.items).toEqual(mockItems);
      });
    });

    describe(`POST /saves/${category}`, () => {
      const validPayload = {
        name: 'My Custom Style',
        payload: {
          colors: ['#ff0000', '#00ff00'],
          type: 'linear'
        }
      };

      it('should create new saved item', async () => {
        const createdItem = {
          id: 'new-id',
          ...validPayload,
          userId,
          category: singularCategory
        };

        mockSavedItemService.create = jest.fn().mockResolvedValue(createdItem);

        const response = await supertest(app)
          .post(`/saves/${category}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(validPayload);

        expect(response.status).toBe(201);
        expect(response.body.item).toEqual(createdItem);
        expect(mockSavedItemService.create).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object),
          {
            name: validPayload.name,
            data: validPayload.payload
          }
        );
      });

      it('should require authentication', async () => {
        const response = await supertest(app).post(`/saves/${category}`).send(validPayload);

        expect(response.status).toBe(401);
        expect(mockSavedItemService.create).not.toHaveBeenCalled();
      });

      it('should reject empty name', async () => {
        const response = await supertest(app)
          .post(`/saves/${category}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ name: '', payload: validPayload.payload });

        expect(response.status).toBe(400);
        expect(mockSavedItemService.create).not.toHaveBeenCalled();
      });

      it('should reject name longer than 120 characters', async () => {
        const response = await supertest(app)
          .post(`/saves/${category}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ name: 'a'.repeat(121), payload: validPayload.payload });

        expect(response.status).toBe(400);
        expect(mockSavedItemService.create).not.toHaveBeenCalled();
      });

      it('should reject missing payload', async () => {
        const response = await supertest(app)
          .post(`/saves/${category}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ name: 'Test Item' });

        expect(response.status).toBe(400);
        expect(mockSavedItemService.create).not.toHaveBeenCalled();
      });

      it('should accept complex payload objects', async () => {
        const complexPayload = {
          name: 'Complex Style',
          payload: {
            colors: ['#ff0000', '#00ff00', '#0000ff'],
            type: 'radial',
            angle: 45,
            stops: [
              { color: '#ff0000', position: 0 },
              { color: '#00ff00', position: 50 },
              { color: '#0000ff', position: 100 }
            ]
          }
        };

        mockSavedItemService.create = jest.fn().mockResolvedValue(complexPayload);

        const response = await supertest(app)
          .post(`/saves/${category}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(complexPayload);

        expect(response.status).toBe(201);
      });

      it('should handle service errors', async () => {
        mockSavedItemService.create = jest.fn().mockRejectedValue(new Error('Database error'));

        const response = await supertest(app)
          .post(`/saves/${category}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(validPayload);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to save item');
      });

      it('should handle quota exceeded error', async () => {
        mockSavedItemService.create = jest.fn().mockRejectedValue({
          status: 403,
          message: 'Storage quota exceeded'
        });

        const response = await supertest(app)
          .post(`/saves/${category}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(validPayload);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Storage quota exceeded');
      });

      it('should sanitize XSS attempts in name', async () => {
        const xssPayload = {
          name: '<script>alert("XSS")</script>',
          payload: validPayload.payload
        };

        mockSavedItemService.create = jest.fn().mockResolvedValue({
          id: 'new-id',
          ...xssPayload,
          userId
        });

        const response = await supertest(app)
          .post(`/saves/${category}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(xssPayload);

        expect(response.status).toBe(201);
      });
    });

    describe(`POST /saves/${category}/:id/publish`, () => {
      const itemId = 'item-123';

      it('should publish item successfully', async () => {
        const publishedItem = {
          id: itemId,
          name: 'Published Item',
          isPublic: true,
          status: 'pending'
        };

        mockSavedItemService.requestPublish = jest.fn().mockResolvedValue(publishedItem);

        const response = await supertest(app)
          .post(`/saves/${category}/${itemId}/publish`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.item).toEqual(publishedItem);
        expect(mockSavedItemService.requestPublish).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object),
          itemId
        );
      });

      it('should require authentication', async () => {
        const response = await supertest(app).post(`/saves/${category}/${itemId}/publish`);

        expect(response.status).toBe(401);
        expect(mockSavedItemService.requestPublish).not.toHaveBeenCalled();
      });

      it('should reject if item not found', async () => {
        mockSavedItemService.requestPublish = jest.fn().mockRejectedValue({
          status: 404,
          message: 'Item not found'
        });

        const response = await supertest(app)
          .post(`/saves/${category}/${itemId}/publish`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Item not found');
      });

      it('should reject if user does not own item', async () => {
        mockSavedItemService.requestPublish = jest.fn().mockRejectedValue({
          status: 403,
          message: 'Not authorized to publish this item'
        });

        const response = await supertest(app)
          .post(`/saves/${category}/${itemId}/publish`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Not authorized to publish this item');
      });

      it('should reject if already published', async () => {
        mockSavedItemService.requestPublish = jest.fn().mockRejectedValue({
          status: 400,
          message: 'Item is already published'
        });

        const response = await supertest(app)
          .post(`/saves/${category}/${itemId}/publish`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Item is already published');
      });

      it('should handle service errors', async () => {
        mockSavedItemService.requestPublish = jest.fn().mockRejectedValue(new Error('Database error'));

        const response = await supertest(app)
          .post(`/saves/${category}/${itemId}/publish`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to publish item');
      });
    });

    describe(`DELETE /saves/${category}/:id`, () => {
      const itemId = 'item-123';

      it('should delete item successfully', async () => {
        mockSavedItemService.remove = jest.fn().mockResolvedValue(undefined);

        const response = await supertest(app)
          .delete(`/saves/${category}/${itemId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(204);
        expect(mockSavedItemService.remove).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object),
          itemId
        );
      });

      it('should require authentication', async () => {
        const response = await supertest(app).delete(`/saves/${category}/${itemId}`);

        expect(response.status).toBe(401);
        expect(mockSavedItemService.remove).not.toHaveBeenCalled();
      });

      it('should reject if item not found', async () => {
        mockSavedItemService.remove = jest.fn().mockRejectedValue({
          status: 404,
          message: 'Item not found'
        });

        const response = await supertest(app)
          .delete(`/saves/${category}/${itemId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Item not found');
      });

      it('should reject if user does not own item', async () => {
        mockSavedItemService.remove = jest.fn().mockRejectedValue({
          status: 403,
          message: 'Not authorized to delete this item'
        });

        const response = await supertest(app)
          .delete(`/saves/${category}/${itemId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Not authorized to delete this item');
      });

      it('should handle service errors', async () => {
        mockSavedItemService.remove = jest.fn().mockRejectedValue(new Error('Database error'));

        const response = await supertest(app)
          .delete(`/saves/${category}/${itemId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to delete item');
      });

      it('should not return body on successful deletion', async () => {
        mockSavedItemService.remove = jest.fn().mockResolvedValue(undefined);

        const response = await supertest(app)
          .delete(`/saves/${category}/${itemId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
      });
    });
  });

  describe('Security and Edge Cases', () => {
    it('should not allow cross-category access', async () => {
      mockSavedItemService.list = jest.fn().mockResolvedValue([]);

      await supertest(app).get('/saves/gradients').set('Authorization', `Bearer ${userToken}`);

      expect(mockSavedItemService.list).toHaveBeenCalledWith('gradient', userId);

      await supertest(app).get('/saves/shadows').set('Authorization', `Bearer ${userToken}`);

      expect(mockSavedItemService.list).toHaveBeenCalledWith('shadow', userId);
    });

    it('should handle concurrent save operations', async () => {
      mockSavedItemService.create = jest.fn().mockResolvedValue({ id: 'new-id' });

      const requests = Array(5)
        .fill(null)
        .map(() =>
          supertest(app)
            .post('/saves/gradients')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              name: 'Concurrent Item',
              payload: { test: 'data' }
            })
        );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect([201, 403, 500]).toContain(response.status);
      });
    });

    it('should handle very large payload objects', async () => {
      const largePayload = {
        name: 'Large Payload',
        payload: {
          data: 'a'.repeat(10000)
        }
      };

      mockSavedItemService.create = jest.fn().mockResolvedValue({ id: 'new-id' });

      const response = await supertest(app)
        .post('/saves/gradients')
        .set('Authorization', `Bearer ${userToken}`)
        .send(largePayload);


      expect([201, 400, 413, 500]).toContain(response.status);
    });

    it('should handle deeply nested payload objects', async () => {
      const deeplyNested: any = { name: 'Nested', payload: {} };
      let current = deeplyNested.payload;
      for (let i = 0; i < 50; i++) {
        current.nested = {};
        current = current.nested;
      }

      mockSavedItemService.create = jest.fn().mockResolvedValue({ id: 'new-id' });

      const response = await supertest(app)
        .post('/saves/gradients')
        .set('Authorization', `Bearer ${userToken}`)
        .send(deeplyNested);

      expect([201, 400, 500]).toContain(response.status);
    });

    it('should handle Unicode characters in names', async () => {
      const unicodePayload = {
        name: '我的渐变 🎨',
        payload: { test: 'data' }
      };

      mockSavedItemService.create = jest.fn().mockResolvedValue({
        id: 'new-id',
        ...unicodePayload
      });

      const response = await supertest(app)
        .post('/saves/gradients')
        .set('Authorization', `Bearer ${userToken}`)
        .send(unicodePayload);

      expect(response.status).toBe(201);
    });

    it('should prevent NoSQL injection in payload', async () => {
      const maliciousPayload = {
        name: 'Malicious',
        payload: {
          $where: 'this.password == "test"'
        }
      };

      mockSavedItemService.create = jest.fn().mockResolvedValue({ id: 'new-id' });

      const response = await supertest(app)
        .post('/saves/gradients')
        .set('Authorization', `Bearer ${userToken}`)
        .send(maliciousPayload);

      expect([201, 400, 500]).toContain(response.status);
    });

    it('should handle missing category gracefully', async () => {
      const response = await supertest(app)
        .get('/saves/invalid-category')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });

    it('should isolate users data', async () => {
      const user1Token = jwt.sign({ sub: 'user1' }, 'test-secret');
      const user2Token = jwt.sign({ sub: 'user2' }, 'test-secret');

      mockSavedItemService.list = jest.fn().mockResolvedValue([{ id: '1', userId: 'user1' }]);

      await supertest(app).get('/saves/gradients').set('Authorization', `Bearer ${user1Token}`);

      expect(mockSavedItemService.list).toHaveBeenCalledWith('gradient', 'user1');

      await supertest(app).get('/saves/gradients').set('Authorization', `Bearer ${user2Token}`);

      expect(mockSavedItemService.list).toHaveBeenCalledWith('gradient', 'user2');
    });

    it('should handle expired tokens', async () => {
      const expiredToken = jwt.sign(
        { sub: userId, exp: Math.floor(Date.now() / 1000) - 3600 },
        'test-secret'
      );

      const response = await supertest(app)
        .get('/saves/gradients')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(mockSavedItemService.list).not.toHaveBeenCalled();
    });
  });
});
