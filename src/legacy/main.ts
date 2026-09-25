import $ from 'jquery'
import { eventsApi } from '../api/eventsApi'
import { markApiReady } from '../api/ready'
import type { EventItem } from '../api/types'
import { BASE_URL } from '../appConfig'
import { formatEventDate } from '../lib/format'
import { createAppStore } from '../store'
import { capacityWidgetSwitched, type WidgetImpl } from '../store/migrationSlice'
import { installCapacityBar } from './jquery.capacityBar'
import { mountCapacityIsland } from './mountIsland'
import './legacy.scss'

const FLAG_KEY = 'ebm:capacityWidget'

function readFlag(): WidgetImpl {
  try {
    return localStorage.getItem(FLAG_KEY) === 'jquery' ? 'jquery' : 'react'
  } catch {
    return 'react'
  }
}

function saveFlag(impl: WidgetImpl) {
  try {
    localStorage.setItem(FLAG_KEY, impl)
  } catch {
    // 保存できなくても、このページ内の切り替えは効く
  }
}

const IMPL_NOTE: Record<WidgetImpl, string> = {
  react: '残席表示はReactコンポーネント（src/design-system/CapacityBar.tsx）で描画しています。',
  jquery: '残席表示はjQueryプラグイン（src/legacy/jquery.capacityBar.ts）で描画しています。移行前の状態です。',
}

installCapacityBar($)
const store = createAppStore({ migration: { capacityWidget: readFlag() } })
const selectEvents = eventsApi.endpoints.getEvents.select()

let unmountIslands: Array<() => void> = []
let renderedIds = ''
let renderedImpl: WidgetImpl | null = null

function buildRows(events: EventItem[], impl: WidgetImpl) {
  unmountIslands.forEach((unmount) => unmount())
  unmountIslands = []

  const $rows = $('#event-rows').empty()
  for (const event of events) {
    const $slot = $('<div>', { class: 'event-table__capacity', 'data-event-id': event.id })
    // 移行前は $row.html('<td>' + event.title + '</td>…') と文字列連結で組み立てており、
    // タイトルにHTMLが含まれるとそのまま実行されていた。移行に合わせて .text() に統一した
    $rows.append(
      $('<tr>').append(
        $('<td>').append(
          $('<a>', { href: `${BASE_URL}events/${encodeURIComponent(event.id)}` }).text(event.title),
        ),
        $('<td>').text(formatEventDate(event.startsAt)),
        $('<td>').text(event.venue),
        $('<td>').append($slot),
      ),
    )
    if (impl === 'react') unmountIslands.push(mountCapacityIsland($slot[0]!, store, event.id))
  }
}

function updateJqueryWidgets(events: EventItem[]) {
  for (const event of events) {
    $(`.event-table__capacity[data-event-id="${CSS.escape(event.id)}"]`).capacityBar({
      capacity: event.capacity,
      reserved: event.reserved,
    })
  }
}

function sync() {
  const state = store.getState()
  const { data, isError } = selectEvents(state)
  const impl = state.migration.capacityWidget

  $('#impl-note').text(IMPL_NOTE[impl])
  $(`input[name="impl"][value="${impl}"]`).prop('checked', true)

  if (isError) {
    $('#legacy-status').text('イベントを読み込めませんでした。').prop('hidden', false)
    return
  }
  if (!data) return
  $('#legacy-status').prop('hidden', true)

  const ids = data.map((e) => e.id).join(',')
  if (ids !== renderedIds || impl !== renderedImpl) {
    buildRows(data, impl)
    renderedIds = ids
    renderedImpl = impl
  }
  // React版は自分でストアを購読して更新される。jQuery版だけ明示的に描き直す
  if (impl === 'jquery') updateJqueryWidgets(data)
}

// ストア更新はReactの描画中にも届くため、Reactルートのunmountが描画と重ならないよう次のマイクロタスクへ回す
let scheduled = false
store.subscribe(() => {
  if (scheduled) return
  scheduled = true
  queueMicrotask(() => {
    scheduled = false
    sync()
  })
})

$('input[name="impl"]').on('change', function () {
  const impl = $(this).val() === 'jquery' ? 'jquery' : 'react'
  saveFlag(impl)
  store.dispatch(capacityWidgetSwitched(impl))
})

import('../mocks/browser')
  .then(({ startMockApi }) => startMockApi())
  .then(markApiReady)

store.dispatch(eventsApi.endpoints.getEvents.initiate())
sync()
