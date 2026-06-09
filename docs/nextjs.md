# Next.js App Router

Проект использует [App Router](https://nextjs.org/docs/app) — архитектуру Next.js на основе React Server Components. Понимание разницы между серверными и клиентскими компонентами — ключевое для работы с этим шаблоном.

---

## Структура `src/app/`

```
src/app/
├── layout.tsx       # Корневой layout — оборачивает все страницы
├── page.tsx         # Страница /
├── providers.tsx    # Клиентские провайдеры (контекст, стор и т.д.)
└── globals.scss     # Глобальные стили
```

`layout.tsx` рендерится один раз и **сохраняется** при навигации — не перемонтируется. `page.tsx` — рендерится для каждого конкретного маршрута.

---

## Серверные и клиентские компоненты

### Серверные компоненты (по умолчанию)

Все компоненты в App Router — **серверные** по умолчанию. Они:

- Рендерятся на сервере, не попадают в JS-бандл клиента — меньше кода в браузере
- Могут быть `async` и делать запросы к БД или API напрямую
- Не имеют доступа к `useState`, `useEffect`, браузерным API

```tsx
// src/app/users/page.tsx
// Нет директивы 'use client' — это серверный компонент
export default async function СтраницаПользователей() {
  const users = await fetch('https://api.example.com/users').then((r) => r.json())

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Клиентские компоненты

Добавь директиву `'use client'` в начале файла когда нужны:

- Хуки: `useState`, `useReducer`, `useEffect` и другие
- Браузерные API: `window`, `localStorage`, `document`
- Обработчики событий: `onClick`, `onChange`, `onSubmit`
- Сторонние библиотеки, которые используют что-то из перечисленного

```tsx
'use client'

import { useState } from 'react'

export function Счётчик() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount((c) => c + 1)}>Нажато {count} раз</button>
}
```

### Граница сервер → клиент

Клиентский компонент — это граница. Всё что рендерится **внутри** него тоже становится клиентским, даже без `'use client'`. Чтобы этого избежать — передавай серверные компоненты через `children`:

```tsx
// providers.tsx — клиентский (нужен контекст/стор)
'use client'
export function Providers({ children }) { ... }

// layout.tsx — серверный
// children здесь могут оставаться серверными компонентами!
import { Providers } from './providers'

export default function КорневойLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>  {/* ✅ */}
      </body>
    </html>
  )
}
```

---

## Маршрутизация

Маршруты определяются **структурой папок** в `src/app/`:

```
src/app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── users/
│   ├── page.tsx          → /users
│   └── [id]/
│       └── page.tsx      → /users/123
└── dashboard/
    ├── layout.tsx        → общий layout для всех /dashboard/* страниц
    ├── page.tsx          → /dashboard
    └── settings/
        └── page.tsx      → /dashboard/settings
```

### Динамические маршруты

```tsx
// src/app/users/[id]/page.tsx
interface Props {
  params: Promise<{ id: string }>
}

export default async function СтраницаПользователя({ params }: Props) {
  const { id } = await params
  const user = await getUser(id)
  return <КарточкаПользователя user={user} />
}
```

### Вложенные layouts

`layout.tsx` оборачивает все страницы внутри своей папки и сохраняется при навигации между ними:

```tsx
// src/app/dashboard/layout.tsx
export default function LayoutПанели({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard">
      <БоковоеМеню />
      <main>{children}</main>
    </div>
  )
}
```

---

## Метаданные страницы

```tsx
// Статичные метаданные
export const metadata = {
  title: 'Список пользователей',
  description: 'Все зарегистрированные пользователи',
}

// Динамические метаданные
export async function generateMetadata({ params }: Props) {
  const user = await getUser((await params).id)
  return { title: user.name }
}
```

---

## Получение данных

### В серверном компоненте (предпочтительно)

```tsx
export default async function СтраницаТовара({ params }: Props) {
  const product = await getProduct((await params).id)
  return <КарточкаТовара product={product} />
}
```

### В клиентском компоненте

```tsx
'use client'

import { useEffect, useState } from 'react'

export function СписокПользователей() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
  }, [])

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  )
}
```

---

## Route Handlers — серверное API

```tsx
// src/app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const users = await db.user.findMany()
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await db.user.create({ data: body })
  return NextResponse.json(user, { status: 201 })
}
```

---

## Полезные ссылки

- [Документация Next.js](https://nextjs.org/docs)
- [Маршрутизация в App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [Серверные компоненты](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Клиентские компоненты](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Получение данных](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Метаданные страниц](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
