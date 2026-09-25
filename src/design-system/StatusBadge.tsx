import styled from 'styled-components'
import { STATUS_LABEL, type CapacityStatus } from '../domain/capacity'

const Badge = styled.span<{ $status: CapacityStatus }>`
  display: inline-block;
  padding: 2px ${({ theme }) => theme.space(3)};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.font.xs};
  font-weight: 700;
  white-space: nowrap;
  color: ${({ $status, theme }) =>
    ({ open: theme.color.success, few: theme.color.warning, closed: theme.color.danger })[$status]};
  background: ${({ $status, theme }) =>
    ({ open: theme.color.successWeak, few: theme.color.warningWeak, closed: theme.color.dangerWeak })[$status]};
`

export function StatusBadge({ status }: { status: CapacityStatus }) {
  return <Badge $status={status}>{STATUS_LABEL[status]}</Badge>
}
