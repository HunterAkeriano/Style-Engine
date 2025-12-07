import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "PASSWORD_MIN")
  .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/u, "PASSWORD_STRONG");

export const loginSchema = z.object({
  email: z.string().min(1, "EMAIL_REQUIRED").email("EMAIL_INVALID"),
  password: z.string().min(1, "PASSWORD_REQUIRED"),
});

export const registerSchema = z.object({
  email: z.string().min(1, "EMAIL_REQUIRED").email("EMAIL_INVALID"),
  password: strongPassword,
  name: z.string().min(1, "NAME_MIN").max(120, "NAME_MAX").optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "NAME_MIN").max(120, "NAME_MAX").optional(),
  avatarUrl: z.string().url("EMAIL_INVALID").optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "EMAIL_REQUIRED").email("EMAIL_INVALID"),
});

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: strongPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "PASSWORD_MISMATCH",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "PASSWORD_REQUIRED"),
    newPassword: strongPassword,
    confirmPassword: strongPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "PASSWORD_MISMATCH",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
