import { Router } from 'express';
import supertest from 'supertest';
import express from 'express';
import { HealthController } from '../../interfaces/http/controllers/health-controller';

describe('HealthController', () => {
  let app: express.Application;
  let controller: HealthController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    controller = new HealthController();
    const router = Router();
    controller.register(router);
    app.use('/health', router);
  });

  describe('GET /health', () => {
    it('should return 200 with status ok', async () => {
      const response = await supertest(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });

    it('should return JSON content type', async () => {
      const response = await supertest(app).get('/health');

      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should be accessible without authentication', async () => {
      const response = await supertest(app).get('/health');

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should respond quickly (performance test)', async () => {
      const start = Date.now();
      await supertest(app).get('/health');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10)
        .fill(null)
        .map(() => supertest(app).get('/health'));

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
      });
    });

    it('should not accept POST method', async () => {
      const response = await supertest(app).post('/health');

      expect(response.status).toBe(404);
    });

    it('should not accept PUT method', async () => {
      const response = await supertest(app).put('/health');

      expect(response.status).toBe(404);
    });

    it('should not accept DELETE method', async () => {
      const response = await supertest(app).delete('/health');

      expect(response.status).toBe(404);
    });

    it('should always return the same response (idempotent)', async () => {
      const response1 = await supertest(app).get('/health');
      const response2 = await supertest(app).get('/health');
      const response3 = await supertest(app).get('/health');

      expect(response1.body).toEqual(response2.body);
      expect(response2.body).toEqual(response3.body);
    });
  });
});
