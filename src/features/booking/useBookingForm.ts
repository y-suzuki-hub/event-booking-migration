import { useCallback, useReducer } from 'react'
import type { ReservationInput } from '../../api/types'
import { hasErrors, validateReservation, type FieldErrors } from '../../domain/validation'

type State = {
  values: ReservationInput
  errors: FieldErrors
  submitted: boolean
}

type Action =
  | { type: 'changed'; field: keyof ReservationInput; value: string | number }
  | { type: 'submitted' }
  | { type: 'serverErrors'; errors: FieldErrors }
  | { type: 'reset' }

const initialState: State = {
  values: { name: '', email: '', seats: 1 },
  errors: {},
  submitted: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'changed': {
      const values = { ...state.values, [action.field]: action.value }
      // 一度送信を試みるまではエラーを出さない（入力途中で赤くしない）
      return { ...state, values, errors: state.submitted ? validateReservation(values) : state.errors }
    }
    case 'submitted':
      return { ...state, submitted: true, errors: validateReservation(state.values) }
    case 'serverErrors':
      return { ...state, errors: action.errors }
    case 'reset':
      return initialState
  }
}

export function useBookingForm() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setField = useCallback(
    (field: keyof ReservationInput, value: string | number) => dispatch({ type: 'changed', field, value }),
    [],
  )
  const setServerErrors = useCallback((errors: FieldErrors) => dispatch({ type: 'serverErrors', errors }), [])
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  // 送信可否を返す。dispatch後のstate反映を待たずに判定するため、同じ検証をここでも行う
  const trySubmit = useCallback(() => {
    dispatch({ type: 'submitted' })
    return !hasErrors(validateReservation(state.values))
  }, [state.values])

  return { values: state.values, errors: state.errors, setField, trySubmit, setServerErrors, reset }
}
