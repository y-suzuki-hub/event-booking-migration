import { render } from '@testing-library/react'
import $ from 'jquery'
import { ThemeProvider } from 'styled-components'
import { CapacityBar, theme } from '../design-system'
import { installCapacityBar } from './jquery.capacityBar'

beforeAll(() => installCapacityBar($))

beforeEach(() => {
  document.body.innerHTML = '<div id="widget"></div>'
})

describe('$.fn.capacityBar（移行前のjQueryプラグイン）', () => {
  it('残席と状態をテキストで描画し、meterの値を設定する', () => {
    $('#widget').capacityBar({ capacity: 10, reserved: 9 })

    expect($('#widget .capacity-bar__label').text()).toBe('残り 1 / 10席（残りわずか）')
    expect($('#widget [role="meter"]').attr('aria-valuenow')).toBe('9')
    expect($('#widget .capacity-bar__fill').hasClass('capacity-bar__fill--few')).toBe(true)
  })

  it('再適用しても要素が増えず、最新の値で描き直す', () => {
    $('#widget').capacityBar({ capacity: 10, reserved: 1 }).capacityBar({ capacity: 10, reserved: 10 })

    expect($('#widget .capacity-bar__track')).toHaveLength(1)
    expect($('#widget .capacity-bar__label').text()).toBe('残り 0 / 10席（満席・受付終了）')
  })

  it("'destroy' で元の空要素に戻す", () => {
    $('#widget').capacityBar({ capacity: 10, reserved: 1 }).capacityBar('destroy')

    expect($('#widget').children()).toHaveLength(0)
    expect($('#widget').hasClass('capacity-bar')).toBe(false)
  })
})

// 移行中は新旧の表示が混在するため、同じデータで同じ結果になることを保証しておく
describe('jQuery版とReact版の表示が一致する', () => {
  it.each([
    { capacity: 20, reserved: 0 },
    { capacity: 20, reserved: 16 },
    { capacity: 20, reserved: 19 },
    { capacity: 20, reserved: 20 },
  ])('定員$capacity・申込$reserved', ({ capacity, reserved }) => {
    $('#widget').capacityBar({ capacity, reserved })
    const jqueryRemaining = $('#widget .capacity-bar__label').text().match(/残り (\d+)/)?.[1]

    const { container } = render(
      <ThemeProvider theme={theme}>
        <CapacityBar capacity={capacity} reserved={reserved} />
      </ThemeProvider>,
    )
    const reactRemaining = container.querySelector('strong')?.textContent

    expect(reactRemaining).toBe(jqueryRemaining)
    expect(container.querySelector('[role="meter"]')?.getAttribute('aria-valuenow')).toBe(
      $('#widget [role="meter"]').attr('aria-valuenow'),
    )
  })
})
