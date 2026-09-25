import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/render'
import { EventListPage } from './EventListPage'

describe('イベント一覧', () => {
  it('絞り込み条件をReduxに保持し、結果の件数を更新する', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<EventListPage />)

    expect(await screen.findByText('6件のイベント')).toBeInTheDocument()

    await user.click(screen.getByLabelText('受付中のみ'))
    expect(screen.getByText('5件のイベント')).toBeInTheDocument()
    expect(store.getState().filters.onlyAvailable).toBe(true)

    await user.selectOptions(screen.getByLabelText('カテゴリ'), 'kids')
    expect(screen.getByText('2件のイベント')).toBeInTheDocument()
  })

  it('該当なしのときは条件クリアを案内する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EventListPage />)
    await screen.findByText('6件のイベント')

    await user.type(screen.getByLabelText('キーワード'), '存在しないイベント')
    expect(screen.getByText('条件に合うイベントはありません。')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '条件をクリア' }))
    expect(screen.getByText('6件のイベント')).toBeInTheDocument()
    expect(screen.getByLabelText('キーワード')).toHaveValue('')
  })
})
