import { useInject } from './use-inject'

export function useIsLocal() {
  const windowLocation = ref(window.location.href)
  const isLocal = computed(() => windowLocation.value.includes('-local.ssp'))
  const mode = computed<ApplicationMode>(() => isLocal.value ? 'local' : 'remote')

  const inject = useInject()
  const touchpoint = computed(() => inject.state.value?.touchpoint)
  const fullTouchpoint = computed(() => `${touchpoint.value}${isLocal.value ? '-local' : ''}.ssp`)
  const localServerIsOn = computed(() => !!inject.state.value?.scriptStatuses?.find(s => s.status === 'loaded'))
  const baseUrl = computed(() => inject.state.value?.baseUrl)

  const status = computed<Statuses>(() => {
    if (isLocal.value && localServerIsOn.value)
      return 'running-locally'

    if (!isLocal.value && localServerIsOn.value)
      return 'local-available'

    if (isLocal.value && !localServerIsOn.value)
      return 'local-unavailable'

    if (!isLocal.value && !localServerIsOn.value)
      return 'running-remotely'

    // Should never happen
    return 'unknown'
  })

  function update() {
    windowLocation.value = window.location.href
  }

  onMounted(() => window.addEventListener('popstate', update))
  onUnmounted(() => window.removeEventListener('popstate', update))

  return {
    isLocal,
    localServerIsOn,
    status,
    mode,
    touchpoint,
    fullTouchpoint,
    baseUrl,
  }
}
