import { canBook, capacityStatus, maxSelectableSeats, remainingSeats } from './capacity'

describe('remainingSeats', () => {
  it('定員から申込数を引いた値を返す', () => {
    expect(remainingSeats({ capacity: 20, reserved: 17 })).toBe(3)
  })

  it('データ不整合で申込数が定員を超えていても負の値にしない', () => {
    expect(remainingSeats({ capacity: 10, reserved: 12 })).toBe(0)
  })
})

describe('capacityStatus', () => {
  it.each([
    { capacity: 10, reserved: 0, expected: 'open' },
    { capacity: 10, reserved: 7, expected: 'open' },
    { capacity: 10, reserved: 8, expected: 'few' }, // 残り2割ちょうど
    { capacity: 10, reserved: 9, expected: 'few' },
    { capacity: 10, reserved: 10, expected: 'closed' },
  ])('定員$capacity・申込$reserved → $expected', ({ capacity, reserved, expected }) => {
    expect(capacityStatus({ capacity, reserved })).toBe(expected)
  })
})

describe('canBook', () => {
  it('残席が足りれば申し込める', () => {
    expect(canBook({ capacity: 10, reserved: 7 }, 3)).toEqual({ ok: true })
  })

  it('満席なら closed を返す', () => {
    expect(canBook({ capacity: 10, reserved: 10 }, 1)).toEqual({ ok: false, reason: 'closed', remaining: 0 })
  })

  it('残席より多い人数は insufficient を返す', () => {
    expect(canBook({ capacity: 10, reserved: 8 }, 3)).toEqual({ ok: false, reason: 'insufficient', remaining: 2 })
  })
})

describe('maxSelectableSeats', () => {
  it('1回の上限（4名）と残席の小さい方になる', () => {
    expect(maxSelectableSeats({ capacity: 30, reserved: 0 })).toBe(4)
    expect(maxSelectableSeats({ capacity: 30, reserved: 28 })).toBe(2)
  })
})
