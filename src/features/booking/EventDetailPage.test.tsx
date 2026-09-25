import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reserve } from '../../mocks/db'
import { renderWithProviders } from '../../test/render'
import { EventDetailPage } from './EventDetailPage'

function renderDetail(eventId: string) {
  return renderWithProviders(<EventDetailPage />, { route: `/events/${eventId}`, path: '/events/:eventId' })
}

async function fillForm(user: ReturnType<typeof userEvent.setup>, seats: number) {
  await user.type(screen.getByLabelText('お名前'), '鈴木 花子')
  await user.type(screen.getByLabelText('メールアドレス'), 'hanako@example.com')
  await user.selectOptions(screen.getByLabelText('人数'), String(seats))
}

describe('イベント詳細・予約', () => {
  it('未入力で送信するとエラーを表示し、項目を aria-invalid にする', async () => {
    const user = userEvent.setup()
    renderDetail('ev-102')

    await user.click(await screen.findByRole('button', { name: '申し込む' }))

    expect(screen.getByText('お名前を入力してください')).toBeInTheDocument()
    expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
    expect(screen.getByLabelText('お名前')).toHaveAttribute('aria-invalid', 'true')
  })

  it('申し込むと受付番号を表示し、残席表示が更新される', async () => {
    const user = userEvent.setup()
    renderDetail('ev-101') // 定員20・申込17

    await screen.findByRole('form', { name: '予約フォーム' })
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '17')

    await fillForm(user, 2)
    await user.click(screen.getByRole('button', { name: '申し込む' }))

    expect(await screen.findByText(/お申し込みを受け付けました/)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '19'))
  })

  it('入力中に他の申込で残席が減った場合、409の理由を伝え、選べる人数を残席に合わせる', async () => {
    const user = userEvent.setup()
    renderDetail('ev-101') // 残り3

    await screen.findByRole('form', { name: '予約フォーム' })
    await fillForm(user, 3)
    reserve('ev-101', { name: '別の利用者', email: 'other@example.com', seats: 2 }) // 残り1になる

    await user.click(screen.getByRole('button', { name: '申し込む' }))

    expect(await screen.findByText('残席が1席のため、3名ではお申し込みいただけません')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('人数')).toHaveValue('1'))
  })

  it('入力中に満席になった場合は、フォームを閉じて受付終了を表示する', async () => {
    const user = userEvent.setup()
    renderDetail('ev-101')

    await screen.findByRole('form', { name: '予約フォーム' })
    await fillForm(user, 1)
    reserve('ev-101', { name: '別の利用者', email: 'other@example.com', seats: 3 })

    await user.click(screen.getByRole('button', { name: '申し込む' }))

    expect(await screen.findByText('定員に達したため、受付を終了しました。')).toBeInTheDocument()
    expect(screen.queryByRole('form', { name: '予約フォーム' })).not.toBeInTheDocument()
  })

  it('満席のイベントはフォームを出さない', async () => {
    renderDetail('ev-103')
    expect(await screen.findByText('定員に達したため、受付を終了しました。')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '申し込む' })).not.toBeInTheDocument()
  })
})
