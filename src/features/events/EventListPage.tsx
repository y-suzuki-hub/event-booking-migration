import { useMemo } from 'react'
import styled from 'styled-components'
import { useGetEventsQuery } from '../../api/eventsApi'
import { Button, Card, Muted, Notice, PageTitle } from '../../design-system'
import { filtersCleared } from '../../store/filtersSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { EventCard } from './EventCard'
import { EventFilters } from './EventFilters'
import { selectVisibleEvents } from './selectVisibleEvents'

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: ${({ theme }) => theme.space(4)};
  padding: 0;
  margin: 0;
  list-style: none;
`

const Stack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(5)};
`

export function EventListPage() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.filters)
  const { data: events = [], isLoading, isError, refetch } = useGetEventsQuery()
  const visible = useMemo(() => selectVisibleEvents(events, filters), [events, filters])

  return (
    <Stack>
      <div>
        <PageTitle>イベント一覧</PageTitle>
        <Muted>定員に達したイベントは自動で受付を終了します。</Muted>
      </div>

      <Card>
        <EventFilters />
      </Card>

      {isLoading && <Muted role="status">読み込み中…</Muted>}

      {isError && (
        <Notice $tone="danger" role="alert">
          イベントを読み込めませんでした。{' '}
          <Button variant="secondary" onClick={() => refetch()}>
            再読み込み
          </Button>
        </Notice>
      )}

      {!isLoading && !isError && visible.length === 0 && (
        <Notice $tone="info">
          条件に合うイベントはありません。{' '}
          <Button variant="secondary" onClick={() => dispatch(filtersCleared())}>
            条件をクリア
          </Button>
        </Notice>
      )}

      {visible.length > 0 && (
        <>
          <Muted aria-live="polite">{visible.length}件のイベント</Muted>
          <Grid>
            {visible.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Grid>
        </>
      )}
    </Stack>
  )
}
