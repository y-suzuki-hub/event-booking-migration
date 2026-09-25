import type { EventItem } from '../../api/types'
import { remainingSeats } from '../../domain/capacity'
import type { FiltersState } from '../../store/filtersSlice'

export function selectVisibleEvents(events: EventItem[], filters: FiltersState): EventItem[] {
  const keyword = filters.keyword.trim().toLowerCase()
  return events.filter((event) => {
    if (filters.category !== 'all' && event.category !== filters.category) return false
    if (filters.onlyAvailable && remainingSeats(event) === 0) return false
    if (keyword && !`${event.title} ${event.venue}`.toLowerCase().includes(keyword)) return false
    return true
  })
}
