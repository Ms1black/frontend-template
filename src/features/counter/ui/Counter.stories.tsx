import type { Meta, StoryObj } from '@storybook/react'
import { Counter } from './Counter'

const meta: Meta<typeof Counter> = {
  component: Counter,
  title: 'features/counter/Counter',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Counter>

export const Default: Story = {}
