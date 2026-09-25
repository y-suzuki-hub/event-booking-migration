import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { EventCategory } from '../api/types'

export type FiltersState = {
  keyword: string
  category: EventCategory | 'all'
  onlyAvailable: boolean
}

const initialState: FiltersState = { keyword: '', category: 'all', onlyAvailable: false }

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    keywordChanged(state, action: PayloadAction<string>) {
      state.keyword = action.payload
    },
    categoryChanged(state, action: PayloadAction<FiltersState['category']>) {
      state.category = action.payload
    },
    onlyAvailableToggled(state) {
      state.onlyAvailable = !state.onlyAvailable
    },
    filtersCleared() {
      return initialState
    },
  },
})

export const { keywordChanged, categoryChanged, onlyAvailableToggled, filtersCleared } = filtersSlice.actions
