import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectField, TextField } from './Field'

const meta = {
  title: 'Design System/Field',
  component: TextField,
  args: { label: 'お名前', placeholder: '鈴木 花子' },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  args: { error: 'お名前を入力してください' },
  parameters: {
    docs: {
      description: { story: 'エラー時は aria-invalid と aria-describedby を付け、読み上げでも内容が伝わるようにする。' },
    },
  },
}

export const Select: Story = {
  render: () => (
    <SelectField label="人数" defaultValue="1">
      {[1, 2, 3, 4].map((n) => (
        <option key={n} value={n}>
          {n}名
        </option>
      ))}
    </SelectField>
  ),
}
