import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusBadge } from './StatusBadge'

const meta = {
  title: 'Design System/StatusBadge',
  component: StatusBadge,
  argTypes: { status: { control: 'inline-radio', options: ['open', 'few', 'closed'] } },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = { args: { status: 'open' } }
export const Few: Story = { args: { status: 'few' } }
export const Closed: Story = { args: { status: 'closed' } }
