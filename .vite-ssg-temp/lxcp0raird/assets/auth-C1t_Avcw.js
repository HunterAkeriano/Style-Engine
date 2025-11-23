import { z } from "zod";
z.object({
  email: z.string().min(1, "EMAIL_REQUIRED").email("EMAIL_INVALID"),
  password: z.string().min(1, "PASSWORD_REQUIRED").min(8, "PASSWORD_MIN")
});
z.object({
  email: z.string().min(1, "EMAIL_REQUIRED").email("EMAIL_INVALID"),
  password: z.string().min(1, "PASSWORD_REQUIRED").min(8, "PASSWORD_MIN"),
  name: z.string().min(1, "NAME_MIN").max(120, "NAME_MAX").optional()
});
z.object({
  name: z.string().min(1, "NAME_MIN").max(120, "NAME_MAX").optional(),
  avatarUrl: z.string().url("EMAIL_INVALID").optional()
});
z.object({
  email: z.string().min(1, "EMAIL_REQUIRED").email("EMAIL_INVALID")
});
z.object({
  password: z.string().min(8, "PASSWORD_MIN"),
  confirmPassword: z.string().min(8, "PASSWORD_MIN")
}).refine((data) => data.password === data.confirmPassword, {
  message: "PASSWORD_MISMATCH",
  path: ["confirmPassword"]
});
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "PASSWORD_REQUIRED"),
  newPassword: z.string().min(8, "PASSWORD_MIN"),
  confirmPassword: z.string().min(8, "PASSWORD_MIN")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "PASSWORD_MISMATCH",
  path: ["confirmPassword"]
});
export {
  changePasswordSchema as c
};
