export function useInject() {
  const state = ref<SCState>()
  function injectScript() {
    const s = document.createElement('script')
    s.src = browser.runtime.getURL('dist/inject/index.global.js');
    (document.head || document.documentElement).appendChild(s)
    s.onload = function () {
      s.remove()
    }

    // Event listener
    document.addEventListener('SCAToolbar:message', (e) => {
      state.value = JSON.parse((e as any).detail || '{}') as SCState
    })
  }

  injectScript()

  return {
    state,
  }
}
