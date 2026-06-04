# Zustand

[Zustand](https://zustand-demo.pmnd.rs) — минималистичный стейт-менеджер для React. Не требует провайдеров, не генерирует бойлерплейт, легко тестируется.

---

## Пример в проекте: features/counter

В шаблоне есть готовый пример — `features/counter`. Он показывает как правильно организовать фичу со стором по FSD: стор в `model/`, компонент в `ui/`, публичный API через `index.ts`.

```
src/features/counter/
├── model/
│   └── counterStore.ts     ← Zustand стор с devtools
├── ui/
│   ├── Counter.tsx          ← клиентский компонент с селекторами
│   ├── Counter.module.scss  ← стили
│   ├── Counter.test.tsx     ← тест со сбросом стора
│   └── Counter.stories.tsx  ← Storybook story
└── index.ts                 ← публичный API фичи
```

### Стор (`model/counterStore.ts`)

```ts
import { create, devtools } from '@shared/lib/store'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => {
        set((state) => ({ count: state.count + 1 }), false, 'counter/increment')
      },
      decrement: () => {
        set((state) => ({ count: state.count - 1 }), false, 'counter/decrement')
      },
      reset: () => {
        set({ count: 0 }, false, 'counter/reset')
      },
    }),
    { name: 'CounterStore' },
  ),
)
```

Третий аргумент в `set` — имя действия для Redux DevTools. Формат: `слайс/действие`.

### Компонент (`ui/Counter.tsx`)

```tsx
'use client'

import { useCounterStore } from '../model/counterStore'

export function Counter() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  const reset = useCounterStore((state) => state.reset)

  return (
    <div>
      <span>{count}</span>
      <button onClick={decrement}>−</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

Каждое поле берётся через отдельный селектор — компонент ре-рендерится только когда меняется именно то поле, которое он читает.

### Тест (`ui/Counter.test.tsx`)

```ts
import { useCounterStore } from '../model/counterStore'

beforeEach(() => {
  useCounterStore.setState({ count: 0 })
})

test('increments on click', async () => {
  render(<Counter />)
  await userEvent.click(screen.getByRole('button', { name: '+' }))
  expect(screen.getByText('1')).toBeInTheDocument()
})
```

`setState` позволяет сбросить стор без перемонтирования компонента — тесты изолированы друг от друга.

### Публичный API (`index.ts`)

```ts
export { Counter } from './ui/Counter'
export { useCounterStore } from './model/counterStore'
```

Снаружи фичи импортируют только через `index.ts`:

```ts
import { Counter, useCounterStore } from '@features/counter'
```

---

## Как устроено в проекте

Все сторы создаются через `@shared/lib/store` — единая точка входа:

```ts
// src/shared/lib/store.ts
export { create } from 'zustand'
export { devtools, persist } from 'zustand/middleware'
```

Сам стор живёт в `model/` внутри слайса по правилам FSD.

---

## Создание стора

```ts
import { create, devtools } from '@shared/lib/store'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => {
        set((state) => ({ count: state.count + 1 }), false, 'counter/increment')
      },
      decrement: () => {
        set((state) => ({ count: state.count - 1 }), false, 'counter/decrement')
      },
      reset: () => {
        set({ count: 0 }, false, 'counter/reset')
      },
    }),
    { name: 'CounterStore' },
  ),
)
```

---

## Использование в компоненте

Компоненты, которые читают стор, должны быть клиентскими (`'use client'`).

Каждое поле берётся через отдельный селектор — это предотвращает лишние ре-рендеры:

```tsx
'use client'

import { useCounterStore } from '../model/counterStore'

export function Counter() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  const reset = useCounterStore((state) => state.reset)

  return (
    <div>
      <span>{count}</span>
      <button onClick={decrement}>−</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

```tsx
// ✅ Ре-рендер только при изменении count
const count = useCounterStore((state) => state.count)

// ❌ Ре-рендер при любом изменении стора
const { count } = useCounterStore()
```

---

## Middleware

### devtools

Подключает Redux DevTools в браузере:

```ts
import { create, devtools } from '@shared/lib/store'

const useStore = create<State>()(
  devtools(
    (set) => ({ ... }),
    { name: 'MyStore' },
  ),
)
```

### persist

Сохраняет стор в `localStorage` между перезагрузками:

```ts
import { create, devtools, persist } from '@shared/lib/store'

const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({ ... }),
      { name: 'my-store-key' },
    ),
  ),
)
```

---

## Тестирование

Перед каждым тестом сбрасывай стор через `setState`:

```ts
beforeEach(() => {
  useCounterStore.setState({ count: 0 })
})
```

Можно читать и изменять стор напрямую без рендера:

```ts
test('store increments correctly', () => {
  const { increment } = useCounterStore.getState()
  increment()
  expect(useCounterStore.getState().count).toBe(1)
})
```

---

## Структура стора для реального слайса

```ts
// features/auth/model/authStore.ts
import { create, devtools, persist } from '@shared/lib/store'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isLoading: false,
        login: async (credentials) => {
          set({ isLoading: true }, false, 'auth/login/pending')
          try {
            const { user, token } = await authApi.login(credentials)
            set({ user, token, isLoading: false }, false, 'auth/login/success')
          } catch {
            set({ isLoading: false }, false, 'auth/login/error')
          }
        },
        logout: () => {
          set({ user: null, token: null }, false, 'auth/logout')
        },
      }),
      { name: 'auth' },
    ),
    { name: 'AuthStore' },
  ),
)
```

---

## Когда не нужен Zustand

- **Данные с сервера** — используй TanStack Query
- **Локальное состояние компонента** — используй `useState` / `useReducer`
- **Состояние формы** — используй React Hook Form

Zustand нужен для **глобального UI-состояния**: текущий пользователь, тема, корзина, уведомления, фильтры дашборда.

---

## Полезные ссылки

- [Документация Zustand](https://zustand.docs.pmnd.rs)
- [Zustand + TypeScript](https://zustand.docs.pmnd.rs/guides/typescript)
- [Zustand middleware](https://zustand.docs.pmnd.rs/middlewares/devtools)
- [Redux DevTools](https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
