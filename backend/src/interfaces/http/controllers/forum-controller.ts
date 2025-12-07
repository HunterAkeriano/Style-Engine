import { Router } from "express";
import { z } from "zod";
import type { Env } from "../../../config/env";
import type { HttpController } from "../api-router";
import type { Models } from "../../../models";
import {
  createAuthMiddleware,
  requireAdmin,
  requireModerator,
  type AuthRequest,
} from "../../../middleware/auth";
import { ForumRepository } from "../../../infrastructure/repositories/forum-repository";
import {
  ForumService,
  type ForumAttachment,
} from "../../../application/services/forum-service";
import { sendApiError } from "../../../utils/apiError";
import { uploadForumAttachment } from "../../../middleware/upload";
import { broadcastForumEvent, sendUserNotification } from "../../ws/forum-ws";

const topicSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  attachments: z
    .array(
      z.object({ type: z.enum(["image", "youtube"]), url: z.string().url() }),
    )
    .max(10)
    .optional(),
});

const nullableParentId = z.preprocess(
  (value) => (value === null || value === "" ? undefined : value),
  z.string().uuid().optional(),
);

const messageSchema = z.object({
  content: z.string().min(1).max(4000),
  parentId: nullableParentId,
  attachments: z
    .array(
      z.object({ type: z.enum(["image", "youtube"]), url: z.string().url() }),
    )
    .max(5)
    .optional(),
});

const statusSchema = z.object({
  status: z.enum(["open", "in_review", "closed"]),
});

export class ForumController implements HttpController {
  readonly basePath = "/forum";

  private readonly auth = createAuthMiddleware(this.env);
  private readonly service: ForumService;

  constructor(
    private readonly env: Env,
    models: Models,
  ) {
    this.service = new ForumService(new ForumRepository(models), env.API_URL);
  }

  register(router: Router) {
    router.get("/topics/pinned", async (req, res) => {
      const limit = Math.min(
        20,
        Math.max(1, parseInt((req.query.limit as string) || "5") || 5),
      );
      try {
        const topics = await this.service.listPinnedTopics(limit);
        res.json({ topics });
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to load pinned topics");
      }
    });

    router.get("/topics", async (req, res) => {
      const page = Math.max(
        1,
        parseInt((req.query.page as string) || "1") || 1,
      );
      const limit = Math.min(
        100,
        Math.max(1, parseInt((req.query.limit as string) || "20") || 20),
      );
      const status = (req.query.status as string) || undefined;
      const allowedStatuses = ["open", "in_review", "closed"];
      const normalizedStatus = allowedStatuses.includes(String(status))
        ? (status as any)
        : undefined;

      try {
        const payload = await this.service.listTopics({
          page,
          limit,
          status: normalizedStatus,
        });
        res.json(payload);
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to load topics");
      }
    });

    router.post("/topics", this.auth, async (req: AuthRequest, res) => {
      const parsed = topicSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendApiError(res, 400, "Invalid input", {
          details: parsed.error.issues,
        });
      }
      try {
        const topic = await this.service.createTopic(req.userId!, {
          ...parsed.data,
          attachments: this.sanitizeAttachments(parsed.data.attachments ?? []),
        });
        res.status(201).json({ topic });
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to create topic");
      }
    });

    router.get("/topics/:id", async (req, res) => {
      try {
        const payload = await this.service.getTopic(req.params.id);
        res.json(payload);
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to load topic");
      }
    });

    router.patch("/topics/:id", this.auth, async (req: AuthRequest, res) => {
      const parsed = topicSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return sendApiError(res, 400, "Invalid input", {
          details: parsed.error.issues,
        });
      }
      try {
        const patch = {
          ...parsed.data,
          attachments: parsed.data.attachments
            ? this.sanitizeAttachments(parsed.data.attachments)
            : undefined,
        };
        const topic = await this.service.updateTopicContent(
          req.params.id,
          req.userId!,
          patch,
          Boolean(req.authUser?.isAdmin),
        );
        broadcastForumEvent(req.params.id, "topic-updated", topic);
        res.json({ topic });
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to update topic");
      }
    });

    router.patch(
      "/topics/:id/status",
      this.auth,
      requireAdmin,
      async (req: AuthRequest, res) => {
        const parsed = statusSchema.safeParse(req.body);
        if (!parsed.success) {
          return sendApiError(res, 400, "Invalid status", {
            details: parsed.error.issues,
          });
        }
        try {
          const topic = await this.service.updateStatus(
            req.params.id,
            parsed.data.status,
            Boolean(req.authUser?.isAdmin),
          );
          broadcastForumEvent(req.params.id, "status", topic);
          res.json({ topic });
        } catch (err: any) {
          if (err?.status)
            return sendApiError(res, err.status, err.message, {
              details: err.details,
            });
          return sendApiError(res, 500, "Failed to update status");
        }
      },
    );

    router.post(
      "/topics/:id/pin",
      this.auth,
      requireAdmin,
      async (req: AuthRequest, res) => {
        try {
          if (!req.userId) return sendApiError(res, 401, "Unauthorized");
          const topic = await this.service.pinTopic(
            req.params.id,
            req.userId!,
          );
          broadcastForumEvent(req.params.id, "topic-updated", topic);
          res.json({ topic });
        } catch (err: any) {
          if (err?.status)
            return sendApiError(res, err.status, err.message, {
              details: err.details,
            });
          return sendApiError(res, 500, "Failed to pin topic");
        }
      },
    );

    router.delete(
      "/topics/:id/pin",
      this.auth,
      requireAdmin,
      async (req: AuthRequest, res) => {
        try {
          if (!req.userId) return sendApiError(res, 401, "Unauthorized");
          const topic = await this.service.unpinTopic(req.params.id);
          broadcastForumEvent(req.params.id, "topic-updated", topic);
          res.json({ topic });
        } catch (err: any) {
          if (err?.status)
            return sendApiError(res, err.status, err.message, {
              details: err.details,
            });
          return sendApiError(res, 500, "Failed to unpin topic");
        }
      },
    );

    router.post(
      "/topics/:id/messages",
      this.auth,
      async (req: AuthRequest, res) => {
        const parsed = messageSchema.safeParse(req.body);
        if (!parsed.success) {
          return sendApiError(res, 400, "Invalid input", {
            details: parsed.error.issues,
          });
        }
        if (!req.userId) return sendApiError(res, 401, "Unauthorized");

        const attachments = this.filterAttachments(
          parsed.data.attachments ?? [],
        );

        try {
          const payload = await this.service.addMessage({
            topicId: req.params.id,
            userId: req.userId,
            content: parsed.data.content,
            parentId: parsed.data.parentId ?? null,
            attachments,
            isAdmin: Boolean(req.authUser?.isAdmin),
          });
          broadcastForumEvent(req.params.id, "message", payload.message);

          if (
            payload.topic.owner?.id &&
            payload.topic.owner.id !== req.userId
          ) {
            const topicStatus = payload.topic.status;
            if (topicStatus === "open" || topicStatus === "in_review") {
              sendUserNotification(payload.topic.owner.id, {
                topicId: payload.topic.id,
                topicTitle: payload.topic.title,
                message: payload.message.content,
                author: { name: payload.message.author?.name || null },
              });
            }
          }

          res.status(201).json(payload);
        } catch (err: any) {
          if (err?.status)
            return sendApiError(res, err.status, err.message, {
              details: err.details,
            });
          return sendApiError(res, 500, "Failed to add message");
        }
      },
    );

    router.patch(
      "/topics/:id/messages/:messageId",
      this.auth,
      async (req: AuthRequest, res) => {
        const parsed = messageSchema
          .pick({ content: true })
          .safeParse(req.body);
        if (!parsed.success) {
          return sendApiError(res, 400, "Invalid input", {
            details: parsed.error.issues,
          });
        }
        try {
          const message = await this.service.editMessage({
            topicId: req.params.id,
            messageId: req.params.messageId,
            userId: req.userId!,
            content: parsed.data.content,
            isAdmin: Boolean(req.authUser?.isAdmin),
          });
          broadcastForumEvent(req.params.id, "message-edit", message);
          res.json({ message });
        } catch (err: any) {
          if (err?.status)
            return sendApiError(res, err.status, err.message, {
              details: err.details,
            });
          return sendApiError(res, 500, "Failed to update message");
        }
      },
    );

    router.post(
      "/attachments",
      this.auth,
      uploadForumAttachment.single("file"),
      async (req: AuthRequest, res) => {
        if (!req.file) {
          return sendApiError(res, 400, "No file uploaded");
        }
        const topicId = (req.query.topicId as string) || "temp";
        const url = `${this.env.API_URL}/uploads/forum/${topicId}/${req.file.filename}`;
        res.status(201).json({ url });
      },
    );

    router.get("/my-topics/open", this.auth, async (req: AuthRequest, res) => {
      try {
        const topics = await this.service.getUserOpenTopics(req.userId!);
        res.json({ topics });
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to load user topics");
      }
    });

    router.get(
      "/topics/:id/participants",
      async (req, res) => {
        try {
          const participants =
            await this.service.getTopicParticipants(req.params.id);
          res.json({ participants });
        } catch (err: any) {
          if (err?.status)
            return sendApiError(res, err.status, err.message, {
              details: err.details,
            });
          return sendApiError(res, 500, "Failed to load participants");
        }
      },
    );

    router.post(
      "/mute/:userId",
      this.auth,
      requireModerator,
      async (req: AuthRequest, res) => {
        const muteSchema = z.object({
          durationMinutes: z.number().nullable(),
          reason: z.string().optional(),
        });

        const parsed = muteSchema.safeParse(req.body);
        if (!parsed.success) {
          return sendApiError(res, 400, "Invalid input", {
            details: parsed.error.issues,
          });
        }

        const expiresAt = parsed.data.durationMinutes
          ? new Date(Date.now() + parsed.data.durationMinutes * 60 * 1000)
          : null;

        try {
          await this.service.muteUser({
            userId: req.params.userId,
            mutedBy: req.userId!,
            expiresAt,
            reason: parsed.data.reason,
            isModerator: Boolean(
              req.authUser?.isAdmin || req.authUser?.isSuperAdmin,
            ),
          });
          res.json({ success: true });
        } catch (err: any) {
          if (err?.status)
            return sendApiError(res, err.status, err.message, {
              details: err.details,
            });
          return sendApiError(res, 500, "Failed to mute user");
        }
      },
    );

    router.delete(
      "/topics/:id/messages/:userId",
      this.auth,
      requireModerator,
      async (req: AuthRequest, res) => {
        try {
          const result = await this.service.removeUserMessages({
            topicId: req.params.id,
            userId: req.params.userId,
            actorId: req.userId!,
            isModerator: Boolean(
              req.authUser?.isAdmin || req.authUser?.isSuperAdmin,
            ),
          });
          res.json(result);
        } catch (err: any) {
          if (err?.status)
            return sendApiError(res, err.status, err.message, {
              details: err.details,
            });
          return sendApiError(res, 500, "Failed to delete messages");
        }
      },
    );

    router.get(
      "/my-mutes",
      this.auth,
      async (req: AuthRequest, res) => {
        try {
          const mutes = await this.service.getUserActiveMutes(req.userId!);
          res.json({ mutes });
        } catch (err: any) {
          if (err?.status)
            return sendApiError(res, err.status, err.message, {
              details: err.details,
            });
          return sendApiError(res, 500, "Failed to load mutes");
        }
      },
    );

    router.get(
      "/mute-status",
      this.auth,
      async (req: AuthRequest, res) => {
        try {
          const status = await this.service.checkUserMute(req.userId!);
          res.json(status);
        } catch (err: any) {
          if (err?.status)
            return sendApiError(res, err.status, err.message, {
              details: err.details,
            });
          return sendApiError(res, 500, "Failed to check mute status");
        }
      },
    );
  }

  private filterAttachments(attachments: ForumAttachment[]): ForumAttachment[] {
    return this.sanitizeAttachments(attachments);
  }

  private sanitizeAttachments(attachments: ForumAttachment[]): ForumAttachment[] {
    const result: ForumAttachment[] = [];
    for (const item of attachments) {
      if (item.type === "youtube") {
        const id = this.extractYoutubeId(item.url);
        if (id) {
          result.push({
            type: "youtube",
            url: `https://www.youtube.com/embed/${id}`,
          });
        }
      } else {
        result.push(item);
      }
    }
    return result;
  }

  private extractYoutubeId(url: string) {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/i);
    return match ? match[1] : null;
  }
}
