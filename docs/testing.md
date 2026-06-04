# Тестирование

В проекте два уровня тестирования:

| Уровень  | Инструмент             | Скорость              | Что проверяет                                      |
| -------- | ---------------------- | --------------------- | -------------------------------------------------- |
| **Unit** | Jest + Testing Library | Быстро (миллисекунды) | Компоненты и функции в изоляции                    |
| **E2E**  | Playwright             | Медленно (секунды)    | Реальный браузер, полный пользовательский сценарий |

---

## Когда что использовать

```
Компонент рендерится с нужными пропсами?   → Jest
Хук возвращает правильное значение?         → Jest
Утилита считает корректно?                  → Jest

Пользователь может залогиниться?            → Playwright
Редирект после 401 работает?                → Playwright
Форма отправляется и показывает успех?      → Playwright
```

Большинство тестов должны быть **unit** — они быстрые и дешёвые в поддержке. E2E пиши только для критических пользовательских сценариев.

---

## Unit-тесты: Jest + Testing Library

### Расположение

Тест лежит рядом с компонентом:

```
shared/ui/Example/
├── Example.tsx
├── Example.test.tsx   ← тест
└── index.ts
```

### Базовый пример

```tsx
import { render, screen } from '@testing-library/react'
import { Example } from './Example'

test('отображает метку', () => {
  render(<Example label="Привет" />)
  expect(screen.getByTestId('example')).toHaveTextContent('Привет')
})
```

### Взаимодействие пользователя

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

test('увеличивает счётчик при клике', async () => {
  render(<Counter />)
  await userEvent.click(screen.getByRole('button', { name: '+' }))
  expect(screen.getByText('1')).toBeInTheDocument()
})
```

Используй `userEvent` вместо `fireEvent` — он симулирует реальное поведение браузера: фокус, ввод символов, hover.

### Как искать элементы

Testing Library намеренно ограничивает способы поиска, чтобы тесты отражали то, что видит пользователь:

```tsx
// 1. По роли — наиболее предпочтительно, отражает семантику HTML
screen.getByRole('button', { name: 'Отправить' })
screen.getByRole('heading', { name: 'Заголовок' })
screen.getByRole('textbox', { name: 'Email' })

// 2. По label — для полей форм
screen.getByLabelText('Пароль')

// 3. По placeholder
screen.getByPlaceholderText('Введите email')

// 4. По видимому тексту
screen.getByText('Добро пожаловать')

// 5. По data-testid — крайний случай, когда нет семантического варианта
screen.getByTestId('custom-element')
```

### Асинхронные тесты

```tsx
import { render, screen, waitFor } from '@testing-library/react'

test('показывает данные после загрузки', async () => {
  render(<UserProfile id="1" />)

  // Ждём пока элемент появится в DOM
  await screen.findByText('Иван Иванов')

  // Или явно ждём условия
  await waitFor(() => {
    expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument()
  })
})
```

### Мокирование

```tsx
// Мок функции
const onSubmit = jest.fn()
render(<Form onSubmit={onSubmit} />)
await userEvent.click(screen.getByRole('button', { name: 'Отправить' }))
expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })

// Мок модуля
jest.mock('@shared/api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'Иван' }),
}))
```

### Матчеры jest-dom

Подключены глобально через `src/shared/testing/setup.ts`:

```ts
expect(element).toBeInTheDocument() // элемент есть в DOM
expect(element).toBeVisible() // элемент виден пользователю
expect(element).toBeDisabled() // элемент недоступен
expect(element).toHaveTextContent('...') // содержит текст
expect(element).toHaveValue('...') // значение поля
expect(element).toHaveClass('active') // содержит класс
expect(element).toHaveFocus() // элемент в фокусе
```

### Запуск

```bash
pnpm test               # Все unit-тесты
pnpm test:watch         # Watch-режим (удобно при разработке)
pnpm test:coverage      # С отчётом о покрытии кода
```

---

## E2E-тесты: Playwright

### Расположение

E2E-тесты живут в отдельной папке `e2e/` в корне проекта — они тестируют приложение целиком, а не отдельные компоненты:

```
e2e/
├── example.spec.ts
└── auth.spec.ts
```

### Базовый пример

```ts
import { test, expect } from '@playwright/test'

test('главная страница открывается', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/App/)
  await expect(page.getByRole('main')).toBeVisible()
})
```

### Сценарий с навигацией

```ts
test('пользователь переходит в профиль', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Профиль' }).click()
  await expect(page).toHaveURL('/profile')
  await expect(page.getByRole('heading', { name: 'Мой профиль' })).toBeVisible()
})
```

### Заполнение форм

```ts
test('пользователь может войти', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('Email').fill('user@example.com')
  await page.getByLabel('Пароль').fill('секрет')
  await page.getByRole('button', { name: 'Войти' }).click()

  await expect(page).toHaveURL('/dashboard')
})
```

### Как искать элементы

```ts
// По роли — предпочтительно
page.getByRole('button', { name: 'Войти' })

// По тексту
page.getByText('Добро пожаловать')

// По label
page.getByLabel('Email')

// По placeholder
page.getByPlaceholder('Введите email')

// По test-id — крайний случай
page.getByTestId('submit-btn')
```

### Проверки состояния

```ts
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveTitle('Панель управления')
await expect(page.getByRole('heading')).toBeVisible()
await expect(page.getByRole('heading')).toHaveText('Заголовок')
await expect(page.getByRole('button')).toBeDisabled()
await expect(page.getByText('Ошибка')).not.toBeVisible()
```

### Playwright UI Mode

Для разработки и отладки тестов запускай интерактивный UI:

```bash
pnpm test:e2e:ui
```

Показывает браузер в реальном времени, дерево тестов, каждый шаг и скриншоты — намного удобнее чем читать логи в терминале.

### Запуск

```bash
pnpm test:e2e           # Без браузера, режим CI
pnpm test:e2e:ui        # Интерактивный UI для разработки
pnpm test:e2e:report    # Открыть HTML-отчёт последнего прогона
```

Playwright автоматически поднимает `next dev` перед запуском тестов (настроено в [`playwright.config.ts`](../playwright.config.ts)). Если dev-сервер уже запущен — переиспользует его.

---

## Полезные ссылки

### Jest + Testing Library

- [Testing Library: введение](https://testing-library.com/docs/react-testing-library/intro)
- [Приоритет запросов — какой метод выбрать](https://testing-library.com/docs/queries/about#priority)
- [userEvent API](https://testing-library.com/docs/user-event/intro)
- [Все матчеры jest-dom](https://github.com/testing-library/jest-dom#custom-matchers)
- [Jest: документация](https://jestjs.io/docs/getting-started)

### Playwright

- [Документация Playwright](https://playwright.dev/docs/intro)
- [Локаторы](https://playwright.dev/docs/locators)
- [Проверки состояния](https://playwright.dev/docs/test-assertions)
- [UI Mode](https://playwright.dev/docs/test-ui-mode)
- [Лучшие практики](https://playwright.dev/docs/best-practices)
