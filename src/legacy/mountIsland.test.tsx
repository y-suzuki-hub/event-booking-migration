import { act, waitFor } from '@testing-library/react'
import { eventsApi } from '../api/eventsApi'
import { createAppStore } from '../store'
import { mountCapacityIsland } from './mountIsland'

describe('mountCapacityIsland（旧画面に差し込むReact部品）', () => {
  it('旧画面と共有したストアの更新に追従して残席を描き直す', async () => {
    const store = createAppStore()
    // 旧画面側（jQuery）がAPIを購読している状態を再現する
    const subscription = store.dispatch(eventsApi.endpoints.getEvents.initiate())
    await subscription

    const container = document.createElement('div')
    document.body.append(container)
    let unmount = () => {}
    act(() => {
      unmount = mountCapacityIsland(container, store, 'ev-101')
    })

    expect(container.querySelector('[role="meter"]')).toHaveAttribute('aria-valuenow', '17')

    await act(async () => {
      await store.dispatch(
        eventsApi.endpoints.createReservation.initiate({
          eventId: 'ev-101',
          name: '鈴木 花子',
          email: 'hanako@example.com',
          seats: 2,
        }),
      )
    })

    await waitFor(() => expect(container.querySelector('[role="meter"]')).toHaveAttribute('aria-valuenow', '19'))

    act(() => unmount())
    subscription.unsubscribe()
    expect(container).toBeEmptyDOMElement()
  })
})
