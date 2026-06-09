import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Документация/Введение',
  parameters: { layout: 'fullscreen' },
}

export default meta

const layers = [
  {
    alias: '@shared',
    path: 'src/shared/',
    desc: 'UI-примитивы, утилиты, конфиги — без бизнес-логики',
  },
  { alias: '@entities', path: 'src/entities/', desc: 'Бизнес-сущности: модели, типы, базовый UI' },
  { alias: '@features', path: 'src/features/', desc: 'Фичи с логикой, хуками и состоянием' },
  { alias: '@widgets', path: 'src/widgets/', desc: 'Составные блоки — несколько фич вместе' },
  { alias: '@views', path: 'src/views/', desc: 'Страницы — композиция виджетов' },
  {
    alias: '@app',
    path: 'src/app/',
    desc: 'Next.js App Router: layout, providers, глобальные стили',
  },
]

const rules = [
  { text: 'title повторяет путь к файлу: shared/ui/Button' },
  { text: 'Каждый компонент имеет хотя бы Default story' },
  { text: "tags: ['autodocs'] — документация из TypeScript-типов" },
  { text: 'Импорты только вниз по слоям FSD — никогда вверх' },
]

const tags = ['Next.js 15', 'React 19', 'TypeScript', 'SCSS Modules', 'Storybook 10']

export const Введение: StoryObj = {
  render: () => (
    <div
      style={{
        fontFamily: "'Roboto', system-ui, sans-serif",
        background: '#ffffff',
        minHeight: '100vh',
        color: '#0a0a0a',
      }}
    >
      {/* Hero */}
      <div style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '72px 48px 64px',
            display: 'flex',
            alignItems: 'center',
            gap: '48px',
          }}
        >
          <div style={{ flex: '1', minWidth: 0 }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#2563eb', margin: '0 0 16px' }}>
              Feature-Sliced Design
            </p>
            <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.1 }}>
              UI Библиотека проекта
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 28px', lineHeight: 1.7 }}>
              Компоненты на основе Next.js 15 + FSD.
              <br />
              Здесь живут все переиспользуемые элементы интерфейса.
            </p>
            <div
              style={{
                display: 'inline-block',
                background: '#38bdf8',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 500,
                padding: '8px 18px',
                borderRadius: '999px',
                marginBottom: '28px',
                lineHeight: 1.4,
              }}
            >
              жесткая мотивирубщая фраза
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {tags.map((label) => (
                <span
                  key={label}
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '3px 10px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#374151',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ flexShrink: 0, width: '160px' }}>
            <img src="/17.png" alt="" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '56px 48px 80px' }}>
        {/* Layers */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>
            Архитектурные слои
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1px',
              background: '#e5e7eb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            {layers.map(({ alias, path, desc }) => (
              <div key={alias} style={{ background: '#fff', padding: '16px 20px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px',
                    marginBottom: '6px',
                  }}
                >
                  <code style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>
                    {alias}
                  </code>
                  <code style={{ fontSize: '11px', color: '#9ca3af' }}>{path}</code>
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Code example */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>Пример story</h2>

          <div
            style={{
              background: '#0f1c3f',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                padding: '10px 20px',
                background: '#1a2d5a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#ff5f57',
                }}
              />
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#febc2e',
                }}
              />
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#28c840',
                }}
              />
              <code style={{ fontSize: '12px', color: '#a5b4fc', marginLeft: '8px' }}>
                Button.stories.tsx
              </code>
            </div>
            <pre
              style={{
                margin: 0,
                padding: '24px',
                fontSize: '13px',
                lineHeight: 1.7,
                overflowX: 'auto',
                color: '#e2e8f0',
              }}
            >
              {`import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'shared/ui/Button',
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof Button> = {
  args: { label: 'Нажми меня', variant: 'primary' },
}

export const Secondary: StoryObj<typeof Button> = {
  args: { label: 'Отмена', variant: 'secondary' },
}`}
            </pre>
          </div>
        </section>

        {/* Rules */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>Соглашения</h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              background: '#e5e7eb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            {rules.map(({ text }) => (
              <div
                key={text}
                style={{
                  background: '#fff',
                  padding: '13px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  color: '#374151',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#2563eb',
                    flexShrink: 0,
                  }}
                />
                {text}
              </div>
            ))}
          </div>
        </section>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            paddingTop: '48px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          {/* <img src="/logo.png" alt="Логотип" style={{ height: '28px', display: 'block', opacity: 0.6 }} /> */}
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  ),
}
