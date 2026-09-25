import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from 'styled-components'
import { theme } from '../src/design-system'
import '../src/styles/app.scss'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <div style={{ padding: 24, maxWidth: 480 }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
}

export default preview
