# Frontend Template

Next.js 15 · TypeScript 5 · Feature-Sliced Design · pnpm


## Стек

  <img align="right" alt="GIF" width="350" src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWhqMTBpd29vZTltOXhrb2RpdHoycXd3cjgyaHhxbDRpc2RkZmgwNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pbjzB6k2KNlvi/giphy.gif"/>

|                 | Инструмент                                                                                            | Версия  |
| --------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| Фреймворк       | [Next.js](https://nextjs.org)                                                                         | 15      |
| Язык            | [TypeScript](https://typescriptlang.org)                                                              | 5       |
| Архитектура     | [Feature-Sliced Design](https://feature-sliced.design)                                                | —       |
| Unit-тесты      | [Jest](https://jestjs.io) + [Testing Library](https://testing-library.com)                            | 29 / 16 |
| E2E-тесты       | [Playwright](https://playwright.dev)                                                                  | 1.60    |
| UI-документация | [Storybook](https://storybook.js.org)                                                                 | 8       |
| Стейт-менеджер  | [Zustand](https://zustand-demo.pmnd.rs)                                                               | 5       |
| Стили           | SCSS + CSS Modules                                                                                    | —       |
| Линтер          | [ESLint](https://eslint.org)                                                                          | 10      |
| Форматирование  | [Prettier](https://prettier.io)                                                                       | 3       |
| Git-хуки        | [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) | 9 / 17  |
| Коммиты         | [Commitlint](https://commitlint.js.org) · [Conventional Commits](https://www.conventionalcommits.org) | 21      |
| Контейнеризация | [Docker](https://docker.com) + Compose                                                                | —       |

## Быстрый старт

### Локально

```bash
pnpm install
pnpm exec playwright install chromium
pnpm dev
```

### Через Docker

```bash
docker compose up --build
```

Открыть [http://localhost:3000](http://localhost:3000).

## Команды

```bash
pnpm dev                # Запустить dev-сервер Next.js
pnpm build              # Собрать продакшн-сборку
pnpm start              # Запустить продакшн-сервер

pnpm test               # Unit-тесты (Jest)
pnpm test:watch         # Unit-тесты в watch-режиме
pnpm test:coverage      # Unit-тесты с отчётом о покрытии

pnpm test:e2e           # E2E-тесты (Playwright, без браузера)
pnpm test:e2e:ui        # E2E-тесты с интерактивным UI Playwright
pnpm test:e2e:report    # Открыть HTML-отчёт последнего запуска

pnpm storybook          # Storybook на порту :6006
pnpm build-storybook    # Собрать статичный Storybook

pnpm lint               # Проверить ESLint
pnpm lint:fix           # Исправить ошибки ESLint
pnpm format             # Отформатировать код Prettier
pnpm format:check       # Проверить форматирование
```

### Docker

```bash
# Разработка — app :3000 + Storybook :6006
docker compose up --build

# Запустить в фоне
docker compose up -d

# Unit-тесты внутри контейнера
docker compose --profile test up test

# E2E-тесты внутри контейнера (ждёт готовности app)
docker compose --profile e2e up e2e

# Всё сразу: app + Storybook + тесты
docker compose --profile test --profile e2e up --build

# Остановить все сервисы
docker compose down

# Логи конкретного сервиса
docker compose logs -f app
docker compose logs -f storybook

# Зайти внутрь контейнера
docker compose exec app sh

# Установить пакет внутри контейнера
docker compose exec app pnpm add <package>

# Продакшн-превью
docker compose -f docker-compose.prod.yml up --build
```

## Структура проекта

```
.
├── e2e/                       # Playwright e2e-тесты
├── src/
│   ├── app/                   # Next.js App Router (layout, page, providers)
│   ├── pages/                 # FSD: композиция страниц
│   ├── widgets/               # FSD: самостоятельные блоки UI
│   ├── features/              # FSD: пользовательские сценарии
│   ├── entities/              # FSD: бизнес-сущности
│   └── shared/
│       ├── ui/Example/        # Пример компонента (тест + story + scss)
│       ├── styles/            # Переменные, миксины, брейкпоинты
│       ├── lib/
│       ├── api/
│       ├── config/
│       └── testing/           # Настройка Jest и заглушки
├── Dockerfile                 # Продакшн-образ (многоступенчатый)
├── Dockerfile.dev             # Образ для разработки
├── docker-compose.yml         # Оркестрация для разработки
├── docker-compose.prod.yml    # Оркестрация для продакшн-превью
├── playwright.config.ts
├── jest.config.ts
├── next.config.ts
├── eslint.config.mjs
├── commitlint.config.ts
└── tsconfig.json
```

## Документация

- [Feature-Sliced Design](./docs/fsd.md) — архитектура, слои, правила импортов, структура слайса
- [Коммиты](./docs/commits.md) — Conventional Commits, типы, примеры, зачем это нужно
- [Тестирование](./docs/testing.md) — Jest unit-тесты, Playwright e2e, когда что использовать
- [Storybook](./docs/storybook.md) — написание stories, autodocs, controls, декораторы
- [Next.js](./docs/nextjs.md) — App Router, серверные и клиентские компоненты, маршрутизация
- [SCSS](./docs/scss.md) — CSS Modules, переменные, миксины, брейкпоинты
- [Zustand](./docs/zustand.md) — сторы, middleware, тестирование, когда использовать
- [Docker](./docs/docker.md) — разработка, тесты, Storybook, продакшн-превью, profiles
