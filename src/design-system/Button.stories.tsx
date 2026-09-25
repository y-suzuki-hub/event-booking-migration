import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: 'Design System/Button',
  component: Button,
  args: { children: '申し込む' },
  argTypes: { variant: { control: 'inline-radio', options: ['primary', 'secondary'] } },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary', children: '条件をクリア' } }
export const Disabled: Story = { args: { disabled: true, children: '送信中…' } }
