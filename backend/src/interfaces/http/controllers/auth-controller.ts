import { Router, type Request } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import type { Env } from "../../../config/env";
import { parseCookies, serializeCookie } from "../../../utils/cookies";
import { AuthService } from "../../../application/services/auth-service";
import { RecaptchaService } from "../../../application/services/recaptcha-service";
import { TokenService } from "../../../application/services/token-service";
import { MailerService } from "../../../application/services/mailer-service";
import { UserRepository } from "../../../infrastructure/repositories/user-repository";
import { RefreshTokenRepository } from "../../../infrastructure/repositories/refresh-token-repository";
import { PasswordResetRepository } from "../../../infrastructure/repositories/password-reset-repository";
import type { Models } from "../../../models";
import { sendApiError } from "../../../utils/apiError";
import { MailBuilder } from "../mail-builder";
import { resolveRequestLanguage } from "../../../utils/language";
import type { HttpController } from "../api-router";

const strongPassword = z
  .string()
  .min(8)
  .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/u, "Weak password");

const credentialsSchema = z.object({
  email: z.string().email(),
  password: strongPassword,
  name: z.string().min(1).max(120).optional(),
  recaptchaToken: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  recaptchaToken: z.string().min(1),
});

const forgotSchema = z.object({
  email: z.string().email(),
  recaptchaToken: z.string().min(1),
});

const resetSchema = z.object({
  token: z.string().min(10),
  password: strongPassword,
  recaptchaToken: z.string().min(1),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: strongPassword,
});

const googleAuthSchema = z.object({
  credential: z.string().min(1),
});

export class AuthController implements HttpController {
  readonly basePath = "/auth";

  private readonly service: AuthService;
  private readonly env: Env;

  constructor(env: Env, models: Models) {
    this.env = env;
    const tokenService = new TokenService(env);
    const recaptchaService = new RecaptchaService(env.RECAPTCHA_SECRET);
    this.service = new AuthService(
      env,
      new UserRepository(models),
      new RefreshTokenRepository(models),
      new PasswordResetRepository(models),
      tokenService,
      recaptchaService,
    );
  }

  register(router: Router) {
    router.post("/register", async (req, res) => {
      const parsed = credentialsSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendApiError(res, 400, "Invalid payload", {
          details: parsed.error.issues,
        });
      }

      try {
        const { accessToken, refreshToken, user } = await this.service.register({
          email: parsed.data.email,
          password: parsed.data.password,
          name: parsed.data.name,
          recaptchaToken: parsed.data.recaptchaToken,
        });
        const cookie = serializeCookie(
          "refreshToken",
          refreshToken,
          this.cookieConfig(),
        );
        res.setHeader("Set-Cookie", cookie);
        res.status(201).json({ token: accessToken, user });
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to register user");
      }
    });

    router.post("/login", async (req, res) => {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendApiError(res, 400, "Invalid payload", {
          details: parsed.error.issues,
        });
      }
      try {
        const { accessToken, refreshToken, user } = await this.service.login({
          email: parsed.data.email,
          password: parsed.data.password,
          recaptchaToken: parsed.data.recaptchaToken,
        });
        const cookie = serializeCookie(
          "refreshToken",
          refreshToken,
          this.cookieConfig(),
        );
        res.setHeader("Set-Cookie", cookie);
        res.json({ token: accessToken, user });
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to login");
      }
    });

    router.post("/refresh", async (req, res) => {
      const cookies = parseCookies(req.headers.cookie);
      const token = cookies["refreshToken"];
      if (!token) return sendApiError(res, 401, "Missing refresh token");
      try {
        const { accessToken, user } = await this.service.refresh(token);
        res.json({ token: accessToken, user });
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message);
        return sendApiError(res, 500, "Failed to refresh token");
      }
    });

    router.post("/logout", async (req, res) => {
      const cookies = parseCookies(req.headers.cookie);
      const token = cookies["refreshToken"];
      await this.service.logout(token);
      res.setHeader(
        "Set-Cookie",
        serializeCookie("refreshToken", "", {
          ...this.cookieConfig(),
          maxAge: 0,
        }),
      );
      res.json({ ok: true });
    });

    router.post("/forgot-password", async (req, res) => {
      const parsed = forgotSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendApiError(res, 400, "Invalid payload", {
          details: parsed.error.issues,
        });
      }
      try {
        const { token, userEmail } = await this.service.forgotPassword(
          parsed.data.email,
          parsed.data.recaptchaToken,
        );
        const appUrl = this.env.APP_URL || "http://localhost:5173";
        const resetLink = `${appUrl}/reset-password?token=${token}`;
        const lang = this.getPreferredLanguage(req);
        const builder = new MailBuilder();
        await new MailerService(this.env).send({
          to: userEmail,
          subject: builder.resetSubject(lang),
          text: builder.plainReset(resetLink, lang),
          html: builder.htmlReset(resetLink, lang),
        });
        res.json({ ok: true });
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to send reset email");
      }
    });

    router.post("/reset-password", async (req, res) => {
      const parsed = resetSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendApiError(res, 400, "Invalid payload", {
          details: parsed.error.issues,
        });
      }
      try {
        await this.service.resetPassword({
          token: parsed.data.token,
          password: parsed.data.password,
          recaptchaToken: parsed.data.recaptchaToken,
        });
        res.json({ ok: true });
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to reset password");
      }
    });

    router.post("/change-password", async (req, res) => {
      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendApiError(res, 400, "Invalid payload", {
          details: parsed.error.issues,
        });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader)
        return sendApiError(res, 401, "Missing authorization header");
      const [, token] = authHeader.split(" ");
      if (!token) return sendApiError(res, 401, "Invalid authorization header");

      let userId: string | null = null;
      try {
        const payload = jwt.verify(
          token,
          (req.app.get("envConfig") as Env).JWT_SECRET,
        ) as { sub: string };
        userId = payload.sub;
      } catch {
        return sendApiError(res, 401, "Invalid or expired token");
      }

      try {
        await this.service.changePassword({ userId: userId!, ...parsed.data });
        res.json({ ok: true });
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to change password");
      }
    });

    router.post("/google", async (req, res) => {
      const parsed = googleAuthSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendApiError(res, 400, "Invalid payload", {
          details: parsed.error.issues,
        });
      }
      try {
        const { accessToken, refreshToken, user } =
          await this.service.googleAuth(parsed.data.credential);
        const cookie = serializeCookie(
          "refreshToken",
          refreshToken,
          this.cookieConfig(),
        );
        res.setHeader("Set-Cookie", cookie);
        res.json({ token: accessToken, user });
      } catch (err: any) {
        if (err?.status)
          return sendApiError(res, err.status, err.message, {
            details: err.details,
          });
        return sendApiError(res, 500, "Failed to authenticate with Google");
      }
    });
  }

  private cookieConfig() {
    const env = this.env ?? ({ NODE_ENV: "development" } as Env);
    const isProd = env.NODE_ENV === "production";
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: (isProd ? "none" : "lax") as "none" | "lax",
      path: "/api",
      maxAge: 30 * 24 * 60 * 60,
    };
  }

  private getPreferredLanguage(req: Request) {
    return resolveRequestLanguage(req);
  }
}
