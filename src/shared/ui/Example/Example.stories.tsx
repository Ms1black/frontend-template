import type { Meta, StoryObj } from '@storybook/react'
import { Example } from './Example'

const meta: Meta<typeof Example> = {
  component: Example,
  title: 'shared/ui/Example',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Example>

export const Default: Story = {
  args: { label: 'Example component' },
}

export const WithBadge: Story = {
  args: { label: 'Example component', badge: 'New' },
}

export const LongLabel: Story = {
  args: {
    label: 'This is a very long label that should be truncated by the truncate mixin',
    badge: '99+',
  },
}
