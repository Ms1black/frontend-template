import type { StorybookConfig } from '@storybook/nextjs'
import { resolve } from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal(config) {
    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@app': resolve(__dirname, '../src/app'),
      '@pages': resolve(__dirname, '../src/pages'),
      '@widgets': resolve(__dirname, '../src/widgets'),
      '@features': resolve(__dirname, '../src/features'),
      '@entities': resolve(__dirname, '../src/entities'),
      '@shared': resolve(__dirname, '../src/shared'),
    }
    return config
  },
}

export default config
