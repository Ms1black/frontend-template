# Docker

В проекте два режима запуска через Docker: **разработка** и **продакшн-превью**.

---

## Сервисы

| Сервис      | Образ                                      | Порт  | Profile      |
| ----------- | ------------------------------------------ | ----- | ------------ |
| `app`       | Dockerfile.dev                             | :3000 | по умолчанию |
| `storybook` | Dockerfile.dev                             | :6006 | по умолчанию |
| `test`      | Dockerfile.dev                             | —     | `test`       |
| `e2e`       | mcr.microsoft.com/playwright:v1.60.0-noble | —     | `e2e`        |

---

## Разработка

### Запустить app + Storybook

```bash
docker compose up --build
```

- Next.js → [http://localhost:3000](http://localhost:3000)
- Storybook → [http://localhost:6006](http://localhost:6006)

Hot reload работает — исходники монтируются с хоста. `node_modules` и `.next` изолированы в анонимных volumes внутри контейнера `app` — не смешиваются с хостовыми артефактами.

### Запустить unit-тесты

```bash
docker compose --profile test up test
```

Jest запускается с `CI=true` — выполняется один раз и завершается.

### Запустить e2e-тесты

```bash
docker compose --profile e2e up e2e
```

Playwright дожидается healthcheck сервиса `app` и только потом запускает тесты. Браузеры уже встроены в официальный образ. Исходники и `node_modules` монтируются напрямую с хоста.

### Запустить всё сразу

```bash
docker compose --profile test --profile e2e up --build
```

### Остальные команды

```bash
docker compose down                          # Остановить все сервисы
docker compose logs -f app                   # Логи приложения
docker compose logs -f storybook             # Логи Storybook
docker compose exec app sh                   # Зайти в контейнер
docker compose exec app pnpm add <package>   # Установить пакет
```

---

## Продакшн-превью

Используй для локальной проверки продакшн-сборки перед деплоем.

```bash
docker compose -f docker-compose.prod.yml up --build
```

### Как это работает

`Dockerfile` — многоступенчатая сборка:

```
base      — node:22-alpine + pnpm@10.32.1
deps      — установка зависимостей (--frozen-lockfile)
builder   — pnpm build → .next/standalone
runner    — минимальный образ только с артефактами сборки
```

Финальный образ не содержит исходников и `node_modules` — работает через `output: 'standalone'` в `next.config.ts`. Процесс запускается от непривилегированного пользователя `nextjs`.

```bash
# Пересобрать без кэша
docker compose -f docker-compose.prod.yml build --no-cache

# Остановить
docker compose -f docker-compose.prod.yml down
```

---

## Переменные окружения

Создай `.env.local` в корне — Next.js подхватывает автоматически:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

Для передачи в Docker Compose добавь в `docker-compose.yml`:

```yaml
services:
  app:
    env_file:
      - .env.local
```

---

## Полезные ссылки

- [Next.js: деплой с Docker](https://nextjs.org/docs/app/building-your-application/deploying#docker-image)
- [Next.js: output standalone](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Docker Compose: profiles](https://docs.docker.com/compose/how-tos/profiles/)
- [Docker Compose: healthcheck](https://docs.docker.com/compose/how-tos/startup-order/)
- [Playwright: Docker](https://playwright.dev/docs/docker)
- [Docker: многоступенчатые сборки](https://docs.docker.com/build/building/multi-stage/)
