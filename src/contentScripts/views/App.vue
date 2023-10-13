<script setup lang="ts">
import { useIsLocal } from '~/logic/is-running-local'
import 'uno.css'
import { useMostRecentChange } from '~/logic/most-recent-change'

const { status, touchpoint, fullTouchpoint, baseUrl, isLocal } = useIsLocal()

const statusColor = computed(() => {
  const statusToColorMap = {
    'running-locally': 'text-emerald-500',
    'local-available': 'text-yellow-500',
    'local-unavailable': 'text-red-500',
    'running-remotely': 'text-gray-500',
    'unknown': 'text-gray-500',
  }

  return statusToColorMap[status.value]
})

const tooltipText = computed(() => {
  const statusToMessageMap = {
    'running-locally': 'Running locally',
    'local-available': 'Local server available<br>Click to open',
    'local-unavailable': 'Local server unavailable<br>Make sure your local server is running',
    'running-remotely': 'Running remotely<br>No local server detected',
    'unknown': 'Unknown status',
  }

  return statusToMessageMap[status.value]
})

function absolutize(path: string) {
  return path.replace('#', '/')
}

function switchApplicationMode() {
  const touchpointApp = `${touchpoint.value}${isLocal.value ? '' : '-local'}.ssp`
  const url = (baseUrl.value || '').replace('{{file}}', touchpointApp)
  const path = getPath()

  const fullUrl = url.includes('shopping.ssp') ? absolutize(path) : `${url}${path}`

  window.location.href = fullUrl
}

function getPath() {
  const path = ''
  const search = window.location.search
  const hash = window.location.hash

  if (window.location.hash)
    return search + hash

  if (!window.location.pathname.includes('.ssp'))
    return window.location.pathname.replace('/', '#')

  return path
}

const { mostRecentChange } = useMostRecentChange(status)
</script>

<template>
  <section class="font-mono fixed bottom-0 z-1000 w-full overflow-hidden pt-20 select-none pointer-events-none flex items-center justify-center pb-4">
    <transition
      enter-active-class="duration-1000 ease-out"
      enter-from-class="transform translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="duration-1000 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-full"
    >
      <div v-if="touchpoint" class="relative">
        <transition
          enter-active-class="duration-1000 delay-1000 ease-out"
          enter-from-class="transform -translate-x-40 opacity-0"
          enter-to-class="translate-x-0 opacity-100"
          leave-active-class="duration-1000 ease-in delay-2500"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="transform opacity-0 -translate-x-40"
        >
          <div v-if="mostRecentChange" class="z-50 h-full flex items-center whitespace-nowrap justify-end absolute left-full -ml-12 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-bold rounded-r-full pl-14 pr-4 text-xs">
            <span v-html="mostRecentChange" />
          </div>
        </transition>
        <button class="z-100 relative pointer-events-auto rounded-full border border-white/10 bg-black flex-col flex items-center px-3.5 py-4 text-white gap-3">
          <span class="absolute top-0 bg-white rounded font-bold text-[11px] uppercase font-black tracking-wide px-1 transform -translate-y-1/2 leading-snug text-black border-1 border-black/20 border-solid">
            SCA Toolba
          </span>
          <div class="mx-1 flex items-center gap-2">
            <div :class="statusColor" class="group relative flex cursor-pointer" @click="switchApplicationMode">
              <span class="absolute bg-white shadow border border-black/20 border-solid rounded py-1 px-2 text-slate-600 leading-relaxed hidden group-hover:block bottom-5 rounded whitespace-nowrap transform -translate-x-1/2" v-html="tooltipText" />
              <span class="block w-3 h-3 bg-current rounded-full absolute animate-ping animate-duration-3000 origin-center" />
              <span class="block w-3 h-3 bg-current rounded-full" />
            </div>
            <span class="font-mono text-lg">{{ fullTouchpoint }}</span>
          </div>
        </button>
      </div>
    </transition>
  </section>
</template>

<style>
.tippy-box{
  background-color: #f7f7f7;
  color: black;
  border: 1px solid #ededed;
  border-radius: 0;
}
</style>
