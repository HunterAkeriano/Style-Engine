import { z } from "zod";

export const forumYoutubeIdRegex = /(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/i;

export interface ForumValidationMessages {
  titleMin: string;
  titleMax: string;
  descriptionMin: string;
  descriptionMax: string;
  youtube: string;
  videoNotAllowed: string;
  attachmentsLimit: string;
  contentMin: string;
  contentMax: string;
}

const attachmentDraftSchema = z.object({
  type: z.enum(["image", "youtube"]),
  url: z.string().optional().default(""),
  file: z.any().optional(),
  preview: z.string().optional(),
});

export function buildTopicFormSchema(options: {
  allowVideo: boolean;
  maxAttachments: number;
  messages?: Partial<ForumValidationMessages>;
}) {
  const messages: ForumValidationMessages = {
    titleMin: "Title is required",
    titleMax: "Title is too long",
    descriptionMin: "Description is required",
    descriptionMax: "Description is too long",
    youtube: "Invalid YouTube link",
    videoNotAllowed: "Video attachments are not allowed",
    attachmentsLimit: `Maximum ${options.maxAttachments} attachments`,
    contentMin: "Content is required",
    contentMax: "Content is too long",
    ...options.messages,
  };

  return z
    .object({
      title: z
        .string()
        .trim()
        .min(3, { message: messages.titleMin })
        .max(200, { message: messages.titleMax }),
      description: z
        .string()
        .trim()
        .min(10, { message: messages.descriptionMin })
        .max(5000, { message: messages.descriptionMax }),
      attachments: z
        .array(attachmentDraftSchema)
        .max(options.maxAttachments, { message: messages.attachmentsLimit }),
    })
    .superRefine((value, ctx) => {
      for (const att of value.attachments) {
        if (att.type === "youtube") {
          if (!options.allowVideo) {
            ctx.addIssue({
              code: "custom",
              path: ["attachments"],
              message: messages.videoNotAllowed,
            });
          } else if (!forumYoutubeIdRegex.test(att.url || "")) {
            ctx.addIssue({
              code: "custom",
              path: ["attachments"],
              message: messages.youtube,
            });
          }
        }
      }
    });
}

export function buildReplyFormSchema(options: {
  allowVideo: boolean;
  maxAttachments: number;
  messages?: Partial<ForumValidationMessages>;
}) {
  const messages: ForumValidationMessages = {
    titleMin: "Title is required",
    titleMax: "Title is too long",
    descriptionMin: "Description is required",
    descriptionMax: "Description is too long",
    youtube: "Invalid YouTube link",
    videoNotAllowed: "Video attachments are not allowed",
    attachmentsLimit: `Maximum ${options.maxAttachments} attachments`,
    contentMin: "Content is required",
    contentMax: "Content is too long",
    ...options.messages,
  };

  return z
    .object({
      content: z
        .string()
        .trim()
        .min(1, { message: messages.contentMin })
        .max(4000, { message: messages.contentMax }),
      attachments: z
        .array(attachmentDraftSchema)
        .max(options.maxAttachments, { message: messages.attachmentsLimit }),
    })
    .superRefine((value, ctx) => {
      for (const att of value.attachments) {
        if (att.type === "youtube") {
          if (!options.allowVideo) {
            ctx.addIssue({
              code: "custom",
              path: ["attachments"],
              message: messages.videoNotAllowed,
            });
          } else if (!forumYoutubeIdRegex.test(att.url || "")) {
            ctx.addIssue({
              code: "custom",
              path: ["attachments"],
              message: messages.youtube,
            });
          }
        }
      }
    });
}

export type TopicFormInput = z.infer<ReturnType<typeof buildTopicFormSchema>>;
export type ReplyFormInput = z.infer<ReturnType<typeof buildReplyFormSchema>>;
