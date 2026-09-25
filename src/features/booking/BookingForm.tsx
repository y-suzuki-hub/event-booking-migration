import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useEffect, useState, type FormEvent } from 'react'
import styled from 'styled-components'
import { useCreateReservationMutation } from '../../api/eventsApi'
import type { ApiError, EventItem, Reservation } from '../../api/types'
import { Button, Notice, SelectField, TextField } from '../../design-system'
import { maxSelectableSeats } from '../../domain/capacity'
import type { FieldErrors } from '../../domain/validation'
import { useBookingForm } from './useBookingForm'

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space(4)};
`

const Actions = styled.div`
  margin-top: ${({ theme }) => theme.space(3)};
`

function isFetchError(error: unknown): error is FetchBaseQueryError & { data?: ApiError & { errors?: FieldErrors } } {
  return typeof error === 'object' && error !== null && 'status' in error
}

export function BookingForm({ event }: { event: EventItem }) {
  const form = useBookingForm()
  const [createReservation, { isLoading }] = useCreateReservationMutation()
  const [completed, setCompleted] = useState<Reservation | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const maxSeats = maxSelectableSeats(event)

  // 他の申込で残席が減り、選択中の人数が上限を超えた場合は上限に合わせる
  const { setField } = form
  const selectedSeats = form.values.seats
  useEffect(() => {
    if (maxSeats > 0 && selectedSeats > maxSeats) setField('seats', maxSeats)
  }, [maxSeats, selectedSeats, setField])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!form.trySubmit()) return

    try {
      const reservation = await createReservation({ eventId: event.id, ...form.values }).unwrap()
      setCompleted(reservation)
      form.reset()
    } catch (error) {
      if (isFetchError(error) && error.status === 409) {
        setSubmitError(error.data?.message ?? '残席が不足しています')
      } else if (isFetchError(error) && error.status === 422 && error.data?.errors) {
        form.setServerErrors(error.data.errors)
      } else {
        setSubmitError('通信に失敗しました。時間をおいて再度お試しください。')
      }
    }
  }

  if (completed) {
    return (
      <Notice $tone="success" role="status">
        お申し込みを受け付けました（受付番号 {completed.id}／{completed.seats}名）。
        <Actions>
          <Button variant="secondary" onClick={() => setCompleted(null)}>
            続けて申し込む
          </Button>
        </Actions>
      </Notice>
    )
  }

  return (
    <Form onSubmit={handleSubmit} noValidate aria-label="予約フォーム">
      {submitError && (
        <Notice $tone="danger" role="alert">
          {submitError}
        </Notice>
      )}
      <TextField
        label="お名前"
        autoComplete="name"
        value={form.values.name}
        error={form.errors.name}
        onChange={(e) => form.setField('name', e.target.value)}
      />
      <TextField
        label="メールアドレス"
        type="email"
        autoComplete="email"
        inputMode="email"
        value={form.values.email}
        error={form.errors.email}
        onChange={(e) => form.setField('email', e.target.value)}
      />
      <SelectField
        label="人数"
        value={form.values.seats}
        error={form.errors.seats}
        onChange={(e) => form.setField('seats', Number(e.target.value))}
      >
        {Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}名
          </option>
        ))}
      </SelectField>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '送信中…' : '申し込む'}
      </Button>
    </Form>
  )
}
