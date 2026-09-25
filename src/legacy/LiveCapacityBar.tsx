import { eventsApi } from '../api/eventsApi'
import { CapacityBar } from '../design-system'
import { useAppSelector } from '../store/hooks'

const selectEvents = eventsApi.endpoints.getEvents.select()

// 旧画面と共有したストアから該当イベントを読むだけ。APIの購読は旧画面側が持つので、取得は1回で済む
export function LiveCapacityBar({ eventId }: { eventId: string }) {
  const event = useAppSelector((state) => selectEvents(state).data?.find((e) => e.id === eventId))
  if (!event) return null
  return <CapacityBar capacity={event.capacity} reserved={event.reserved} />
}
