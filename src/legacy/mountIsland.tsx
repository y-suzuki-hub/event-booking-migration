import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { theme } from '../design-system'
import type { AppStore } from '../store'
import { LiveCapacityBar } from './LiveCapacityBar'

// 旧画面のDOMの一部にだけReactを差し込む（ストラングラー方式）。
// ストアは旧画面と共有するので、申込による残席の変化もそのまま反映される
export function mountCapacityIsland(container: HTMLElement, store: AppStore, eventId: string): () => void {
  const root = createRoot(container)
  root.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LiveCapacityBar eventId={eventId} />
      </ThemeProvider>
    </Provider>,
  )
  return () => root.unmount()
}
