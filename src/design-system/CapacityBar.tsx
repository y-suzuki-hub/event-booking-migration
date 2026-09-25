import styled from 'styled-components'
import { capacityStatus, remainingSeats, type CapacityStatus } from '../domain/capacity'

type Props = { capacity: number; reserved: number }

const Track = styled.div`
  height: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.pill};
`

const Fill = styled.div<{ $status: CapacityStatus }>`
  height: 100%;
  background: ${({ $status, theme }) =>
    ({ open: theme.color.success, few: theme.color.warning, closed: theme.color.danger })[$status]};
  transform-origin: left center;
  transition: transform 0.3s ease;
`

const Label = styled.p`
  margin-top: ${({ theme }) => theme.space(1)};
  font-size: ${({ theme }) => theme.font.sm};
  color: ${({ theme }) => theme.color.muted};

  strong {
    color: ${({ theme }) => theme.color.text};
    font-size: ${({ theme }) => theme.font.md};
  }
`

export function CapacityBar({ capacity, reserved }: Props) {
  const remaining = remainingSeats({ capacity, reserved })
  const status = capacityStatus({ capacity, reserved })
  const ratio = capacity === 0 ? 1 : Math.min(1, reserved / capacity)

  return (
    <div>
      <Track
        role="meter"
        aria-label="申込状況"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={reserved}
        aria-valuetext={`定員${capacity}名中${reserved}名が申込済み`}
      >
        {/* widthではなくtransformで伸縮させ、レイアウト計算を発生させない */}
        <Fill $status={status} style={{ transform: `scaleX(${ratio})` }} />
      </Track>
      <Label>
        残り <strong>{remaining}</strong> / {capacity}席
      </Label>
    </div>
  )
}
