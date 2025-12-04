import { Router } from 'express';
import supertest from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { QuizController } from '../../interfaces/http/controllers/quiz-controller';
import { QuizService } from '../../application/services/quiz-service';

jest.mock('../../application/services/quiz-service');
jest.mock('../../middleware/auth', () => {
  const actualAuth = jest.requireActual('../../middleware/auth');
  return {
    ...actualAuth,
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
    createOptionalAuthMiddleware: (env: any) => (req: any, res: any, next: any) => {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, env.JWT_SECRET) as any;
          req.userId = decoded.sub;
          req.userRole = decoded.role || 'user';
        } catch {}
      }
      next();
    },
    requireAdmin: (req: any, res: any, next: any) => {
      if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    }
  };
});

describe('QuizController', () => {
  let app: express.Application;
  let controller: QuizController;
  let mockEnv: any;
  let mockModels: any;
  let mockQuizService: jest.Mocked<QuizService>;

  const userId = '123';
  const adminId = 'admin-123';
  const userToken = (id: string, role: string = 'user') =>
    jwt.sign({ sub: id, role }, mockEnv.JWT_SECRET);

  const validQuestion = {
    questionText: 'What is CSS flexbox?',
    questionTextUk: 'Що таке CSS flexbox?',
    codeSnippet: '.container { display: flex; }',
    answers: ['A layout mode', 'A color model', 'A font style', 'A border type'],
    answersUk: ['Режим макета', 'Колірна модель', 'Стиль шрифту', 'Тип межі'],
    correctAnswerIndex: 0,
    explanation: 'Flexbox is a one-dimensional layout method',
    explanationUk: 'Flexbox це одновимірний метод макетування',
    category: 'css' as const,
    difficulty: 'easy' as const
  };

  beforeEach(() => {
    mockEnv = {
      JWT_SECRET: 'test-secret',
      NODE_ENV: 'test'
    };

    mockModels = {};

    app = express();
    app.use(express.json());
    app.set('envConfig', mockEnv);

    controller = new QuizController(mockEnv, mockModels);

    mockQuizService = (QuizService as jest.MockedClass<typeof QuizService>).mock
      .instances[0] as jest.Mocked<QuizService>;

    const router = Router();
    controller.register(router);
    app.use('/quiz', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /quiz/questions', () => {
    it('should return all questions for admin', async () => {
      const mockQuestions = [
        { ...validQuestion, id: '1' },
        { ...validQuestion, id: '2' }
      ];

      mockQuizService.listQuestions = jest.fn().mockResolvedValue(mockQuestions);

      const response = await supertest(app)
        .get('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`);

      expect(response.status).toBe(200);
      expect(response.body.questions).toEqual(mockQuestions);
      expect(mockQuizService.listQuestions).toHaveBeenCalledWith('en');
    });

    it('should respect Accept-Language header for Ukrainian', async () => {
      mockQuizService.listQuestions = jest.fn().mockResolvedValue([]);

      await supertest(app)
        .get('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .set('Accept-Language', 'uk-UA');

      expect(mockQuizService.listQuestions).toHaveBeenCalledWith('uk');
    });

    it('should reject non-admin users', async () => {
      const response = await supertest(app)
        .get('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(userId, 'user')}`);

      expect(response.status).toBe(403);
      expect(mockQuizService.listQuestions).not.toHaveBeenCalled();
    });

    it('should reject unauthenticated requests', async () => {
      const response = await supertest(app).get('/quiz/questions');

      expect(response.status).toBe(401);
      expect(mockQuizService.listQuestions).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockQuizService.listQuestions = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .get('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch questions');
    });
  });

  describe('POST /quiz/questions', () => {
    it('should create question successfully as admin', async () => {
      const createdQuestion = { ...validQuestion, id: 'new-id' };
      mockQuizService.createQuestion = jest.fn().mockResolvedValue(createdQuestion);

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(validQuestion);

      expect(response.status).toBe(201);
      expect(response.body.question).toEqual(createdQuestion);
      expect(mockQuizService.createQuestion).toHaveBeenCalledWith(validQuestion, 'en');
    });

    it('should reject if correctAnswerIndex out of range', async () => {
      const invalidQuestion = {
        ...validQuestion,
        correctAnswerIndex: 10
      };

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(invalidQuestion);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('correctAnswerIndex out of range');
      expect(mockQuizService.createQuestion).not.toHaveBeenCalled();
    });

    it('should reject question text shorter than 10 characters', async () => {
      const invalidQuestion = {
        ...validQuestion,
        questionText: 'Short'
      };

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(invalidQuestion);

      expect(response.status).toBe(400);
      expect(mockQuizService.createQuestion).not.toHaveBeenCalled();
    });

    it('should reject question text longer than 1000 characters', async () => {
      const invalidQuestion = {
        ...validQuestion,
        questionText: 'a'.repeat(1001)
      };

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(invalidQuestion);

      expect(response.status).toBe(400);
      expect(mockQuizService.createQuestion).not.toHaveBeenCalled();
    });

    it('should reject less than 2 answers', async () => {
      const invalidQuestion = {
        ...validQuestion,
        answers: ['Only one answer'],
        answersUk: ['Лише одна відповідь']
      };

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(invalidQuestion);

      expect(response.status).toBe(400);
      expect(mockQuizService.createQuestion).not.toHaveBeenCalled();
    });

    it('should reject more than 6 answers', async () => {
      const invalidQuestion = {
        ...validQuestion,
        answers: ['1', '2', '3', '4', '5', '6', '7'],
        answersUk: ['1', '2', '3', '4', '5', '6', '7']
      };

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(invalidQuestion);

      expect(response.status).toBe(400);
      expect(mockQuizService.createQuestion).not.toHaveBeenCalled();
    });

    it('should reject invalid category', async () => {
      const invalidQuestion = {
        ...validQuestion,
        category: 'invalid-category'
      };

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(invalidQuestion);

      expect(response.status).toBe(400);
      expect(mockQuizService.createQuestion).not.toHaveBeenCalled();
    });

    it('should reject invalid difficulty', async () => {
      const invalidQuestion = {
        ...validQuestion,
        difficulty: 'impossible'
      };

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(invalidQuestion);

      expect(response.status).toBe(400);
      expect(mockQuizService.createQuestion).not.toHaveBeenCalled();
    });

    it('should accept null optional fields', async () => {
      const questionWithNulls = {
        ...validQuestion,
        codeSnippet: null,
        questionTextUk: null,
        answersUk: null,
        explanation: null,
        explanationUk: null
      };

      mockQuizService.createQuestion = jest.fn().mockResolvedValue(questionWithNulls);

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(questionWithNulls);

      expect(response.status).toBe(201);
    });

    it('should reject non-admin users', async () => {
      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(userId, 'user')}`)
        .send(validQuestion);

      expect(response.status).toBe(403);
      expect(mockQuizService.createQuestion).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockQuizService.createQuestion = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(validQuestion);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to create question');
    });
  });

  describe('PUT /quiz/questions/:id', () => {
    const questionId = 'question-123';

    it('should update question successfully', async () => {
      const updates = { questionText: 'Updated question text' };
      const updatedQuestion = { ...validQuestion, ...updates, id: questionId };

      mockQuizService.updateQuestion = jest.fn().mockResolvedValue(updatedQuestion);

      const response = await supertest(app)
        .put(`/quiz/questions/${questionId}`)
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.question).toEqual(updatedQuestion);
      expect(mockQuizService.updateQuestion).toHaveBeenCalledWith(questionId, updates, 'en');
    });

    it('should accept partial updates', async () => {
      const updates = { difficulty: 'hard' as const };
      mockQuizService.updateQuestion = jest.fn().mockResolvedValue({
        ...validQuestion,
        difficulty: 'hard'
      });

      const response = await supertest(app)
        .put(`/quiz/questions/${questionId}`)
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(updates);

      expect(response.status).toBe(200);
    });

    it('should reject non-admin users', async () => {
      const response = await supertest(app)
        .put(`/quiz/questions/${questionId}`)
        .set('Authorization', `Bearer ${userToken(userId, 'user')}`)
        .send({ questionText: 'Updated text' });

      expect(response.status).toBe(403);
      expect(mockQuizService.updateQuestion).not.toHaveBeenCalled();
    });

    it('should handle question not found', async () => {
      mockQuizService.updateQuestion = jest.fn().mockRejectedValue({
        status: 404,
        message: 'Question not found'
      });

      const response = await supertest(app)
        .put(`/quiz/questions/${questionId}`)
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send({ questionText: 'Updated text' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Question not found');
    });
  });

  describe('DELETE /quiz/questions/:id', () => {
    const questionId = 'question-123';

    it('should delete question successfully', async () => {
      mockQuizService.deleteQuestion = jest.fn().mockResolvedValue(undefined);

      const response = await supertest(app)
        .delete(`/quiz/questions/${questionId}`)
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Question deleted successfully');
      expect(mockQuizService.deleteQuestion).toHaveBeenCalledWith(questionId);
    });

    it('should reject non-admin users', async () => {
      const response = await supertest(app)
        .delete(`/quiz/questions/${questionId}`)
        .set('Authorization', `Bearer ${userToken(userId, 'user')}`);

      expect(response.status).toBe(403);
      expect(mockQuizService.deleteQuestion).not.toHaveBeenCalled();
    });

    it('should handle question not found', async () => {
      mockQuizService.deleteQuestion = jest.fn().mockRejectedValue({
        status: 404,
        message: 'Question not found'
      });

      const response = await supertest(app)
        .delete(`/quiz/questions/${questionId}`)
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Question not found');
    });
  });

  describe('GET /quiz/settings', () => {
    it('should return settings for admin', async () => {
      const mockSettings = {
        questionsPerTest: 10,
        timePerQuestion: 60
      };

      mockQuizService.getSettings = jest.fn().mockResolvedValue(mockSettings);

      const response = await supertest(app)
        .get('/quiz/settings')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`);

      expect(response.status).toBe(200);
      expect(response.body.settings).toEqual(mockSettings);
    });

    it('should reject non-admin users', async () => {
      const response = await supertest(app)
        .get('/quiz/settings')
        .set('Authorization', `Bearer ${userToken(userId, 'user')}`);

      expect(response.status).toBe(403);
      expect(mockQuizService.getSettings).not.toHaveBeenCalled();
    });
  });

  describe('PUT /quiz/settings', () => {
    it('should update settings successfully', async () => {
      const newSettings = {
        questionsPerTest: 20,
        timePerQuestion: 90
      };

      mockQuizService.updateSettings = jest.fn().mockResolvedValue(newSettings);

      const response = await supertest(app)
        .put('/quiz/settings')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(newSettings);

      expect(response.status).toBe(200);
      expect(response.body.settings).toEqual(newSettings);
      expect(mockQuizService.updateSettings).toHaveBeenCalledWith(newSettings);
    });

    it('should reject questionsPerTest less than 5', async () => {
      const response = await supertest(app)
        .put('/quiz/settings')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send({ questionsPerTest: 3, timePerQuestion: 60 });

      expect(response.status).toBe(400);
      expect(mockQuizService.updateSettings).not.toHaveBeenCalled();
    });

    it('should reject questionsPerTest more than 100', async () => {
      const response = await supertest(app)
        .put('/quiz/settings')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send({ questionsPerTest: 101, timePerQuestion: 60 });

      expect(response.status).toBe(400);
    });

    it('should reject timePerQuestion less than 10', async () => {
      const response = await supertest(app)
        .put('/quiz/settings')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send({ questionsPerTest: 10, timePerQuestion: 5 });

      expect(response.status).toBe(400);
    });

    it('should reject timePerQuestion more than 300', async () => {
      const response = await supertest(app)
        .put('/quiz/settings')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send({ questionsPerTest: 10, timePerQuestion: 301 });

      expect(response.status).toBe(400);
    });

    it('should reject non-admin users', async () => {
      const response = await supertest(app)
        .put('/quiz/settings')
        .set('Authorization', `Bearer ${userToken(userId, 'user')}`)
        .send({ questionsPerTest: 15, timePerQuestion: 60 });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /quiz/check-limit', () => {
    it('should check limit for authenticated user', async () => {
      const mockLimitInfo = {
        canAttempt: true,
        remainingAttempts: 5
      };

      mockQuizService.checkLimit = jest.fn().mockResolvedValue(mockLimitInfo);

      const response = await supertest(app)
        .get('/quiz/check-limit')
        .set('Authorization', `Bearer ${userToken(userId)}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLimitInfo);
      expect(mockQuizService.checkLimit).toHaveBeenCalledWith(userId, expect.any(String));
    });

    it('should check limit for anonymous user', async () => {
      const mockLimitInfo = {
        canAttempt: true,
        remainingAttempts: 3
      };

      mockQuizService.checkLimit = jest.fn().mockResolvedValue(mockLimitInfo);

      const response = await supertest(app).get('/quiz/check-limit');

      expect(response.status).toBe(200);
      expect(mockQuizService.checkLimit).toHaveBeenCalledWith(null, expect.any(String));
    });

    it('should handle no more attempts left', async () => {
      mockQuizService.checkLimit = jest.fn().mockResolvedValue({
        canAttempt: false,
        remainingAttempts: 0
      });

      const response = await supertest(app).get('/quiz/check-limit');

      expect(response.status).toBe(200);
      expect(response.body.canAttempt).toBe(false);
    });
  });

  describe('GET /quiz/test', () => {
    it('should generate test for authenticated user', async () => {
      const mockTest = {
        questions: [{ ...validQuestion, id: '1' }],
        settings: { questionsPerTest: 10, timePerQuestion: 60 }
      };

      mockQuizService.generateTest = jest.fn().mockResolvedValue(mockTest);

      const response = await supertest(app)
        .get('/quiz/test?category=css')
        .set('Authorization', `Bearer ${userToken(userId)}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTest);
      expect(mockQuizService.generateTest).toHaveBeenCalledWith('css', 'en', userId, expect.any(String));
    });

    it('should generate test for anonymous user', async () => {
      const mockTest = {
        questions: [],
        settings: { questionsPerTest: 10, timePerQuestion: 60 }
      };

      mockQuizService.generateTest = jest.fn().mockResolvedValue(mockTest);

      const response = await supertest(app).get('/quiz/test');

      expect(response.status).toBe(200);
      expect(mockQuizService.generateTest).toHaveBeenCalledWith('mix', 'en', null, expect.any(String));
    });

    it('should default to "mix" category if not specified', async () => {
      mockQuizService.generateTest = jest.fn().mockResolvedValue({ questions: [] });

      await supertest(app).get('/quiz/test');

      expect(mockQuizService.generateTest).toHaveBeenCalledWith('mix', expect.any(String), null, expect.any(String));
    });

    it('should handle limit exceeded error', async () => {
      mockQuizService.generateTest = jest.fn().mockRejectedValue({
        status: 429,
        message: 'Daily limit exceeded'
      });

      const response = await supertest(app).get('/quiz/test');

      expect(response.status).toBe(429);
      expect(response.body.message).toBe('Daily limit exceeded');
    });
  });

  describe('POST /quiz/submit', () => {
    const validSubmission = {
      category: 'css' as const,
      answers: [
        { questionId: '1', answerIndex: 0 },
        { questionId: '2', answerIndex: 1 }
      ],
      timeTaken: 120,
      username: 'TestUser'
    };

    it('should submit test for authenticated user', async () => {
      const mockResult = {
        score: 50,
        correctAnswers: 1,
        totalQuestions: 2
      };

      mockQuizService.submitTest = jest.fn().mockResolvedValue(mockResult);

      const response = await supertest(app)
        .post('/quiz/submit')
        .set('Authorization', `Bearer ${userToken(userId)}`)
        .send(validSubmission);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(mockQuizService.submitTest).toHaveBeenCalledWith({
        ...validSubmission,
        userId,
        lang: 'en',
        ipAddress: expect.any(String)
      });
    });

    it('should submit test for anonymous user', async () => {
      const mockResult = {
        score: 100,
        correctAnswers: 2,
        totalQuestions: 2
      };

      mockQuizService.submitTest = jest.fn().mockResolvedValue(mockResult);

      const response = await supertest(app).post('/quiz/submit').send(validSubmission);

      expect(response.status).toBe(200);
      expect(mockQuizService.submitTest).toHaveBeenCalledWith({
        ...validSubmission,
        userId: null,
        lang: 'en',
        ipAddress: expect.any(String)
      });
    });

    it('should reject invalid category', async () => {
      const invalidSubmission = {
        ...validSubmission,
        category: 'invalid'
      };

      const response = await supertest(app).post('/quiz/submit').send(invalidSubmission);

      expect(response.status).toBe(400);
      expect(mockQuizService.submitTest).not.toHaveBeenCalled();
    });

    it('should reject empty answers array', async () => {
      const invalidSubmission = {
        ...validSubmission,
        answers: []
      };

      const response = await supertest(app).post('/quiz/submit').send(invalidSubmission);

      expect(response.status).toBe(400);
    });

    it('should reject invalid UUID in answers', async () => {
      const invalidSubmission = {
        ...validSubmission,
        answers: [{ questionId: 'not-a-uuid', answerIndex: 0 }]
      };

      const response = await supertest(app).post('/quiz/submit').send(invalidSubmission);

      expect(response.status).toBe(400);
    });

    it('should reject negative answerIndex', async () => {
      const invalidSubmission = {
        ...validSubmission,
        answers: [{ questionId: validSubmission.answers[0].questionId, answerIndex: -1 }]
      };

      const response = await supertest(app).post('/quiz/submit').send(invalidSubmission);

      expect(response.status).toBe(400);
    });

    it('should reject negative timeTaken', async () => {
      const invalidSubmission = {
        ...validSubmission,
        timeTaken: -10
      };

      const response = await supertest(app).post('/quiz/submit').send(invalidSubmission);

      expect(response.status).toBe(400);
    });

    it('should accept submission without username', async () => {
      const submissionWithoutUsername = {
        category: 'css' as const,
        answers: validSubmission.answers,
        timeTaken: 120
      };

      mockQuizService.submitTest = jest.fn().mockResolvedValue({ score: 100 });

      const response = await supertest(app).post('/quiz/submit').send(submissionWithoutUsername);

      expect(response.status).toBe(200);
    });

    it('should reject username longer than 50 characters', async () => {
      const invalidSubmission = {
        ...validSubmission,
        username: 'a'.repeat(51)
      };

      const response = await supertest(app).post('/quiz/submit').send(invalidSubmission);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /quiz/my-results', () => {
    it('should return user results', async () => {
      const date1 = new Date();
      const date2 = new Date();
      const mockResults = [
        { id: '1', score: 90, category: 'css', createdAt: date1 },
        { id: '2', score: 85, category: 'scss', createdAt: date2 }
      ];

      mockQuizService.myResults = jest.fn().mockResolvedValue(mockResults);

      const response = await supertest(app)
        .get('/quiz/my-results')
        .set('Authorization', `Bearer ${userToken(userId)}`);

      expect(response.status).toBe(200);
      expect(response.body.results).toEqual([
        { id: '1', score: 90, category: 'css', createdAt: date1.toISOString() },
        { id: '2', score: 85, category: 'scss', createdAt: date2.toISOString() }
      ]);
      expect(mockQuizService.myResults).toHaveBeenCalledWith(userId);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await supertest(app).get('/quiz/my-results');

      expect(response.status).toBe(401);
      expect(mockQuizService.myResults).not.toHaveBeenCalled();
    });

    it('should return empty array if no results', async () => {
      mockQuizService.myResults = jest.fn().mockResolvedValue([]);

      const response = await supertest(app)
        .get('/quiz/my-results')
        .set('Authorization', `Bearer ${userToken(userId)}`);

      expect(response.status).toBe(200);
      expect(response.body.results).toEqual([]);
    });
  });

  describe('GET /quiz/leaderboard', () => {
    it('should return leaderboard without authentication', async () => {
      const mockLeaderboard = [
        { userId: '1', username: 'User1', score: 95 },
        { userId: '2', username: 'User2', score: 90 }
      ];

      mockQuizService.leaderboard = jest.fn().mockResolvedValue(mockLeaderboard);

      const response = await supertest(app).get('/quiz/leaderboard');

      expect(response.status).toBe(200);
      expect(response.body.leaderboard).toEqual(mockLeaderboard);
      expect(mockQuizService.leaderboard).toHaveBeenCalledWith('all', 10);
    });

    it('should support category filter', async () => {
      mockQuizService.leaderboard = jest.fn().mockResolvedValue([]);

      await supertest(app).get('/quiz/leaderboard?category=css');

      expect(mockQuizService.leaderboard).toHaveBeenCalledWith('css', 10);
    });

    it('should support limit parameter', async () => {
      mockQuizService.leaderboard = jest.fn().mockResolvedValue([]);

      await supertest(app).get('/quiz/leaderboard?limit=20');

      expect(mockQuizService.leaderboard).toHaveBeenCalledWith('all', 20);
    });

    it('should handle invalid limit parameter', async () => {
      mockQuizService.leaderboard = jest.fn().mockResolvedValue([]);

      await supertest(app).get('/quiz/leaderboard?limit=invalid');

      expect(mockQuizService.leaderboard).toHaveBeenCalledWith('all', 10);
    });
  });

  describe('Security and Edge Cases', () => {
    it('should handle SQL injection in question text', async () => {
      const maliciousQuestion = {
        ...validQuestion,
        questionText: "'; DROP TABLE questions; --"
      };

      mockQuizService.createQuestion = jest.fn().mockResolvedValue(maliciousQuestion);

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(maliciousQuestion);

      expect(response.status).toBe(201);
    });

    it('should handle XSS in username', async () => {
      const xssSubmission = {
        ...validQuestion,
        username: '<script>alert("XSS")</script>'
      };

      mockQuizService.submitTest = jest.fn().mockResolvedValue({ score: 100 });

      const response = await supertest(app)
        .post('/quiz/submit')
        .send({
          category: 'css',
          answers: [{ questionId: '550e8400-e29b-41d4-a716-446655440000', answerIndex: 0 }],
          timeTaken: 60,
          username: '<script>alert("XSS")</script>'
        });

      expect(response.status).toBe(200);
    });

    it('should extract client IP from X-Forwarded-For header', async () => {
      mockQuizService.checkLimit = jest.fn().mockResolvedValue({ canAttempt: true });

      await supertest(app)
        .get('/quiz/check-limit')
        .set('X-Forwarded-For', '192.168.1.1, 10.0.0.1');

      expect(mockQuizService.checkLimit).toHaveBeenCalledWith(null, '192.168.1.1');
    });

    it('should handle concurrent test submissions', async () => {
      mockQuizService.submitTest = jest.fn().mockResolvedValue({ score: 100 });

      const requests = Array(5)
        .fill(null)
        .map(() =>
          supertest(app)
            .post('/quiz/submit')
            .set('Authorization', `Bearer ${userToken(userId)}`)
            .send({
              category: 'css',
              answers: [{ questionId: '550e8400-e29b-41d4-a716-446655440000', answerIndex: 0 }],
              timeTaken: 60
            })
        );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle very large timeTaken values', async () => {
      mockQuizService.submitTest = jest.fn().mockResolvedValue({ score: 0 });

      const response = await supertest(app)
        .post('/quiz/submit')
        .send({
          category: 'css',
          answers: [{ questionId: '550e8400-e29b-41d4-a716-446655440000', answerIndex: 0 }],
          timeTaken: Number.MAX_SAFE_INTEGER
        });

      expect(response.status).toBe(200);
    });

    it('should handle Unicode in question text', async () => {
      const unicodeQuestion = {
        ...validQuestion,
        questionText: '什么是CSS弹性盒子？ 🚀',
        questionTextUk: 'Що таке CSS флексбокс? 💡'
      };

      mockQuizService.createQuestion = jest.fn().mockResolvedValue(unicodeQuestion);

      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(adminId, 'admin')}`)
        .send(unicodeQuestion);

      expect(response.status).toBe(201);
    });

    it('should prevent privilege escalation', async () => {
      const response = await supertest(app)
        .post('/quiz/questions')
        .set('Authorization', `Bearer ${userToken(userId, 'user')}`)
        .send(validQuestion);

      expect(response.status).toBe(403);
      expect(mockQuizService.createQuestion).not.toHaveBeenCalled();
    });
  });
});
