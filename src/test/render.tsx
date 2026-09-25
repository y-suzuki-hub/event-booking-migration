import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from '../design-system'
import { createAppStore, type AppStore } from '../store'

type Options = { route?: string; path?: string; store?: AppStore }

export function renderWithProviders(ui: ReactElement, { route = '/', path = '/', store = createAppStore() }: Options = {}) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path={path} element={ui} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>,
    ),
  }
}
