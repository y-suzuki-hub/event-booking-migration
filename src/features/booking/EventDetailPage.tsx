import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useGetEventQuery } from '../../api/eventsApi'
import { CATEGORY_LABEL } from '../../api/types'
import { CapacityBar, Card, Muted, Notice, PageTitle, StatusBadge } from '../../design-system'
import { capacityStatus, remainingSeats } from '../../domain/capacity'
import { formatEventDate } from '../../lib/format'
import { sanitizeHtml } from '../../lib/sanitize'
import { BookingForm } from './BookingForm'

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: ${({ theme }) => theme.space(5)};
  align-items: start;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

const Stack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(4)};
`

const Description = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(3)};

  ul {
    margin: 0;
    padding-left: 1.2em;
  }
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.lg};
`

export function EventDetailPage() {
  const { eventId = '' } = useParams()
  const { data: event, isLoading, isError } = useGetEventQuery(eventId)

  if (isLoading) return <Muted role="status">読み込み中…</Muted>
  if (isError || !event) {
    return (
      <Notice $tone="danger" role="alert">
        イベントが見つかりませんでした。<Link to="/">一覧へ戻る</Link>
      </Notice>
    )
  }

  const status = capacityStatus(event)

  return (
    <Stack>
      <Link to="/">← イベント一覧</Link>
      <Layout>
        <Card>
          <Stack>
            <div>
              <StatusBadge status={status} /> <Muted as="span">{CATEGORY_LABEL[event.category]}</Muted>
            </div>
            <PageTitle>{event.title}</PageTitle>
            <Muted>
              <time dateTime={event.startsAt}>{formatEventDate(event.startsAt)}</time>・{event.venue}
            </Muted>
            <Description dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.descriptionHtml) }} />
          </Stack>
        </Card>

        <Card aria-labelledby="booking-title">
          <Stack>
            <SectionTitle id="booking-title">お申し込み</SectionTitle>
            <CapacityBar capacity={event.capacity} reserved={event.reserved} />
            {remainingSeats(event) === 0 ? (
              <Notice $tone="danger">定員に達したため、受付を終了しました。</Notice>
            ) : (
              <BookingForm event={event} />
            )}
          </Stack>
        </Card>
      </Layout>
    </Stack>
  )
}
