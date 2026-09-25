import { setupWorker } from 'msw/browser'
import { BASE_URL } from '../appConfig'
import { createHandlers } from './handlers'

// デモはバックエンドを持たないため、本番ビルドでもService WorkerでAPIを再現する
export async function startMockApi() {
  const worker = setupWorker(...createHandlers({ latency: 350 }))
  await worker.start({
    serviceWorker: { url: `${BASE_URL}mockServiceWorker.js` },
    onUnhandledRequest: 'bypass',
    quiet: true,
  })
}
