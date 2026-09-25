import type { ReservationInput } from '../api/types'
import { MAX_SEATS_PER_RESERVATION } from './capacity'

export type FieldErrors = Partial<Record<keyof ReservationInput, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// クライアントとモックサーバーの両方で同じ規則を使う（サーバー側でも必ず再検証する）
export function validateReservation(input: ReservationInput): FieldErrors {
  const errors: FieldErrors = {}
  const name = input.name.trim()
  if (!name) errors.name = 'お名前を入力してください'
  else if (name.length > 40) errors.name = 'お名前は40文字以内で入力してください'

  if (!input.email.trim()) errors.email = 'メールアドレスを入力してください'
  else if (!EMAIL_PATTERN.test(input.email.trim())) errors.email = 'メールアドレスの形式が正しくありません'

  if (!Number.isInteger(input.seats) || input.seats < 1 || input.seats > MAX_SEATS_PER_RESERVATION) {
    errors.seats = `人数は1〜${MAX_SEATS_PER_RESERVATION}名で選択してください`
  }
  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}
