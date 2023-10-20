<script setup lang="ts">
import 'uno.css'
import Switch from '~/components/Switch.vue'
import { useStorageLocal } from '~/composables/useStorageLocal'

const isEnabled = useStorageLocal('isEnabled', true)

function sendToContentScript(data: unknown) {
  // Assuming you're interacting with the current tab
  browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
    await browser.scripting.executeScript({
      target: { tabId: tabs[0].id as number },
      func: (dataToPass) => {
        // This function will be serialized and won't have access to variables outside its scope
        const event = new CustomEvent('Toggle:Toolbar', { detail: dataToPass })
        document.dispatchEvent(event)
      },
      args: [data],
    })
  })
}

watch(isEnabled, (value) => {
  sendToContentScript({ isEnabled: value })
})

onMounted(() => {
  sendToContentScript({ isEnabled: isEnabled.value })
})
</script>

<template>
  <main class="m-0 px-4 pt-8 pb-4 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 min-w-xs block text-white">
    <div>
      <p class="mb-2">
        Show the toolbar
      </p>
      <Switch v-model="isEnabled" />
    </div>

    <div class="mt-8">
      <p class="mb-1">
        Please:
      </p>
      <div class="flex gap-3">
        <a href="https://github.com/raxelo/sca-helper-extension" class="bg-black text-white p-1.5 rounded shadow text-sm decoration-none flex items-center gap-1" target="_blank">
          <mdi-github /> Leave a star!
        </a>
        <a href="https://chromewebstore.google.com/detail/sca-toolbar/ibfgepefadbimmjbiolbajfememhfiio?hl=es" class="bg-rose-500 text-white p-1.5 rounded shadow text-sm decoration-none flex items-center gap-1" target="_blank">
          <fluent-emoji-clapping-hands /> And a review
        </a>
      </div>
    </div>
  </main>
</template>
