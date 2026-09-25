import '@testing-library/jest-dom'
import { markApiReady } from '../api/ready'
import { resetDb } from '../mocks/db'
import { server } from './server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
  markApiReady()
})
beforeEach(() => resetDb())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
