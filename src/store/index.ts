import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { eventsApi } from '../api/eventsApi'
import { filtersSlice } from './filtersSlice'
import { migrationSlice } from './migrationSlice'

const rootReducer = combineReducers({
  [eventsApi.reducerPath]: eventsApi.reducer,
  filters: filtersSlice.reducer,
  migration: migrationSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export function createAppStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefault) => getDefault().concat(eventsApi.middleware),
  })
}

export type AppStore = ReturnType<typeof createAppStore>
export type AppDispatch = AppStore['dispatch']
