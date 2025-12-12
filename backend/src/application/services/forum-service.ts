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
import type { Env } from "../../config/env";
import { MailerService } from "./mailer-service";
import { MailBuilder } from "../../interfaces/http/mail-builder";
import { resolveUserRole } from "../../utils/roles";
import type { PreferredLanguage } from "../../utils/language";

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
  isModerator: boolean;
}

export interface EditMessagePayload {
  topicId: string;
  messageId: string;
  userId: string;
  content: string;
  isModerator: boolean;
}

export class ForumService {
  private readonly mailer?: MailerService;
  private readonly mailBuilder: MailBuilder;

  constructor(
    private readonly repo: ForumRepository,
    private readonly apiUrl: string = "http://localhost:4000",
    private readonly env?: Env,
    mailer?: MailerService,
    mailBuilder: MailBuilder = new MailBuilder(),
  ) {
    this.mailer = env ? (mailer ?? new MailerService(env)) : undefined;
    this.mailBuilder = mailBuilder;
  }

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
    const { user, attachments, pin, ...rest } = topic.get({
      plain: true,
    }) as any;
    const owner = user as ForumTopic["user"] | undefined;
    const pinData = pin as
      | { createdAt?: string; createdBy?: string }
      | undefined;
    const roleData = owner
      ? resolveUserRole(this.env, {
          email: owner.email,
          role: (owner as any).role,
        })
      : null;

    return {
      ...rest,
      attachments: this.serializeAttachments(attachments),
      isPinned: Boolean(pinData),
      pinnedAt: pinData?.createdAt ?? null,
      pinnedBy: pinData?.createdBy ?? null,
      owner: owner
        ? {
            id: owner.id,
            name: owner.name,
            email: owner.email,
            avatarUrl: owner.avatarUrl,
            role: roleData?.role ?? "user",
            subscriptionTier: (owner as any).subscriptionTier ?? "free",
          }
        : null,
    };
  }

  private serializeMessage(message: ForumMessage) {
    const { user, attachments, ...rest } = message.get({ plain: true }) as any;
    const author = user as ForumMessage["user"] | undefined;
    const roleData = author
      ? resolveUserRole(this.env, {
          email: author.email,
          role: (author as any).role,
        })
      : null;

    return {
      ...rest,
      attachments: this.serializeAttachments(attachments),
      author: author
        ? {
            id: author.id,
            name: author.name,
            email: author.email,
            avatarUrl: author.avatarUrl,
            role: roleData?.role ?? "user",
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
    const mute = await this.repo.findActiveMute(userId);
    if (mute) {
      const muteMessage = mute.expiresAt
        ? `You are muted until ${new Date(mute.expiresAt).toLocaleString()}`
        : "You are permanently muted";
      throw toApiError(403, muteMessage);
    }

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

  private assertCanPost(status: ForumStatus, isModerator: boolean) {
    if (status === "open") return;
    if (status === "in_review" && isModerator) return;
    if (status === "closed" && isModerator) return;
    throw toApiError(403, "Topic is not accepting replies");
  }

  async addMessage(payload: CreateMessagePayload) {
    const topic = await this.repo.findTopicById(payload.topicId);
    if (!topic) throw toApiError(404, "Topic not found");
    this.assertCanPost(topic.status as ForumStatus, payload.isModerator);

    if (!payload.isModerator) {
      const mute = await this.repo.findActiveMute(payload.userId);
      if (mute) {
        const muteMessage = mute.expiresAt
          ? `You are muted until ${new Date(mute.expiresAt).toLocaleString()}`
          : "You are permanently muted";
        throw toApiError(403, muteMessage);
      }
    }

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
    const canEdit = payload.isModerator || (isOwner && topic.status === "open");
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
    actorIsModerator: boolean,
    lang?: PreferredLanguage,
  ) {
    if (!actorIsModerator) throw toApiError(403, "Admin access required");
    const topic = await this.repo.findTopicById(topicId);
    if (!topic) throw toApiError(404, "Topic not found");
    await this.repo.updateTopic(topic, { status, lastActivityAt: new Date() });
    const updated = await this.repo.findTopicById(topicId);
    const serialized = this.serializeTopic(updated || topic);
    await this.notifyTopicStatusChange(serialized, status, lang);
    return serialized;
  }

  async updateTopicContent(
    topicId: string,
    userId: string,
    patch: Partial<
      Pick<CreateTopicPayload, "title" | "description" | "attachments">
    >,
    isModerator: boolean,
  ) {
    const topic = await this.repo.findTopicById(topicId);
    if (!topic) throw toApiError(404, "Topic not found");
    if (topic.status !== "open" && !isModerator) {
      throw toApiError(403, "Editing is locked for this topic");
    }
    if (topic.userId !== userId && !isModerator) {
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

  async listPinnedTopics(limit: number) {
    const normalizedLimit = Math.min(20, Math.max(1, limit));
    const pins = await this.repo.listPinnedTopics(normalizedLimit);
    return pins
      .map((pin) => {
        const topic = (pin as any).topic as ForumTopic | undefined;
        if (topic) {
          (topic as any).pin = {
            createdAt: (pin as any).createdAt,
            createdBy: (pin as any).createdBy,
          };
        }
        return topic;
      })
      .filter((topic): topic is ForumTopic => Boolean(topic))
      .map((topic) => this.serializeTopic(topic));
  }

  async pinTopic(topicId: string, actorId: string) {
    const topic = await this.repo.findTopicById(topicId);
    if (!topic) throw toApiError(404, "Topic not found");
    await this.repo.pinTopic(topicId, actorId);
    const updated = await this.repo.findTopicById(topicId);
    return this.serializeTopic(updated || topic);
  }

  async unpinTopic(topicId: string) {
    const topic = await this.repo.findTopicById(topicId);
    if (!topic) throw toApiError(404, "Topic not found");
    await this.repo.unpinTopic(topicId);
    const updated = await this.repo.findTopicById(topicId);
    return this.serializeTopic(updated || topic);
  }

  async muteUser(payload: {
    userId: string;
    mutedBy: string;
    expiresAt: Date | null;
    reason?: string;
    isModerator: boolean;
    lang?: PreferredLanguage;
  }) {
    if (!payload.isModerator) {
      throw toApiError(403, "Moderator or admin access required");
    }

    await this.repo.removeMute(payload.userId);

    await this.repo.createMute({
      userId: payload.userId,
      mutedBy: payload.mutedBy,
      expiresAt: payload.expiresAt,
      reason: payload.reason || null,
    } as any);

    await this.notifyMutedUser(
      payload.userId,
      payload.expiresAt,
      payload.reason,
      payload.lang,
    );

    return { success: true };
  }

  async unmuteUser(payload: {
    userId: string;
    actorId: string;
    isModerator: boolean;
  }) {
    if (!payload.isModerator) {
      throw toApiError(403, "Moderator or admin access required");
    }
    await this.repo.removeMute(payload.userId);
    return { success: true };
  }

  async getActiveMute(userId: string) {
    const mute = await this.repo.findActiveMute(userId);
    if (!mute) return { muted: false };
    return {
      muted: true,
      expiresAt: mute.expiresAt,
      reason: mute.reason,
      createdAt: mute.createdAt,
    };
  }

  async removeUserMessages(payload: {
    topicId: string;
    userId: string;
    actorId: string;
    isModerator: boolean;
  }) {
    if (!payload.isModerator) {
      throw toApiError(403, "Moderator or admin access required");
    }

    const topic = await this.repo.findTopicById(payload.topicId);
    if (!topic) throw toApiError(404, "Topic not found");

    const deletedCount = await this.repo.deleteMessagesByUser(
      payload.topicId,
      payload.userId,
    );

    const newCount = Math.max(0, (topic.messagesCount || 0) - deletedCount);
    await this.repo.updateTopic(topic, {
      messagesCount: newCount,
      lastActivityAt: new Date(),
    });

    return { success: true, deletedCount };
  }

  async getTopicParticipants(topicId: string) {
    const topic = await this.repo.findTopicById(topicId);
    if (!topic) throw toApiError(404, "Topic not found");

    const messageResults = await this.repo.getTopicParticipants(topicId);
    const participants = new Map();

    if (topic.user) {
      const owner = topic.user as any;
      const roleData = resolveUserRole(this.env, {
        email: owner.email,
        role: owner.role,
      });
      participants.set(owner.id, {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        avatarUrl: owner.avatarUrl,
        role: roleData.role,
        subscriptionTier: owner.subscriptionTier ?? "free",
        muted: false,
      });
    }

    messageResults.forEach((msg: any) => {
      if (msg.user && !participants.has(msg.user.id)) {
        const roleData = resolveUserRole(this.env, {
          email: msg.user.email,
          role: (msg.user as any).role,
        });
        participants.set(msg.user.id, {
          id: msg.user.id,
          name: msg.user.name,
          email: msg.user.email,
          avatarUrl: msg.user.avatarUrl,
          role: roleData.role,
          subscriptionTier: msg.user.subscriptionTier ?? "free",
          muted: false,
        });
      }
    });

    const list = Array.from(participants.values());
    const withMute = await Promise.all(
      list.map(async (user) => {
        const mute = await this.repo.findActiveMute(user.id);
        return { ...user, muted: Boolean(mute) };
      }),
    );
    return withMute;
  }

  async getUserActiveMutes(userId: string) {
    const mutes = await this.repo.findAllActiveMutes(userId);
    return mutes.map((mute: any) => ({
      id: mute.id,
      expiresAt: mute.expiresAt,
      reason: mute.reason,
      createdAt: mute.createdAt,
    }));
  }

  async checkUserMute(userId: string) {
    const mute = await this.repo.findActiveMute(userId);
    return mute ? { muted: true, expiresAt: mute.expiresAt } : { muted: false };
  }

  private async notifyMutedUser(
    userId: string,
    expiresAt: Date | null,
    reason?: string,
    lang?: PreferredLanguage,
  ) {
    if (!this.mailer || !this.env) return;

    const user = await this.repo.findUserById(userId);
    if (!user?.email) return;

    const appUrl = (this.env.APP_URL || "http://localhost:5173").replace(
      /\/$/,
      "",
    );

    const contacts = {
      forum: `${appUrl}/forum`,
      telegram: "https://t.me/dima_gulak",
      viber: "viber://chat?number=%2B380974779784",
      email: "gamerstaject@gmail.com",
    };

    const locale = lang === "uk" ? "uk" : "en";

    try {
      await this.mailer.send({
        to: user.email,
        subject: this.mailBuilder.muteSubject(locale),
        text: this.mailBuilder.plainMute({
          appUrl,
          userName: user.name,
          reason,
          expiresAt,
          contacts,
        }, locale),
        html: this.mailBuilder.htmlMute({
          appUrl,
          userName: user.name,
          reason,
          expiresAt,
          contacts,
        }, locale),
      });
    } catch (err) {
      console.error("Failed to send mute notification email", err);
    }
  }

  private async notifyTopicStatusChange(
    topic: ReturnType<ForumService["serializeTopic"]>,
    status: ForumStatus,
    lang?: PreferredLanguage,
  ) {
    if (!this.mailer || !this.env) return;
    const owner = topic.owner;
    if (!owner?.email) return;

    const appUrl = (this.env.APP_URL || "http://localhost:5173").replace(
      /\/$/,
      "",
    );

    const contacts = {
      forum: `${appUrl}/forum`,
      telegram: "https://t.me/dima_gulak",
      viber: "viber://chat?number=%2B380974779784",
      email: "gamerstaject@gmail.com",
    };

    const topicLink = `${appUrl}/forum/${topic.id}`;

    const locale = lang === "uk" ? "uk" : "en";

    try {
      await this.mailer.send({
        to: owner.email,
        subject: this.mailBuilder.topicStatusSubject(locale),
        text: this.mailBuilder.plainTopicStatus({
          appUrl,
          topicTitle: topic.title,
          status,
          topicLink,
          userName: owner.name,
          contacts,
        }, locale),
        html: this.mailBuilder.htmlTopicStatus({
          appUrl,
          topicTitle: topic.title,
          status,
          topicLink,
          userName: owner.name,
          contacts,
        }, locale),
      });
    } catch (err) {
      console.error("Failed to send topic status email", err);
    }
  }
}
