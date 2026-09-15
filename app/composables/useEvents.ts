import { events, partitionEvents } from '~/data/events'

export function useEvents() {
  const now = useState('site-now', () => Date.now())
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    now.value = Date.now()
    timer = setInterval(() => { now.value = Date.now() }, 60_000)
  })
  onUnmounted(() => { if (timer) clearInterval(timer) })
  const grouped = computed(() => partitionEvents(events, now.value))
  return { now, upcoming: computed(() => grouped.value.upcoming), past: computed(() => grouped.value.past) }
}
