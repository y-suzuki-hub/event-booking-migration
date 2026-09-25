import type { Meta, StoryObj } from '@storybook/react-vite'
import { CapacityBar } from './CapacityBar'

const meta = {
  title: 'Design System/CapacityBar',
  component: CapacityBar,
  args: { capacity: 20, reserved: 8 },
  argTypes: {
    capacity: { control: { type: 'number', min: 1 } },
    reserved: { control: { type: 'range', min: 0, max: 20 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          '残席を色と数値で示す。判定（受付中／残りわずか／満席）は domain/capacity.ts に集約しており、旧画面のjQueryプラグインと同じ結果になる。',
      },
    },
  },
} satisfies Meta<typeof CapacityBar>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {}
export const Few: Story = { args: { reserved: 17 } }
export const Closed: Story = { args: { reserved: 20 } }
