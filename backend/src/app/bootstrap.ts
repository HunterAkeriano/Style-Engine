import { Container } from "../core/container";
import { loadEnv } from "../config/env";
import { initDb } from "../config/db";
import { ensureSuperAdmin } from "../config/super-admin";
import { HttpApplication } from "./http-application";
import { ApiRouter } from "../interfaces/http/api-router";
import { HealthController } from "../interfaces/http/controllers/health-controller";
import { AuthController } from "../interfaces/http/controllers/auth-controller";
import { ProfileController } from "../interfaces/http/controllers/profile-controller";
import { SavesController } from "../interfaces/http/controllers/saves-controller";
import { ModerationController } from "../interfaces/http/controllers/moderation-controller";
import { UsersController } from "../interfaces/http/controllers/users-controller";
import { QuizController } from "../interfaces/http/controllers/quiz-controller";
import { initForumWs } from "../interfaces/ws/forum-ws";
import { ForumController } from "../interfaces/http/controllers/forum-controller";

/**
 * Application bootstrapper responsible for wiring dependencies
 * and starting the HTTP server.
 */
export async function bootstrap() {
  const env = loadEnv();
  const container = new Container();

  const { sequelize, models } = initDb(env);

  try {
    await sequelize.authenticate();
    if (env.NODE_ENV !== "production") {
      await sequelize.sync();
    }
    await ensureSuperAdmin(env);
  } catch (err) {
    console.error("Failed to connect to database", err);
    process.exit(1);
  }

  container.registerValue("env", env);
  container.registerValue("sequelize", sequelize);
  container.registerValue("models", models);

  container.registerFactory("api.router", () => {
    const controllers = [
      new HealthController(),
      new AuthController(env, models),
      new ProfileController(env, models),
      new SavesController(env, models),
      new ModerationController(env, models),
      new UsersController(env, models),
      new QuizController(env, models),
      new ForumController(env, models),
    ];
    return new ApiRouter(env, controllers);
  });

  const app = new HttpApplication(env, container);
  app.configure();
  const server = app.listen();
  initForumWs(server);
}
