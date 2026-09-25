import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CATEGORY_LABEL, type EventItem } from '../../api/types'
import { CapacityBar, StatusBadge } from '../../design-system'
import { capacityStatus } from '../../domain/capacity'
import { formatEventDate } from '../../lib/format'

const Item = styled.li`
  display: grid;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => theme.space(5)};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
  align-items: center;
  font-size: ${({ theme }) => theme.font.sm};
  color: ${({ theme }) => theme.color.muted};
`

const Title = styled.h2`
  font-size: ${({ theme }) => theme.font.lg};
  line-height: 1.5;

  a {
    color: ${({ theme }) => theme.color.text};
    text-decoration: none;
  }

  a:hover {
    color: ${({ theme }) => theme.color.primary};
    text-decoration: underline;
  }
`

export function EventCard({ event }: { event: EventItem }) {
  return (
    <Item>
      <Meta>
        <StatusBadge status={capacityStatus(event)} />
        <span>{CATEGORY_LABEL[event.category]}</span>
      </Meta>
      <Title>
        <Link to={`/events/${event.id}`}>{event.title}</Link>
      </Title>
      <Meta>
        <time dateTime={event.startsAt}>{formatEventDate(event.startsAt)}</time>
        <span aria-hidden="true">・</span>
        <span>{event.venue}</span>
      </Meta>
      <CapacityBar capacity={event.capacity} reserved={event.reserved} />
    </Item>
  )
}
