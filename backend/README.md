# Style Engine Backend

Express.js REST API с PostgreSQL для приложения Style Engine.

## Требования

- Node.js 18+
- PostgreSQL 16
- npm или yarn

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка PostgreSQL (macOS с Homebrew)

```bash
# Запустить PostgreSQL
brew services start postgresql@16

# Создать базу данных
/opt/homebrew/opt/postgresql@16/bin/createdb style_engine

# Применить схему
/opt/homebrew/opt/postgresql@16/bin/psql -d style_engine -f src/db/schema.sql

# Применить миграцию для оплаты/модерации
/opt/homebrew/opt/postgresql@16/bin/psql -d style_engine -f src/db/migrations/002_payment_publish.sql
```

### 3. Настройка переменных окружения

Скопируйте `.env.example` в `.env` и обновите значения:

```bash
cp .env.example .env
```

Для macOS с Homebrew PostgreSQL используйте свой username:

```
DATABASE_URL=postgres://ваш-username@localhost:5432/style_engine
JWT_SECRET=замените-на-безопасный-ключ-минимум-12-символов
PORT=4000
NODE_ENV=development
```

Узнать свой username: `whoami`

### 4. Запуск

```bash
# Development mode с hot-reload
npm run dev

# Production build
npm run build
npm start
```

API будет доступен по адресу: `http://localhost:4000`

## API Endpoints

### Health Check
- `GET /api/health/health` - Проверка состояния API

### Authentication
- `POST /api/auth/register` - Регистрация
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- `POST /api/auth/login` - Авторизация
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Profile
- `GET /api/profile` - Получить профиль (требует JWT)
- `PATCH /api/profile` - Обновить профиль (требует JWT)

### Saved Items
- `GET /api/saves/:type` - Получить сохраненные элементы (type: gradients, shadows, animations)
- `POST /api/saves/:type` - Сохранить элемент
- `DELETE /api/saves/:type/:id` - Удалить элемент

### Forum
- `GET /api/forum/topics?p=1&limit=20&status=open|in_review|closed` — список тем с пагинацией
- `GET /api/forum/topics/pinned?limit=5` — закреплённые темы (видны всем)
- `POST /api/forum/topics` — создать тему (JWT). Поля: `title`, `description`, `attachments[]`
- `GET /api/forum/topics/:id` — получить тему и сообщения
- `PATCH /api/forum/topics/:id` — обновить тему (автор или админ)
- `PATCH /api/forum/topics/:id/status` — сменить статус (admin/moderator)
- `POST /api/forum/topics/:id/pin` / `DELETE /api/forum/topics/:id/pin` — закрепить/открепить тему (admin/moderator)
- `POST /api/forum/topics/:id/messages` — добавить сообщение/ответ (JWT). Поля: `content`, `parentId?`, `attachments?`
- `PATCH /api/forum/topics/:id/messages/:messageId` — редактировать сообщение (владелец или админ)
- `DELETE /api/forum/topics/:id/messages/:userId` — удалить все сообщения пользователя в теме (moderator/super-admin)
- `POST /api/forum/attachments?topicId=uuid` — загрузка вложения (multipart `file`)
- `GET /api/forum/topics/:id/participants` — участники темы
- `GET /api/forum/my-topics/open` — открытые темы текущего пользователя
- `POST /api/forum/mute/:userId` — выдать мут (moderator/super-admin). Тело: `durationMinutes` (null = перманентно), `reason?`
- `GET /api/forum/my-mutes` — активные мюты текущего пользователя
- `GET /api/forum/mute-status` — состояние мута (для UI)

## Структура базы данных

### users
- id (UUID, PK)
- email (TEXT, UNIQUE)
- password_hash (TEXT)
- name (TEXT, nullable)
- avatar_url (TEXT, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### saved_gradients / saved_shadows / saved_animations
- id (UUID, PK)
- user_id (UUID, FK → users.id)
- name (TEXT)
- payload (JSONB)
- created_at (TIMESTAMP)

### forum_topics
- id (UUID, PK)
- title, description, status
- owner_id (UUID, FK → users.id)
- is_pinned, pinned_at, pinned_by
- messages_count, last_activity_at
- created_at, updated_at

### forum_messages
- id (UUID, PK)
- topic_id (FK → forum_topics)
- user_id (FK → users)
- parent_id (self FK, nullable)
- content, attachments (JSONB), edited_at, edited_by
- created_at, updated_at

### forum_mutes
- id (UUID, PK)
- user_id (FK → users)
- muted_by (FK → users)
- reason, expires_at, created_at

## Разработка

### Scripts

- `npm run dev` - Запуск с hot-reload
- `npm run build` - Сборка TypeScript
- `npm start` - Запуск production сборки
- `npm run lint` - Проверка кода ESLint

### Технологии

- Express.js 4.19
- PostgreSQL (pg 8.12)
- TypeScript 5.7
- JWT Authentication (jsonwebtoken 9.0)
- bcryptjs для хеширования паролей
- Zod для валидации environment variables
- Helmet для безопасности
- Morgan для логирования
- Swagger для документации API

## Swagger Documentation

После запуска сервера документация API доступна по адресу:
- `http://localhost:4000/api-docs`
