import styled from 'styled-components'
import { useGetEventsQuery, useGetReservationsQuery } from '../../api/eventsApi'
import { Card, Muted, PageTitle, StatusBadge } from '../../design-system'
import { capacityStatus, remainingSeats } from '../../domain/capacity'
import { formatEventDate } from '../../lib/format'

const Stack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(5)};
`

const Scroll = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.font.sm};

  th,
  td {
    padding: ${({ theme }) => `${theme.space(3)} ${theme.space(3)}`};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
    white-space: nowrap;
  }

  th {
    color: ${({ theme }) => theme.color.muted};
    font-weight: 700;
  }

  td.num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`

const SectionTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.space(3)};
  font-size: ${({ theme }) => theme.font.lg};
`

export function AdminPage() {
  const { data: events = [] } = useGetEventsQuery()
  const { data: reservations = [], isLoading } = useGetReservationsQuery(undefined)
  const titleById = new Map(events.map((e) => [e.id, e.title]))

  return (
    <Stack>
      <div>
        <PageTitle>申込状況（管理）</PageTitle>
        <Muted>申込データはこのブラウザ内に保存され、旧画面（jQuery）とも共有されます。</Muted>
      </div>

      <Card>
        <SectionTitle>イベント別</SectionTitle>
        <Scroll>
          <Table>
            <thead>
              <tr>
                <th scope="col">イベント</th>
                <th scope="col">開催日時</th>
                <th scope="col">申込 / 定員</th>
                <th scope="col">残席</th>
                <th scope="col">状態</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{formatEventDate(event.startsAt)}</td>
                  <td className="num">
                    {event.reserved} / {event.capacity}
                  </td>
                  <td className="num">{remainingSeats(event)}</td>
                  <td>
                    <StatusBadge status={capacityStatus(event)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroll>
      </Card>

      <Card>
        <SectionTitle>このブラウザでの申込（新しい順）</SectionTitle>
        {isLoading ? (
          <Muted role="status">読み込み中…</Muted>
        ) : reservations.length === 0 ? (
          <Muted>まだ申込はありません。イベント詳細から申し込むと、ここに表示されます。</Muted>
        ) : (
          <Scroll>
            <Table>
              <thead>
                <tr>
                  <th scope="col">受付番号</th>
                  <th scope="col">イベント</th>
                  <th scope="col">お名前</th>
                  <th scope="col">人数</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{titleById.get(r.eventId) ?? r.eventId}</td>
                    <td>{r.name}</td>
                    <td className="num">{r.seats}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Scroll>
        )}
      </Card>
    </Stack>
  )
}
