import styled from 'styled-components'
import { CATEGORY_LABEL, type EventCategory } from '../../api/types'
import { SelectField, TextField } from '../../design-system'
import { categoryChanged, keywordChanged, onlyAvailableToggled } from '../../store/filtersSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

const Bar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.space(4)};
  align-items: end;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Check = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: 44px;
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 700;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
  }
`

export function EventFilters() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.filters)

  return (
    <Bar role="search">
      <TextField
        label="キーワード"
        type="search"
        placeholder="イベント名・会場で検索"
        value={filters.keyword}
        onChange={(e) => dispatch(keywordChanged(e.target.value))}
      />
      <SelectField
        label="カテゴリ"
        value={filters.category}
        onChange={(e) => dispatch(categoryChanged(e.target.value as EventCategory | 'all'))}
      >
        <option value="all">すべて</option>
        {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </SelectField>
      <Check>
        <input type="checkbox" checked={filters.onlyAvailable} onChange={() => dispatch(onlyAvailableToggled())} />
        受付中のみ
      </Check>
    </Bar>
  )
}
