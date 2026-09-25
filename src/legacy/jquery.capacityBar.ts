import { capacityStatus, remainingSeats, STATUS_LABEL } from '../domain/capacity'

export type CapacityBarOptions = { capacity: number; reserved: number }

declare global {
  interface JQuery {
    capacityBar(options: CapacityBarOptions | 'destroy'): this
  }
}

// 移行前から使われている残席表示プラグイン。
// 判定ロジックは domain/capacity.ts に切り出し、React版の CapacityBar と共有している。
// これにより「表示の実装」だけを差し替えられ、判定結果が新旧でずれない。
export function installCapacityBar($: JQueryStatic) {
  $.fn.capacityBar = function (this: JQuery, options: CapacityBarOptions | 'destroy') {
    return this.each(function () {
      const $root = $(this)
      if (options === 'destroy') {
        $root.empty().removeClass('capacity-bar')
        return
      }

      const { capacity, reserved } = options
      const status = capacityStatus(options)
      const ratio = capacity === 0 ? 1 : Math.min(1, reserved / capacity)

      const $fill = $('<div>', { class: `capacity-bar__fill capacity-bar__fill--${status}` }).css(
        'transform',
        `scaleX(${ratio})`,
      )
      const $track = $('<div>', {
        class: 'capacity-bar__track',
        role: 'meter',
        'aria-label': '申込状況',
        'aria-valuemin': 0,
        'aria-valuemax': capacity,
        'aria-valuenow': reserved,
      }).append($fill)
      const $label = $('<p>', { class: 'capacity-bar__label' }).text(
        `残り ${remainingSeats(options)} / ${capacity}席（${STATUS_LABEL[status]}）`,
      )

      $root.addClass('capacity-bar').empty().append($track, $label)
    })
  }
}
