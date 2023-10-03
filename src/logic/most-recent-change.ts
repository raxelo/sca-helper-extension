type MostRecentChange = 'server-turned-on' | 'server-turned-off' | null

export function useMostRecentChange(statusRef: Ref<Statuses>) {
  const clearMostRecentChange = ref()

  const mostRecentChange = ref<MostRecentChange>()

  function updateMostRecentChange(value: MostRecentChange) {
    nextTick(() => {
      mostRecentChange.value = value
    })

    if (clearMostRecentChange.value)
      clearTimeout(clearMostRecentChange.value)

    const timeout = setTimeout(() => {
      mostRecentChange.value = null
    }, 4000)

    clearMostRecentChange.value = timeout
  }

  watch(statusRef, (newValue, oldValue) => {
    if (newValue === 'local-available')
      updateMostRecentChange('server-turned-on')

    if (oldValue === 'running-locally' && newValue === 'local-unavailable')
      updateMostRecentChange('server-turned-off')

    if (oldValue === 'local-available' && newValue === 'running-remotely')
      updateMostRecentChange('server-turned-off')
  })

  const mostRecentChangeText = computed(() => {
    if (!mostRecentChange.value)
      return

    const mostRecentChangeToTextMap = {
      'server-turned-on': 'Local server available<br>Click the <b>dot</b> to open',
      'server-turned-off': 'Local server turned off',
    }

    return mostRecentChangeToTextMap[mostRecentChange.value]
  })

  return {
    mostRecentChange: readonly(mostRecentChangeText),
  }
}
