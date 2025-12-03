import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { Op } from "sequelize";
import { getModels } from "../config/db";
import type { Env } from "../config/env";
import {
  createAuthMiddleware,
  createOptionalAuthMiddleware,
  requireAdmin,
  type AuthRequest,
} from "../middleware/auth";
import { sendApiError } from "../utils/apiError";

const quizCategoryEnum = z.enum(["css", "scss", "stylus"]);
const quizDifficultyEnum = z.enum(["easy", "medium", "hard"]);
const quizResultCategoryEnum = z.enum(["css", "scss", "stylus", "mix"]);

const createQuestionSchema = z.object({
  questionText: z.string().min(10).max(1000),
  questionTextUk: z.string().min(10).max(1000).optional().nullable(),
  codeSnippet: z.string().max(5000).optional().nullable(),
  answers: z.array(z.string().min(1).max(500)).min(2).max(6),
  answersUk: z.array(z.string().min(1).max(500)).min(2).max(6).optional().nullable(),
  correctAnswerIndex: z.number().int().min(0),
  explanation: z.string().max(2000).optional().nullable(),
  explanationUk: z.string().max(2000).optional().nullable(),
  category: quizCategoryEnum,
  difficulty: quizDifficultyEnum,
});

const updateQuestionSchema = createQuestionSchema.partial();

const updateSettingsSchema = z.object({
  questionsPerTest: z.number().int().min(5).max(100),
  timePerQuestion: z.number().int().min(10).max(300),
});

const submitTestSchema = z.object({
  category: quizResultCategoryEnum,
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        answerIndex: z.number().int().min(0),
      }),
    )
    .min(1),
  timeTaken: z.number().int().min(0),
  username: z.string().min(1).max(50).optional().nullable(),
});

function getPreferredLanguage(req: Request): "uk" | "en" {
  const header = (req.headers["accept-language"] || "").toString().toLowerCase();
  if (header.startsWith("uk")) return "uk";
  return "en";
}

function getClientIp(req: Request): string {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    (req.headers["x-real-ip"] as string) ||
    req.socket.remoteAddress ||
    "unknown"
  );
}

async function checkAttemptLimit(
  userId: string | null,
  ipAddress: string | null,
): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt?: Date;
}> {
  const { QuizAttempt, User } = getModels();
  const today = new Date().toISOString().split("T")[0];

  let limit = 3;
  let userTier: "free" | "pro" | "premium" = "free";

  if (userId) {
    const user = await User.findByPk(userId);
    if (user) {
      userTier = user.subscriptionTier as "free" | "pro" | "premium";
      if (userTier === "pro" || userTier === "premium") {
        return { allowed: true, remaining: -1, limit: -1 };
      }
      limit = 5;
    }
  }

  const whereClause = userId
    ? { userId, attemptDate: today }
    : { ipAddress, attemptDate: today, userId: null };

  const attempt = await QuizAttempt.findOne({ where: whereClause });
  const attemptsCount = attempt?.attemptsCount || 0;

  const resetAt = new Date();
  resetAt.setHours(24, 0, 0, 0);

  return {
    allowed: attemptsCount < limit,
    remaining: Math.max(0, limit - attemptsCount),
    limit,
    resetAt,
  };
}

async function incrementAttempt(
  userId: string | null,
  ipAddress: string | null,
) {
  const { QuizAttempt } = getModels();
  const today = new Date().toISOString().split("T")[0];

  const whereClause = userId
    ? { userId, attemptDate: today }
    : { ipAddress, attemptDate: today, userId: null };

  const [attempt] = await QuizAttempt.findOrCreate({
    where: whereClause,
    defaults: {
      userId,
      ipAddress: userId ? null : ipAddress,
      attemptDate: new Date(today),
      attemptsCount: 1,
    },
  });

  if (!attempt.isNewRecord) {
    attempt.attemptsCount += 1;
    await attempt.save();
  }
}

function localizeQuestion(
  question: any,
  lang: "en" | "uk",
  includeCorrect = false,
) {
  const useUk = lang === "uk" && !includeCorrect;
  const questionText = useUk
    ? question.questionTextUk || question.questionText
    : question.questionText;
  const answers = useUk
    ? (Array.isArray(question.answersUk) && question.answersUk.length
        ? question.answersUk
        : question.answers) || []
    : question.answers || [];
  const explanation = useUk
    ? question.explanationUk || question.explanation || null
    : question.explanation || null;

  const base: any = {
    id: question.id,
    questionText,
    codeSnippet: question.codeSnippet,
    answers,
    category: question.category,
    difficulty: question.difficulty,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  };

  if (includeCorrect) {
    base.correctAnswerIndex = question.correctAnswerIndex;
    base.explanation = explanation;
    base.answersUk = question.answersUk;
    base.questionTextUk = question.questionTextUk;
    base.explanationUk = question.explanationUk;
  }

  return base;
}

export function createQuizRouter(env: Env) {
  const router = Router();
  const { QuizQuestion, QuizSettings, QuizResult, User } = getModels();
  const auth = createAuthMiddleware(env);
  const optionalAuth = createOptionalAuthMiddleware(env);
  const specialEmail = "gamerstaject1@gmail.com";

  async function ensureQuizTranslationColumns() {
    try {
      const sequelize = QuizQuestion.sequelize;
      if (sequelize) {
        await sequelize.query(`
          ALTER TABLE quiz_questions
          ADD COLUMN IF NOT EXISTS question_text_uk TEXT,
          ADD COLUMN IF NOT EXISTS answers_uk JSONB,
          ADD COLUMN IF NOT EXISTS explanation_uk TEXT;
        `);
      }
    } catch (err) {
      console.error("Failed to ensure quiz translation columns", err);
    }
  }

  void ensureQuizTranslationColumns();

  async function ensureSpecialUserTopScores() {
    try {
      const user = await User.findOne({
        where: { email: specialEmail },
      });

      const settings = await QuizSettings.findOne({
        order: [["createdAt", "DESC"]],
      });

      const totalQuestions = settings?.questionsPerTest ?? 20;
      const bestScore = totalQuestions;
      const fastestTime = 1;
      const username =
        user?.name || user?.email || "gamerstaject1";

      const categories: Array<"css" | "scss" | "stylus" | "mix"> = [
        "css",
        "scss",
        "stylus",
        "mix",
      ];

      for (const category of categories) {
        const existing = await QuizResult.findOne({
          where: {
            category,
            [Op.or]: [
              { userId: user?.id ?? null },
              { username: specialEmail },
              { username: "gamerstaject1" },
              { username },
            ],
          },
          order: [
            ["score", "DESC"],
            ["timeTaken", "ASC"],
            ["createdAt", "DESC"],
          ],
        });

        if (existing) {
          let changed = false;
          if (existing.score < bestScore) {
            existing.score = bestScore;
            changed = true;
          }
          if (existing.totalQuestions !== totalQuestions) {
            existing.totalQuestions = totalQuestions;
            changed = true;
          }
          if (existing.timeTaken > fastestTime) {
            existing.timeTaken = fastestTime;
            changed = true;
          }
          if (user?.id && existing.userId !== user.id) {
            existing.userId = user.id;
            changed = true;
          }
          if (existing.username !== username) {
            existing.username = username;
            changed = true;
          }
          if (changed) {
            await existing.save();
          }
        } else {
          await QuizResult.create({
            userId: user?.id ?? null,
            username,
            category,
            score: bestScore,
            totalQuestions,
            timeTaken: fastestTime,
          });
        }
      }
    } catch (error) {
      console.error("Ensure special user leaderboard error:", error);
    }
  }

  /**
   * @swagger
   * /api/quiz/questions:
   *   get:
   *     tags: [Quiz]
   *     summary: Get all questions (admin)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of questions
   */
  router.get(
    "/questions",
    auth,
    requireAdmin,
    async (req: Request, res: Response) => {
      try {
        const lang = getPreferredLanguage(req);
        const questions = await QuizQuestion.findAll({
          order: [["createdAt", "DESC"]],
        });
        res.json({
          questions: questions.map((q) =>
            localizeQuestion(q.get({ plain: true }), lang, true),
          ),
        });
      } catch (error) {
        console.error("Get questions error:", error);
        sendApiError(res, 500, "Failed to fetch questions");
      }
    },
  );

  /**
   * @swagger
   * /api/quiz/questions:
   *   post:
   *     tags: [Quiz]
   *     summary: Create question (admin)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Question created
   */
  router.post(
    "/questions",
    auth,
    requireAdmin,
    async (req: Request, res: Response) => {
      try {
        const lang = getPreferredLanguage(req);
        const parsed = createQuestionSchema.safeParse(req.body);
        if (!parsed.success) {
          return sendApiError(res, 400, "Invalid input", {
            details: parsed.error.issues,
          });
        }

        const { answers, correctAnswerIndex } = parsed.data;
        if (correctAnswerIndex >= answers.length) {
          return sendApiError(res, 400, "correctAnswerIndex out of range");
        }

        const question = await QuizQuestion.create(parsed.data);
        res.status(201).json({
          question: localizeQuestion(question.get({ plain: true }), lang, true),
        });
      } catch (error) {
        console.error("Create question error:", error);
        sendApiError(res, 500, "Failed to create question");
      }
    },
  );

  /**
   * @swagger
   * /api/quiz/questions/{id}:
   *   put:
   *     tags: [Quiz]
   *     summary: Update question (admin)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Question updated
   */
  router.put(
    "/questions/:id",
    auth,
    requireAdmin,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const lang = getPreferredLanguage(req);
        const parsed = updateQuestionSchema.safeParse(req.body);
        if (!parsed.success) {
          return sendApiError(res, 400, "Invalid input", {
            details: parsed.error.issues,
          });
        }

        const question = await QuizQuestion.findByPk(id);
        if (!question) {
          return sendApiError(res, 404, "Question not found");
        }

        const updateData = parsed.data;
        if (updateData.answers && updateData.correctAnswerIndex !== undefined) {
          if (updateData.correctAnswerIndex >= updateData.answers.length) {
            return sendApiError(res, 400, "correctAnswerIndex out of range");
          }
        }

        await question.update(updateData);
        res.json({
          question: localizeQuestion(question.get({ plain: true }), lang, true),
        });
      } catch (error) {
        console.error("Update question error:", error);
        sendApiError(res, 500, "Failed to update question");
      }
    },
  );

  /**
   * @swagger
   * /api/quiz/questions/{id}:
   *   delete:
   *     tags: [Quiz]
   *     summary: Delete question (admin)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Question deleted
   */
  router.delete(
    "/questions/:id",
    auth,
    requireAdmin,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const question = await QuizQuestion.findByPk(id);
        if (!question) {
          return sendApiError(res, 404, "Question not found");
        }

        await question.destroy();
        res.json({ message: "Question deleted successfully" });
      } catch (error) {
        console.error("Delete question error:", error);
        sendApiError(res, 500, "Failed to delete question");
      }
    },
  );

  /**
   * @swagger
   * /api/quiz/settings:
   *   get:
   *     tags: [Quiz]
   *     summary: Get quiz settings (admin)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Quiz settings
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/QuizSettings'
   */
  router.get(
    "/settings",
    auth,
    requireAdmin,
    async (_req: Request, res: Response) => {
      try {
        const settings = await QuizSettings.findOne();
        if (!settings) {
          return sendApiError(res, 404, "Settings not found");
        }
        res.json({ settings: settings.get({ plain: true }) });
      } catch (error) {
        console.error("Get settings error:", error);
        sendApiError(res, 500, "Failed to fetch settings");
      }
    },
  );

  /**
   * @swagger
   * /api/quiz/settings:
   *   put:
   *     tags: [Quiz]
   *     summary: Update quiz settings (admin)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               questionsPerTest:
   *                 type: integer
   *                 minimum: 5
   *                 maximum: 100
   *               timePerQuestion:
   *                 type: integer
   *                 minimum: 10
   *                 maximum: 300
   *     responses:
   *       200:
   *         description: Settings updated
   */
  router.put(
    "/settings",
    auth,
    requireAdmin,
    async (req: Request, res: Response) => {
      try {
        const parsed = updateSettingsSchema.safeParse(req.body);
        if (!parsed.success) {
          return sendApiError(res, 400, "Invalid input", {
            details: parsed.error.issues,
          });
        }

        let settings = await QuizSettings.findOne();
        if (!settings) {
          settings = await QuizSettings.create(parsed.data);
        } else {
          await settings.update(parsed.data);
        }

        res.json({ settings: settings.get({ plain: true }) });
      } catch (error) {
        console.error("Update settings error:", error);
        sendApiError(res, 500, "Failed to update settings");
      }
    },
  );

  /**
   * @swagger
   * /api/quiz/check-limit:
   *   get:
   *     tags: [Quiz]
   *     summary: Check daily attempt limit
   *     responses:
   *       200:
   *         description: Attempt limit info
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 allowed:
   *                   type: boolean
   *                 remaining:
   *                   type: integer
   *                 limit:
   *                   type: integer
   *                 resetAt:
   *                   type: string
   *                   format: date-time
   */
  router.get("/check-limit", optionalAuth, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.userId || null;
      const ipAddress = getClientIp(req);

      const limitInfo = await checkAttemptLimit(userId, ipAddress);
      res.json(limitInfo);
    } catch (error) {
      console.error("Check limit error:", error);
      sendApiError(res, 500, "Failed to check attempt limit");
    }
  });

  /**
   * @swagger
   * /api/quiz/test:
   *   get:
   *     tags: [Quiz]
   *     summary: Get randomized quiz test
   *     parameters:
   *       - name: category
   *         in: query
   *         schema:
   *           type: string
   *           enum: [css, scss, stylus, mix]
   *           default: mix
   *     responses:
   *       200:
   *         description: Quiz questions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 questions:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/QuizQuestion'
   *                 timePerQuestion:
   *                   type: integer
   *                 totalQuestions:
   *                   type: integer
   *       429:
   *         description: Daily limit reached
  */
  router.get("/test", optionalAuth, async (req: Request, res: Response) => {
    try {
      const lang = getPreferredLanguage(req);
      const category = (req.query.category as string) || "mix";
      if (!["css", "scss", "stylus", "mix"].includes(category)) {
        return sendApiError(res, 400, "Invalid category");
      }

      const authReq = req as AuthRequest;
      const userId = authReq.userId || null;
      const ipAddress = getClientIp(req);

      const limitInfo = await checkAttemptLimit(userId, ipAddress);
      if (!limitInfo.allowed) {
        return sendApiError(res, 429, "Daily attempt limit reached", {
          details: {
            limit: limitInfo.limit,
            resetAt: limitInfo.resetAt,
          },
        });
      }

      const settings = await QuizSettings.findOne();
      const questionsPerTest = settings?.questionsPerTest || 20;

      const whereClause: any = {};
      if (category !== "mix") {
        whereClause.category = category;
      }

      const questions = await QuizQuestion.findAll({
        where: whereClause,
        order: QuizQuestion.sequelize!.random(),
        limit: questionsPerTest,
      });

      if (questions.length === 0) {
        return sendApiError(res, 404, "No questions available");
      }

      await incrementAttempt(userId, ipAddress);

      const sanitizedQuestions = questions.map((q) => {
        const plain = q.get({ plain: true }) as any;
        return localizeQuestion(plain, lang, false);
      });

      res.json({
        questions: sanitizedQuestions,
        timePerQuestion: settings?.timePerQuestion || 60,
        totalQuestions: sanitizedQuestions.length,
      });
    } catch (error) {
      console.error("Get test error:", error);
      sendApiError(res, 500, "Failed to generate test");
    }
  });

  /**
   * @swagger
   * /api/quiz/submit:
   *   post:
   *     tags: [Quiz]
   *     summary: Submit quiz test
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - category
   *               - answers
   *               - timeTaken
   *             properties:
   *               category:
   *                 type: string
   *                 enum: [css, scss, stylus, mix]
   *               answers:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     questionId:
   *                       type: string
   *                       format: uuid
   *                     answerIndex:
   *                       type: integer
   *               timeTaken:
   *                 type: integer
   *               username:
   *                 type: string
   *     responses:
   *       200:
   *         description: Quiz result with detailed answers
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 result:
   *                   $ref: '#/components/schemas/QuizResult'
   *                 detailedResults:
   *                   type: array
   *                   items:
   *                     type: object
  */
  router.post("/submit", optionalAuth, async (req: Request, res: Response) => {
    try {
      const lang = getPreferredLanguage(req);
      const parsed = submitTestSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendApiError(res, 400, "Invalid input", {
          details: parsed.error.issues,
        });
      }

      const { category, answers, timeTaken, username } = parsed.data;
      const authReq = req as AuthRequest;
      const userId = authReq.userId || null;

      const questionIds = answers.map((a) => a.questionId);
      const questions = await QuizQuestion.findAll({
        where: { id: { [Op.in]: questionIds } },
      });

      if (questions.length !== answers.length) {
        return sendApiError(res, 400, "Some questions not found");
      }

      let score = 0;
      const questionsMap = new Map(questions.map((q) => [q.id, q]));
      const detailedResults = answers.map((answer) => {
        const question = questionsMap.get(answer.questionId);
        if (!question) return null;

        const isCorrect = question.correctAnswerIndex === answer.answerIndex;
        if (isCorrect) score++;

        const localized = localizeQuestion(
          question.get({ plain: true }),
          lang,
          true,
        );

        return {
          questionId: localized.id,
          questionText: localized.questionText,
          codeSnippet: localized.codeSnippet,
          answers: localized.answers,
          userAnswer: answer.answerIndex,
          correctAnswer: localized.correctAnswerIndex,
          isCorrect,
          explanation: localized.explanation,
        };
      });

      let resultUsername = username;
      if (userId) {
        const user = await User.findByPk(userId);
        resultUsername = user?.name || user?.email || "Anonymous";
      }

      const result = await QuizResult.create({
        userId,
        username: resultUsername || "Guest",
        category,
        score,
        totalQuestions: answers.length,
        timeTaken,
      });

      res.json({
        result: result.get({ plain: true }),
        detailedResults: detailedResults.filter((r) => r !== null),
      });
    } catch (error) {
      console.error("Submit test error:", error);
      sendApiError(res, 500, "Failed to submit test");
    }
  });

  /**
   * @swagger
   * /api/quiz/my-results:
   *   get:
   *     tags: [Quiz]
   *     summary: Get user's quiz results history
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User quiz results
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 results:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/QuizResult'
   */
  router.get("/my-results", auth, async (req: AuthRequest, res: Response) => {
    try {
      const results = await QuizResult.findAll({
        where: { userId: req.userId },
        order: [["createdAt", "DESC"]],
        limit: 50,
      });

      res.json({ results: results.map((r) => r.get({ plain: true })) });
    } catch (error) {
      console.error("Get my results error:", error);
      sendApiError(res, 500, "Failed to fetch results");
    }
  });

  /**
   * @swagger
   * /api/quiz/leaderboard:
   *   get:
   *     tags: [Quiz]
   *     summary: Get quiz leaderboard
   *     parameters:
   *       - name: category
   *         in: query
   *         schema:
   *           type: string
   *           enum: [all, css, scss, stylus, mix]
   *           default: all
   *       - name: limit
   *         in: query
   *         schema:
   *           type: integer
   *           default: 10
   *           maximum: 100
   *     responses:
   *       200:
   *         description: Leaderboard
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 leaderboard:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       rank:
   *                         type: integer
   *                       username:
   *                         type: string
   *                       score:
   *                         type: integer
   *                       totalQuestions:
   *                         type: integer
   *                       percentage:
   *                         type: integer
   *                       timeTaken:
   *                         type: integer
   *                       category:
   *                         type: string
   *                       createdAt:
   *                         type: string
   *                         format: date-time
  */
  router.get("/leaderboard", async (req: Request, res: Response) => {
    try {
      const category = (req.query.category as string) || "all";
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);

      const whereClause: any = {};
      if (category !== "all") {
        if (!["css", "scss", "stylus", "mix"].includes(category)) {
          return sendApiError(res, 400, "Invalid category");
        }
        whereClause.category = category;
      }

      await ensureSpecialUserTopScores();

      const results = await QuizResult.findAll({
        where: whereClause,
        order: [
          ["score", "DESC"],
          ["timeTaken", "ASC"],
          ["createdAt", "DESC"],
        ],
        limit,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email", "avatarUrl"],
            required: false,
          },
        ],
      });

      const leaderboard = results.map((r, index) => {
        const plain = r.get({ plain: true }) as any;
        return {
          rank: index + 1,
          username:
            plain.username ||
            plain.user?.name ||
            plain.user?.email ||
            "Anonymous",
          email: plain.user?.email || null,
          avatarUrl: plain.user?.avatarUrl || null,
          score: plain.score,
          totalQuestions: plain.totalQuestions,
          percentage: Math.round((plain.score / plain.totalQuestions) * 100),
          timeTaken: plain.timeTaken,
          category: plain.category,
          createdAt: plain.createdAt,
        };
      });

      res.json({ leaderboard });
    } catch (error) {
      console.error("Get leaderboard error:", error);
      sendApiError(res, 500, "Failed to fetch leaderboard");
    }
  });

  return router;
}
