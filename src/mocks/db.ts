import type { EventItem, Reservation, ReservationInput } from '../api/types'
import { canBook } from '../domain/capacity'
import { hasErrors, validateReservation, type FieldErrors } from '../domain/validation'
import { seedEvents } from './seed'

type Db = { events: EventItem[]; reservations: Reservation[] }

// 旧画面（jQuery）と新画面（React）は別ページなので、予約結果をlocalStorageで共有する
const STORAGE_KEY = 'ebm:db:v1'

let db: Db = load()
let sequence = 0

function fresh(): Db {
  return { events: structuredClone(seedEvents), reservations: [] }
}

function load(): Db {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Db
  } catch {
    // プライベートモード等で読めない場合は初期データで動かす
  }
  return fresh()
}

function persist() {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    // 保存できなくても画面は動かす
  }
}

export function resetDb(events: EventItem[] = seedEvents) {
  db = { events: structuredClone(events), reservations: [] }
  persist()
}

export function listEvents(): EventItem[] {
  return [...db.events].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}

export function findEvent(id: string): EventItem | undefined {
  return db.events.find((e) => e.id === id)
}

export function listReservations(eventId?: string): Reservation[] {
  const list = eventId ? db.reservations.filter((r) => r.eventId === eventId) : db.reservations
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export type ReserveResult =
  | { ok: true; reservation: Reservation; event: EventItem }
  | { ok: false; status: 404 }
  | { ok: false; status: 409; message: string; remaining: number }
  | { ok: false; status: 422; errors: FieldErrors }

export function reserve(eventId: string, input: ReservationInput): ReserveResult {
  const event = findEvent(eventId)
  if (!event) return { ok: false, status: 404 }

  const errors = validateReservation(input)
  if (hasErrors(errors)) return { ok: false, status: 422, errors }

  const check = canBook(event, input.seats)
  if (!check.ok) {
    const message =
      check.reason === 'closed'
        ? 'このイベントは定員に達したため、受付を終了しました'
        : `残席が${check.remaining}席のため、${input.seats}名ではお申し込みいただけません`
    return { ok: false, status: 409, message, remaining: check.remaining }
  }

  event.reserved += input.seats
  const reservation: Reservation = {
    id: `R${Date.now().toString(36).toUpperCase()}${(sequence++).toString(36).toUpperCase()}`,
    eventId,
    name: input.name.trim(),
    email: input.email.trim(),
    seats: input.seats,
    createdAt: new Date().toISOString(),
  }
  db.reservations.push(reservation)
  persist()
  return { ok: true, reservation, event: { ...event } }
}
