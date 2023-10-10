import { getScriptStatuses } from './scriptStatuses'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

setInterval(() => {
  getScriptStatuses().then((statuses) => {
    sendToContentScript(statuses)
  })
}, 1000)

function sendToContentScript(data: unknown) {
  // Assuming you're interacting with the current tab
  browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
    await browser.scripting.executeScript({
      target: { tabId: tabs[0].id as number },
      func: (dataToPass) => {
        // This function will be serialized and won't have access to variables outside its scope
        const event = new CustomEvent('ScriptStatuses:Update', { detail: dataToPass })
        document.dispatchEvent(event)
      },
      args: [data],
    })
  })
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})
