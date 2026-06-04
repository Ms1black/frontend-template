# Feature-Sliced Design

[Feature-Sliced Design (FSD)](https://feature-sliced.design) — архитектурная методология для фронтенд-приложений. Она решает одну главную проблему: **куда класть код** так, чтобы он не превращался в запутанный клубок зависимостей по мере роста проекта.

---

## Основная идея

Код делится на **слои**. Каждый слой — это папка в `src/`. Правило одно:

> Слой может импортировать только из слоёв **ниже** себя.

```
app        ← может импортировать из всех слоёв
  ↓
pages      ← может импортировать из widgets, features, entities, shared
  ↓
widgets    ← может импортировать из features, entities, shared
  ↓
features   ← может импортировать из entities, shared
  ↓
entities   ← может импортировать из shared
  ↓
shared     ← не импортирует из других слоёв
```

Это делает зависимости **однонаправленными** — не может быть циклов, и всегда понятно что от чего зависит.

---

## Слои и их назначение

### `shared` — переиспользуемая база

Код, не привязанный к бизнес-логике: UI-кит, утилиты, хелперы, базовые API-функции.

```
shared/
├── ui/          # Базовые компоненты: Button, Input, Modal
├── lib/         # Утилиты: formatDate, cn, debounce
├── api/         # Базовый HTTP-клиент, общие типы ответов
└── config/      # Константы, переменные окружения
```

### `entities` — бизнес-сущности

Самостоятельные объекты предметной области: пользователь, продукт, заказ. Содержит UI для отображения сущности и логику работы с ней.

```
entities/
└── user/
    ├── ui/          # UserCard, UserAvatar
    ├── model/       # типы, хуки, стор
    ├── api/         # getUserById, updateUser
    └── index.ts     # публичный API
```

### `features` — пользовательские сценарии

Конкретные действия пользователя: авторизация, добавление в корзину, поиск.

Хорошая подсказка: фича — это **глагол** («логин», «поиск»), сущность — это **существительное** («пользователь», «товар»).

```
features/
└── auth/
    ├── ui/          # LoginForm, LogoutButton
    ├── model/       # useAuth, authStore
    ├── api/         # login, logout, refreshToken
    └── index.ts
```

### `widgets` — самостоятельные блоки

Крупные UI-блоки, которые собираются из entities и features и встраиваются в страницы: шапка, сайдбар, карточка профиля.

```
widgets/
└── header/
    ├── ui/          # Header.tsx
    └── index.ts
```

### `pages` — страницы

Композиция виджетов и фич для конкретного маршрута. Здесь минимум логики — только сборка.

```
pages/
└── home/
    ├── ui/          # HomePage.tsx
    └── index.ts
```

### `app` — точка входа

В проекте на Next.js — это директория `src/app/` (App Router). Здесь: корневой layout, провайдеры, глобальные стили.

---

## Структура слайса

Каждый **слайс** (папка внутри слоя) имеет публичный API через `index.ts`. Снаружи импортируют только из него.

```
features/auth/
├── ui/
│   ├── LoginForm.tsx
│   └── LogoutButton.tsx
├── model/
│   ├── authStore.ts
│   └── useAuth.ts
├── api/
│   └── authApi.ts
└── index.ts          ← публичный API слайса
```

```ts
// index.ts — экспортируем только то, что нужно снаружи
export { LoginForm } from './ui/LoginForm'
export { useAuth } from './model/useAuth'
```

```ts
// ✅ Правильно — импорт через публичный API
import { LoginForm } from '@features/auth'

// ❌ Неправильно — нарушение инкапсуляции слайса
import { LoginForm } from '@features/auth/ui/LoginForm'
```

---

## Алиасы путей

В проекте настроены алиасы для каждого слоя — не нужно писать длинные относительные пути.

```ts
import { Button } from '@shared/ui'
import { UserCard } from '@entities/user'
import { LoginForm } from '@features/auth'
import { Header } from '@widgets/header'
import { HomePage } from '@pages/home'
```

Алиасы настроены в [`tsconfig.json`](../tsconfig.json) и подхватываются Next.js, Jest и Storybook автоматически.

---

## Пример: добавить новую фичу

Задача: добавить форму поиска.

**1. Создать слайс**

```
features/
└── search/
    ├── ui/
    │   └── SearchForm.tsx
    ├── model/
    │   └── useSearch.ts
    └── index.ts
```

**2. Объявить публичный API**

```ts
// features/search/index.ts
export { SearchForm } from './ui/SearchForm'
```

**3. Использовать в виджете**

```ts
// widgets/header/ui/Header.tsx
import { SearchForm } from '@features/search'
```

---

## Частые вопросы

**Можно ли импортировать из соседнего слайса того же слоя?**
Нет. `features/auth` не может импортировать из `features/search`. Если нужна общая логика — выноси в `shared` или `entities`.

**Что если компонент нужен на двух страницах?**
Это виджет. Перенеси в `widgets/`.

**Куда класть хуки?**
В `model/` внутри слайса. Общие хуки, не привязанные к бизнесу — в `shared/lib/`.

**Нужны ли все слои с первого дня?**
Нет. Начни с `shared` и `app`. Добавляй слои по мере роста проекта.

---

## Полезные ссылки

- [Официальная документация FSD](https://feature-sliced.design/docs)
- [Туториал: первые шаги](https://feature-sliced.design/docs/get-started/tutorial)
- [Примеры реальных проектов](https://feature-sliced.design/examples)
- [FSD + Next.js](https://feature-sliced.design/docs/guides/tech/with-nextjs)
