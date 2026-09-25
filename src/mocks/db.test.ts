import { findEvent, reserve, resetDb } from './db'

const valid = { name: '鈴木 花子', email: 'hanako@example.com', seats: 2 }

describe('reserve（モックサーバーの予約処理）', () => {
  beforeEach(() => {
    resetDb([
      {
        id: 'e1',
        title: 'テスト',
        category: 'seminar',
        startsAt: '2026-10-01T10:00:00+09:00',
        venue: '会議室',
        capacity: 5,
        reserved: 3,
        descriptionHtml: '',
      },
    ])
  })

  it('申込数を加算して予約を返す', () => {
    const result = reserve('e1', valid)
    expect(result.ok).toBe(true)
    expect(findEvent('e1')?.reserved).toBe(5)
  })

  it('定員に達した後の申込は 409 で断る（自動締切）', () => {
    reserve('e1', valid)
    const result = reserve('e1', { ...valid, seats: 1 })
    expect(result).toMatchObject({ ok: false, status: 409, remaining: 0 })
    expect(findEvent('e1')?.reserved).toBe(5)
  })

  it('残席を超える人数は 409 で断り、申込数を変えない', () => {
    const result = reserve('e1', { ...valid, seats: 3 })
    expect(result).toMatchObject({ ok: false, status: 409, remaining: 2 })
    expect(findEvent('e1')?.reserved).toBe(3)
  })

  it('クライアントの検証を経ずに届いた不正な入力は 422 で断る', () => {
    const result = reserve('e1', { name: ' ', email: 'not-an-email', seats: 9 })
    expect(result).toMatchObject({ ok: false, status: 422 })
    if (!result.ok && result.status === 422) {
      expect(Object.keys(result.errors).sort()).toEqual(['email', 'name', 'seats'])
    }
  })

  it('存在しないイベントは 404', () => {
    expect(reserve('nope', valid)).toEqual({ ok: false, status: 404 })
  })
})
