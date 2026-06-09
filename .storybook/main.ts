import type { StorybookConfig } from '@storybook/nextjs-vite'
import { mergeConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  staticDirs: [{ from: './assets', to: '/' }],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@app': resolve(__dirname, '../src/app'),
          '@views': resolve(__dirname, '../src/views'),
          '@widgets': resolve(__dirname, '../src/widgets'),
          '@features': resolve(__dirname, '../src/features'),
          '@entities': resolve(__dirname, '../src/entities'),
          '@shared': resolve(__dirname, '../src/shared'),
        },
      },
    })
  },
}

export default config
