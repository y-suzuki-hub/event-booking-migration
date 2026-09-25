import { seedEvents } from '../../mocks/seed'
import type { FiltersState } from '../../store/filtersSlice'
import { selectVisibleEvents } from './selectVisibleEvents'

const none: FiltersState = { keyword: '', category: 'all', onlyAvailable: false }
const ids = (filters: Partial<FiltersState>) => selectVisibleEvents(seedEvents, { ...none, ...filters }).map((e) => e.id)

describe('selectVisibleEvents', () => {
  it('条件なしなら全件', () => {
    expect(ids({})).toHaveLength(seedEvents.length)
  })

  it('カテゴリで絞り込む', () => {
    expect(ids({ category: 'kids' })).toEqual(['ev-101', 'ev-104'])
  })

  it('受付中のみ → 満席のイベントを除く', () => {
    expect(ids({ onlyAvailable: true })).not.toContain('ev-103')
  })

  it('キーワードはタイトルと会場の両方を対象にし、前後の空白を無視する', () => {
    expect(ids({ keyword: '  パン ' })).toEqual(['ev-106'])
    expect(ids({ keyword: '屋上' })).toEqual(['ev-103'])
  })

  it('条件は掛け合わせる', () => {
    expect(ids({ category: 'workshop', onlyAvailable: true })).toEqual(['ev-106'])
  })
})
