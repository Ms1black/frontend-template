# SCSS и миксины

В проекте используются [CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules) в связке с SCSS. Каждый компонент имеет свой изолированный файл стилей `.module.scss` — классы не пересекаются между компонентами, конфликты невозможны.

Общие переменные, миксины и брейкпоинты лежат в `src/shared/styles/` и подключаются в каждый модуль через `@use`.

---

## Структура

```
shared/styles/
├── _variables.scss     # Цвета, типографика, отступы, тени, переходы
├── _mixins.scss        # Переиспользуемые миксины
├── _breakpoints.scss   # Брейкпоинты и миксины для медиа-запросов
└── index.scss          # Точка входа — реэкспортирует всё через @forward
```

---

## Подключение в компоненте

```scss
@use '@shared/styles' as *;

.root {
  padding: $space-4;           // переменная
  @include flex(center);       // миксин
  @include from('md') { ... }  // брейкпоинт
}
```

Одна строка `@use '@shared/styles' as *` даёт доступ ко всем переменным и миксинам.

---

## Переменные

### Цвета

```scss
$color-primary         // #3b82f6 — основной акцент
$color-primary-hover   // #2563eb
$color-secondary       // #6b7280
$color-danger          // #ef4444
$color-success         // #22c55e
$color-warning         // #f59e0b

$color-text            // #111827 — основной текст
$color-text-muted      // #6b7280 — второстепенный текст
$color-bg              // #ffffff — фон
$color-bg-muted        // #f9fafb — приглушённый фон
$color-border          // #e5e7eb — граница
```

### Типографика

```scss
$font-size-xs: 0.75rem; // 12px
$font-size-sm: 0.875rem; // 14px
$font-size-base: 1rem; // 16px
$font-size-lg: 1.125rem; // 18px
$font-size-xl: 1.25rem; // 20px
$font-size-2xl: 1.5rem; // 24px

$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Отступы

Шкала отступов кратна `0.25rem` (4px):

```scss
$space-1: 0.25rem; // 4px
$space-2: 0.5rem; // 8px
$space-3: 0.75rem; // 12px
$space-4: 1rem; // 16px
$space-5: 1.25rem; // 20px
$space-6: 1.5rem; // 24px
$space-8: 2rem; // 32px
$space-10: 2.5rem; // 40px
$space-12: 3rem; // 48px
$space-16: 4rem; // 64px
```

### Остальное

```scss
// Скругления
$radius-sm: 0.25rem;
$radius-md: 0.375rem;
$radius-lg: 0.5rem;
$radius-full: 9999px;

// Тени
$shadow-sm: ...;
$shadow-md: ...;
$shadow-lg: ...;

// Переходы
$transition-fast: 150ms ease;
$transition-base: 250ms ease;
$transition-slow: 400ms ease;

// Z-индексы
$z-dropdown: 100;
$z-modal: 200;
$z-toast: 300;
```

---

## Миксины

### Флексбокс

```scss
// @include flex($align, $justify, $direction, $wrap)
.container {
  @include flex(center, space-between);
}

// Колонка
.sidebar {
  @include flex-col(stretch, flex-start);
}
```

### Grid

```scss
// @include grid($cols, $gap)
.grid {
  @include grid(3, $space-6);
}
```

### Обрезка текста

```scss
// Одна строка с многоточием
.title {
  @include truncate;
}

// Несколько строк с многоточием
.description {
  @include line-clamp(3);
}
```

### Переходы

```scss
// @include transition($properties...)
.button {
  @include transition(background-color, box-shadow);
}
```

### Позиционирование

```scss
// Абсолютно по центру родителя
.icon {
  @include center-absolute;
}

// Растянуть на весь родительский блок
.overlay {
  @include cover;
}
```

### Сброс стилей

```scss
.nav {
  @include reset-list; // убирает list-style, margin, padding у ul/ol
}

.iconButton {
  @include reset-button; // убирает border, background, padding у button
}
```

### Доступность

```scss
// Скрыто визуально, но доступно скринридерам
.srOnly {
  @include visually-hidden;
}
```

### Тёмная тема

```scss
.card {
  background: $color-bg;

  @include dark {
    background: #1f2937;
  }
}
```

---

## Брейкпоинты

Брейкпоинты используют подход **mobile-first**: базовые стили — для мобильных, расширения через `from()`.

| Название | Значение |
| -------- | -------- |
| `sm`     | 640px    |
| `md`     | 768px    |
| `lg`     | 1024px   |
| `xl`     | 1280px   |
| `2xl`    | 1536px   |

```scss
.card {
  padding: $space-4; // мобильные

  @include from('md') {
    padding: $space-6; // планшеты и шире
  }

  @include from('lg') {
    padding: $space-8; // десктоп
  }
}

// Только до определённого брейкпоинта
.mobileOnly {
  @include to('md') {
    display: none;
  }
}

// Между двумя брейкпоинтами
.tabletOnly {
  @include between('md', 'lg') {
    font-size: $font-size-lg;
  }
}
```

---

## Пример компонента

```scss
// ComponentName.module.scss
@use '@shared/styles' as *;

.root {
  @include flex(center, flex-start);
  gap: $space-2;
  padding: $space-3 $space-4;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  @include transition(background-color, border-color);

  &:hover {
    background-color: $color-bg-muted;
    border-color: $color-primary;
  }

  @include from('md') {
    padding: $space-4 $space-6;
  }
}

.label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text;
  @include truncate;
}
```

```tsx
// ComponentName.tsx
import styles from './ComponentName.module.scss'

export const ComponentName = ({ label }: { label: string }) => (
  <div className={styles.root}>
    <span className={styles.label}>{label}</span>
  </div>
)
```

---

## Соглашения

- Один файл `*.module.scss` на компонент, рядом с ним
- Называть классы в **camelCase**: `.root`, `.label`, `.primaryButton`
- Корневой элемент компонента — всегда класс `.root`
- Не вкладывать селекторы глубже двух уровней
- Не использовать глобальные классы — только модули

---

## Полезные ссылки

- [CSS Modules в Next.js](https://nextjs.org/docs/app/building-your-application/styling/css-modules)
- [SCSS документация](https://sass-lang.com/documentation)
- [SCSS @use и @forward](https://sass-lang.com/documentation/at-rules/use)
- [SCSS миксины](https://sass-lang.com/documentation/at-rules/mixin)
