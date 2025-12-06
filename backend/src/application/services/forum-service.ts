import fs from "fs";
import path from "path";
import { promises as fsp } from "fs";
import type { Attributes } from "sequelize";
import {
  ForumRepository,
  type ForumStatus,
} from "../../infrastructure/repositories/forum-repository";
import type { ForumMessage, ForumTopic } from "../../models";
import { toApiError } from "../../utils/apiError";

export interface ForumAttachment {
  type: "image" | "youtube";
  url: string;
}

export interface CreateTopicPayload {
  title: string;
  description: string;
  attachments: ForumAttachment[];
}

export interface CreateMessagePayload {
  topicId: string;
  userId: string;
  content: string;
  parentId?: string | null;
  attachments: ForumAttachment[];
  isAdmin: boolean;
}

export interface EditMessagePayload {
  topicId: string;
  messageId: string;
  userId: string;
  content: string;
  isAdmin: boolean;
}

export class ForumService {
  constructor(
    private readonly repo: ForumRepository,
    private readonly apiUrl: string = "http://localhost:4000",
  ) {}

  private toFullUrl(url: string): string {
    if (url.startsWith("/")) {
      return `${this.apiUrl}${url}`;
    }
    return url;
  }

  private serializeAttachments(
    attachments: ForumAttachment[] | null | undefined,
  ): ForumAttachment[] {
    if (!attachments) return [];
    return attachments.map((att) => ({
      ...att,
      url: this.toFullUrl(att.url),
    }));
  }

  private uploadsRoot() {
    return path.resolve(process.cwd(), "uploads/forum");
  }

  private parsePathFromUrl(url: string) {
    try {
      const parsed = new URL(url);
      return parsed.pathname;
    } catch {
      return url.startsWith("/") ? url : null;
    }
  }

  private async ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
      await fsp.mkdir(dir, { recursive: true });
    }
  }

  private async moveAttachmentsToTopic(
    topicId: string,
    attachments: ForumAttachment[],
  ) {
    const targetDir = path.join(this.uploadsRoot(), topicId);
    await this.ensureDir(targetDir);

    const normalized: ForumAttachment[] = [];

    for (const att of attachments) {
      const pathname = this.parsePathFromUrl(att.url);
      if (!pathname) continue;

      const currentPath = pathname.startsWith("/uploads/forum")
        ? path.join(this.uploadsRoot(), pathname.replace("/uploads/forum/", ""))
        : null;

      if (
        currentPath &&
        currentPath.includes(path.join(this.uploadsRoot(), "temp"))
      ) {
        const filename = path.basename(currentPath);
        const destination = path.join(targetDir, filename);
        try {
          await fsp.rename(currentPath, destination);
        } catch {
          // fallback: copy if rename fails (cross-device)
          await fsp.copyFile(currentPath, destination);
          await fsp.unlink(currentPath);
        }
        normalized.push({
          ...att,
          url: `/uploads/forum/${topicId}/${filename}`,
        });
      } else {
        normalized.push(att);
      }
    }

    return normalized;
  }

  private async deleteRemovedAttachments(
    topicId: string,
    previous: ForumAttachment[],
    next: ForumAttachment[],
  ) {
    const nextUrls = new Set(next.map((a) => a.url));
    const toDelete = previous.filter((att) => !nextUrls.has(att.url));

    for (const att of toDelete) {
      const pathname = this.parsePathFromUrl(att.url);
      if (!pathname) continue;
      const filePath = path.join(
        this.uploadsRoot(),
        pathname.replace("/uploads/forum/", ""),
      );
      if (
        filePath.includes(path.join(this.uploadsRoot(), topicId)) &&
        fs.existsSync(filePath)
      ) {
        try {
          await fsp.unlink(filePath);
        } catch {
          // ignore
        }
      }
    }
  }

  private serializeTopic(topic: ForumTopic) {
    const { user, attachments, ...rest } = topic.get({ plain: true }) as any;
    const owner = user as ForumTopic["user"] | undefined;
    return {
      ...rest,
      attachments: this.serializeAttachments(attachments),
      owner: owner
        ? {
            id: owner.id,
            name: owner.name,
            email: owner.email,
            avatarUrl: owner.avatarUrl,
            isAdmin: Boolean((owner as any).isAdmin),
            subscriptionTier: (owner as any).subscriptionTier ?? "free",
          }
        : null,
    };
  }

  private serializeMessage(message: ForumMessage) {
    const { user, attachments, ...rest } = message.get({ plain: true }) as any;
    const author = user as ForumMessage["user"] | undefined;
    return {
      ...rest,
      attachments: this.serializeAttachments(attachments),
      author: author
        ? {
            id: author.id,
            name: author.name,
            email: author.email,
            avatarUrl: author.avatarUrl,
            isAdmin: Boolean((author as any).isAdmin),
            subscriptionTier: (author as any).subscriptionTier ?? "free",
          }
        : null,
    };
  }

  async listTopics(options: {
    page: number;
    limit: number;
    status?: ForumStatus;
  }) {
    const limit = Math.min(100, Math.max(1, options.limit));
    const page = Math.max(1, options.page);

    const result = await this.repo.listTopics({ ...options, page, limit });
    const topics = result.rows.map((topic) => this.serializeTopic(topic));
    const total = Array.isArray(result.count)
      ? result.count.length
      : result.count;

    return {
      topics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async createTopic(userId: string, payload: CreateTopicPayload) {
    const created = await this.repo.createTopic({
      userId,
      title: payload.title,
      description: payload.description,
      status: "open",
      attachments: [],
      messagesCount: 0,
      lastActivityAt: new Date(),
    } as unknown as Attributes<ForumTopic>);

    const normalizedAttachments = await this.moveAttachmentsToTopic(
      created.id,
      payload.attachments ?? [],
    );
    if (
      normalizedAttachments.length !== payload.attachments.length ||
      normalizedAttachments.length > 0
    ) {
      await this.repo.updateTopic(created, {
        attachments: normalizedAttachments,
      } as Partial<Attributes<ForumTopic>>);
      (created as any).attachments = normalizedAttachments;
    }

    return this.serializeTopic(created);
  }

  async getTopic(topicId: string) {
    const topic = await this.repo.findTopicById(topicId);
    if (!topic) throw toApiError(404, "Topic not found");
    const messages = await this.repo.listMessages(topicId);
    return {
      topic: this.serializeTopic(topic),
      messages: messages.map((m) => this.serializeMessage(m)),
    };
  }

  private assertCanPost(status: ForumStatus, isAdmin: boolean) {
    if (status === "open") return;
    if (status === "in_review" && isAdmin) return;
    if (status === "closed" && isAdmin) return;
    throw toApiError(403, "Topic is not accepting replies");
  }

  async addMessage(payload: CreateMessagePayload) {
    const topic = await this.repo.findTopicById(payload.topicId);
    if (!topic) throw toApiError(404, "Topic not found");
    this.assertCanPost(topic.status as ForumStatus, payload.isAdmin);

    const created = await this.repo.createMessage({
      topicId: payload.topicId,
      userId: payload.userId,
      parentId: payload.parentId || null,
      content: payload.content,
      attachments: payload.attachments,
      editedAt: null,
      editedBy: null,
    } as unknown as Attributes<ForumMessage>);

    const message = (await this.repo.findMessageById(created.id)) ?? created;

    await this.repo.updateTopic(topic, {
      messagesCount: (topic.messagesCount || 0) + 1,
      lastActivityAt: new Date(),
    });

    return {
      topic: this.serializeTopic(topic),
      message: this.serializeMessage(message),
    };
  }

  async editMessage(payload: EditMessagePayload) {
    const topic = await this.repo.findTopicById(payload.topicId);
    if (!topic) throw toApiError(404, "Topic not found");

    const message = await this.repo.findMessageById(payload.messageId);
    if (!message || message.topicId !== payload.topicId) {
      throw toApiError(404, "Message not found");
    }

    const isOwner = message.userId === payload.userId;
    const canEdit = payload.isAdmin || (isOwner && topic.status === "open");
    if (!canEdit)
      throw toApiError(403, "Editing is not allowed for this topic");

    await message.update({
      content: payload.content,
      editedAt: new Date(),
      editedBy: payload.userId,
    } as Partial<Attributes<ForumMessage>>);

    await this.repo.updateTopic(topic, { lastActivityAt: new Date() });
    return this.serializeMessage(message);
  }

  async updateStatus(
    topicId: string,
    status: ForumStatus,
    actorIsAdmin: boolean,
  ) {
    if (!actorIsAdmin) throw toApiError(403, "Admin access required");
    const topic = await this.repo.findTopicById(topicId);
    if (!topic) throw toApiError(404, "Topic not found");
    await this.repo.updateTopic(topic, { status, lastActivityAt: new Date() });
    return this.serializeTopic(topic);
  }

  async updateTopicContent(
    topicId: string,
    userId: string,
    patch: Partial<
      Pick<CreateTopicPayload, "title" | "description" | "attachments">
    >,
    isAdmin: boolean,
  ) {
    const topic = await this.repo.findTopicById(topicId);
    if (!topic) throw toApiError(404, "Topic not found");
    if (topic.status !== "open" && !isAdmin) {
      throw toApiError(403, "Editing is locked for this topic");
    }
    if (topic.userId !== userId && !isAdmin) {
      throw toApiError(403, "You cannot edit this topic");
    }
    const nextAttachments = patch.attachments
      ? await this.moveAttachmentsToTopic(topicId, patch.attachments)
      : topic.attachments;

    await this.deleteRemovedAttachments(
      topicId,
      topic.attachments || [],
      nextAttachments || [],
    );

    await this.repo.updateTopic(topic, {
      ...patch,
      attachments: nextAttachments,
      updatedAt: new Date(),
    } as Partial<Attributes<ForumTopic>>);
    return this.serializeTopic(topic);
  }

  async getUserOpenTopics(userId: string) {
    const topics = await this.repo.findUserOpenTopics(userId);
    return topics.map((topic) => ({
      id: topic.id,
      status: topic.status,
    }));
  }
}
