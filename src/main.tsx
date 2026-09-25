import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { App } from './App'
import { BASE_URL } from './appConfig'
import { markApiReady } from './api/ready'
import { theme } from './design-system'
import { createAppStore } from './store'
import './styles/app.scss'

const store = createAppStore()

import('./mocks/browser')
  .then(({ startMockApi }) => startMockApi())
  .then(markApiReady)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename={BASE_URL}>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
