# CSS-Zone (css-lab)

Документація для розробників. Проєкт: Vite + Vue 3 (script setup), Pinia, vue-router, vue-i18n, @unhead/vue, SCSS. Статична генерація через `vite-ssg`. Бекенд виділений у окремий npm-воркспейс (`backend/`).

## Архітектура (огляд)
- **Фронтенд**: Vite, Vue 3, Pinia для стану, маршрути з `vue-router`, SEO через `@unhead/vue`. Сторінки в `src/pages`, компоненти розбиті на `shared`/`entities`/`features`/`widgets`.
- **Мультимовність**: `vue-i18n` з локалями `en` та `uk`. i18n ініціалізується з маршруту (`getLocaleFromPath`), створюється заново для кожного SSG-рендеру, щоб уникнути витоків локалі.
- **Мережа**: axios-клієнт у `shared/api/client.ts` з токеном у cookie `AUTH_TOKEN_KEY`, автоматичним рефрешем `/auth/refresh`, базовий URL з `VITE_API_URL` (або `VITE_API_BASE_URL`).
- **Роутинг**: усі маршрути мають префікс `/:locale`. Гварди перевіряють `requiresAuth`, `requiresAdmin`, `guestOnly`, додають redirect, і форсять наявність локалі в шляху.
- **SSG**: `vite-ssg` рендерить публічні сторінки (див. список у `SSG_PUBLIC_ROUTES` у `main.ts`). Метатеги беруться з i18n (`META.*`, `META_DESCRIPTION.*`) та route meta.
- **UI**: SCSS у `src/app/styles`, компоненти в PascalCase, тости через `shared/lib/toast`, директива `click-outside` реєструється в `main.ts`.

## Вимоги
- Node.js 22 (остання перевірена 22.9.0)
- npm 10
- macOS/Linux/Windows (на Windows дозвольте виконання скриптів PowerShell або використовуйте `npm.cmd`)

## Швидкий старт
1) Встановити залежності: `npm ci`
2) Скопіювати env: `cp .env.example .env` та налаштувати API/базовий шлях
3) Запустити дев-сервер: `npm run dev`
4) За потреби бекенд: `npm run backend:dev`

## Команди
- `npm run dev` — Vite dev server (HMR)
- `npm run build` — типізація + клієнтський білд
- `npm run build:ssg` — типізація + SSG білд у `dist/`
- `npm run preview` / `npm run preview:ssg` — локальний перегляд білду
- `npm run lint` — ESLint для `.ts`/`.vue`
- `npm run type-check` — `vue-tsc --noEmit`
- Storybook: `npm run storybook` / `npm run build-storybook`
- Бекенд: `npm run backend:dev | backend:build | backend:start`

## Структура папок
- `src/app` — провайдери (i18n, router, guards), лейаути, глобальні стилі, `App.vue`
- `src/pages` — сторінки (градієнти, тіні, анімації, docs, профіль, auth, модерація)
- `src/entities` — доменні сторі (напр. `useAuthStore`)
- `src/features` / `src/widgets` / `src/shared` — повторно використовувані компоненти, утиліти, стилі
- `src/shared/api` — клієнт і REST-обгортки (`auth.ts`, `users.ts`, `saves.ts`)
- `backend/` — окремий npm-воркспейс (API)
- `public/` — статичні активи, favicon, спрайт

## Потік даних і мережа
- **ApiClient** (`shared/api/client.ts`): додає токен з cookie, ставить заголовок Authorization, на 401 викликає `/auth/refresh` і повторює запит.
- **Auth збереження**: токен у cookie `AUTH_TOKEN_KEY` (1 день, path `/`). `setAuthToken`/`removeAuthToken` керують axios та кукою.
- **Обгортки**:
  - `auth.ts` — логін/реєстрація/лог-аут, відновлення профілю
  - `users.ts` — список користувачів для модерації/профілю
  - `saves.ts` — CRUD для збережених градієнтів/тіней/анімацій, публічні/публікація/модерація
- **Обробка помилок**: інтерсептор повертає `ApiError { message, status, data }`; ловіть у catch.

## Особистий кабінет (ЛК) та авторизація
- **Стор**: `useAuthStore` (Pinia) з полями `user`, `token`, `isAuthenticated`, `isAdmin`, `isPaid`, `hydrated`.
- **Життєвий цикл**: у router guards викликається `ensureSession` — читає токен з cookie, ставить у axios, тягне `/profile`. Якщо 401 — скидає токен.
- **Маршрути**: `requiresAuth` -> редирект на `/:locale/login?redirect=...`; `requiresAdmin` -> на домашню сторінку локалі; `guestOnly` -> редирект на home якщо вже залогінений.
- **Плани**: `userPlan` та `isPaid` визначають доступ до преміум-функцій (збереження/публікація).

## Генератори та збереження
- **Градієнти / Тіні / Анімації**: сторінки у `pages/gradient`, `pages/shadow`, `pages/animation`. Логіка збірки пресету у процесах `processes/*-generation/*`, стани — локальні reactive об’єкти + emit подій у дочірні компоненти.
- **Збереження** (`shared/api/saves.ts`):
  - `createSave(category, name, payload)` — створення чернетки
  - `listSaves(category)` — приватні збереження користувача
  - `listPublicSaves(category)` — публічна галерея
  - `requestPublish` / `approveSubmission` — подання на модерацію й затвердження
  - `deleteSave` — видалення пресету
- **Квоти**: `shared/lib/save-quota.ts` перевіряє ліміти для гостей/оплачених користувачів перед викликами API.
- **Модерація**: сторінки `pages/moderation` використовують `listPendingModeration` та `approveSubmission`.

## Локалізація
- Локалі: `en`, `uk`; маршрути з префіксом `/:locale`.
- Переклади у `app/providers/i18n/locales/{en,uk}.ts`, включно з SEO-ключами `META.*` і `META_DESCRIPTION.*`.
- При додаванні маршруту додайте метадані (`titleKey`, `descriptionKey`) і переклади; для SSG додайте шлях у `SSG_PUBLIC_ROUTES` (`main.ts`).

## Маршрутизація
- Локалізовані маршрути збираються у `app/providers/router/index.ts` (кожен базовий роут копіюється під кожну локаль).
- Гварди (`router/guards.ts`):
  - додають відсутню локаль у шлях,
  - виконують `ensureSession`,
  - обробляють доступ (auth/admin/guest),
  - прокидають `redirect` у query.
- `scrollBehavior` — плавний скрол і відновлення `savedPosition`.

## SSG та деплой
- `npm run build:ssg` — генерує статичні сторінки; результати у `dist/`.
- Для підшляху (GitHub Pages) встановіть `VITE_BASE=/your-base/` (див. `vercel-build`/`predeploy:ssg`).
- Canonical/OG теги збираються з route meta + i18n; переконайтеся, що нові сторінки мають ключі перекладу.

## Стилі та UI
- SCSS у `src/app/styles`: базові змінні, ресети, шрифти.
- Компоненти/теки — PascalCase; імпорти з точним регістром (важливо для білду/SSG).
- Тости: імпортуйте `useToast` з `@/shared/lib/toast`; плагін реєструється в `main.ts`.
- Кастомні директиви: `click-outside` реєструється в `main.ts`.

## Тестування та якість
- Типи: `npm run type-check`
- Лінт: `npm run lint`
- Storybook/Vitest залежності підключені (`@storybook/addon-vitest`), можна додавати тести для компонентів і утиліт.

## Додавання сторінок/фіч
1) Додайте маршрут (обидві локалі) у `router/index.ts` з `meta.titleKey`/`descriptionKey`.
2) Додайте переклади в `locales/en.ts` та `locales/uk.ts`.
3) За потреби SEO — `useHead` у сторінці.
4) Якщо сторінка публічна й має бути в SSG — додайте шлях у `SSG_PUBLIC_ROUTES` (`main.ts`).

## Часті проблеми
- **Неправильний регістр імпорту**: залишайте PascalCase у шляхах та імпортах.
- **Тости не працюють у SSR**: використовуйте лише `shared/lib/toast`, не імпортуйте з `vue-toastification` напряму.
- **Змішування локалей у SSG**: ініціалізуйте i18n через `initI18n(initialLocale)` у `main.ts`, викликайте `setLocale` на початку setup сторінки, використовуйте `getLocaleFromPath`.
- **Базовий префікс**: для деплою на підшлях ставте `VITE_BASE`; маршрути враховують `import.meta.env.BASE_URL`.
