import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// 旧画面の残席ウィジェットをどちらの実装で描画するか。
// 'jquery' に戻せば即座に切り戻せる（React版に問題が出たときの退路）
export type WidgetImpl = 'jquery' | 'react'

export type MigrationState = { capacityWidget: WidgetImpl }

const initialState: MigrationState = { capacityWidget: 'react' }

export const migrationSlice = createSlice({
  name: 'migration',
  initialState,
  reducers: {
    capacityWidgetSwitched(state, action: PayloadAction<WidgetImpl>) {
      state.capacityWidget = action.payload
    },
  },
})

export const { capacityWidgetSwitched } = migrationSlice.actions
