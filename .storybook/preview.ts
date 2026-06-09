import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Документация', ['Введение'], '*'],
      },
    },
  },
}

export default preview
