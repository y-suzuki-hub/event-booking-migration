import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { theme } from './theme'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`

const Swatch = styled.div`
  font-size: 12px;

  div {
    height: 56px;
    margin-bottom: 6px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
  }
`

function ColorTokens() {
  return (
    <Grid>
      {Object.entries(theme.color).map(([name, value]) => (
        <Swatch key={name}>
          <div style={{ background: value }} />
          <strong>{name}</strong>
          <br />
          <code>{value}</code>
        </Swatch>
      ))}
    </Grid>
  )
}

const meta = {
  title: 'Design System/Tokens',
  component: ColorTokens,
  parameters: {
    docs: {
      description: {
        component:
          '値の一次情報は src/styles/_tokens.scss。SassでCSS変数として出力し、styled-components（theme.ts）と旧画面のSassが同じ変数を参照する。',
      },
    },
  },
} satisfies Meta<typeof ColorTokens>

export default meta

export const Colors: StoryObj<typeof meta> = {}
