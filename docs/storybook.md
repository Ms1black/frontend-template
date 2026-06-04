# Storybook

[Storybook](https://storybook.js.org) — среда для разработки и документирования UI-компонентов в полной изоляции от приложения. Запускаешь `pnpm storybook`, открывается браузер с живым каталогом компонентов.

**Зачем это нужно:**

- Разрабатывать компоненты без запуска всего приложения
- Видеть все состояния компонента в одном месте
- Документировать пропсы — автоматически, через TypeScript-типы
- Использовать как живую дизайн-систему для всей команды

---

## Расположение

Story лежит рядом с компонентом:

```
shared/ui/Example/
├── Example.tsx
├── Example.stories.tsx   ← stories
├── Example.test.tsx
└── index.ts
```

---

## Базовый пример

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Example } from './Example'

// Meta — описание компонента целиком
const meta: Meta<typeof Example> = {
  component: Example,
  title: 'shared/ui/Example', // путь в боковой панели Storybook
  tags: ['autodocs'], // автоматически создаёт страницу документации
}

export default meta

type Story = StoryObj<typeof Example>

// Каждый именованный экспорт — отдельная story (отдельное состояние компонента)
export const Стандартный: Story = {
  args: {
    label: 'Пример компонента',
  },
}
```

---

## Несколько состояний

```tsx
export const Основной: Story = {
  args: { variant: 'primary', children: 'Кнопка' },
}

export const Вторичный: Story = {
  args: { variant: 'secondary', children: 'Кнопка' },
}

export const Недоступный: Story = {
  args: { disabled: true, children: 'Недоступно' },
}

export const Загрузка: Story = {
  args: { loading: true, children: 'Загрузка...' },
}
```

---

## Controls

Controls позволяют менять пропсы прямо в браузере. Они генерируются автоматически из TypeScript-типов компонента.

Управлять поведением конкретного control:

```tsx
const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Визуальный вариант кнопки',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    onClick: {
      action: 'нажата', // логирует вызов в панели Actions
    },
  },
}
```

---

## Декораторы

Декораторы оборачивают story в дополнительный контекст — провайдеры, отступы, тема.

```tsx
// Декоратор для одной story
export const НаТёмномФоне: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider theme="dark">
        <Story />
      </ThemeProvider>
    ),
  ],
  args: { label: 'Тёмная тема' },
}
```

```tsx
// Декоратор для всех stories одного компонента — в meta
const meta: Meta<typeof Button> = {
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}
```

```ts
// Глобальный декоратор для всех stories — в .storybook/preview.ts
export const decorators = [
  (Story) => (
    <Providers>
      <Story />
    </Providers>
  ),
]
```

---

## Autodocs

Тег `tags: ['autodocs']` в meta создаёт страницу документации автоматически: описание пропсов из TypeScript-типов, таблица controls, примеры из всех stories.

Добавь JSDoc-комментарии к пропсам, чтобы документация была полнее:

```tsx
interface ButtonProps {
  /** Визуальный вариант кнопки */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Размер кнопки */
  size?: 'sm' | 'md' | 'lg'
  /** Блокирует взаимодействие и показывает недоступное состояние */
  disabled?: boolean
}
```

---

## Соглашение по именованию

```
title: 'shared/ui/Button'          ← слой / сегмент / компонент
title: 'entities/user/UserCard'
title: 'features/auth/LoginForm'
title: 'widgets/header/Header'
```

Это формирует иерархию в боковой панели Storybook, которая отражает FSD-структуру проекта — легко найти нужный компонент.

---

## Полезные ссылки

- [Введение в Storybook](https://storybook.js.org/docs/get-started/whats-a-story)
- [Формат CSF (Component Story Format)](https://storybook.js.org/docs/api/csf)
- [Args и Controls](https://storybook.js.org/docs/writing-stories/args)
- [Декораторы](https://storybook.js.org/docs/writing-stories/decorators)
- [Autodocs](https://storybook.js.org/docs/writing-docs/autodocs)
