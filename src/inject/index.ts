import { getScriptStatuses } from './script-statuses'

function isSuiteCommerce() {
  return !!window.SC
}

function getEnvironment() {
  if (!isSuiteCommerce())
    return

  return window.SC && window.SC.ENVIRONMENT
}

async function getState(): Promise<SCState> {
  const environment = getEnvironment()
  return {
    touchpoint: environment?.touchpoint || environment?.SCTouchpoint,
    baseUrl: environment?.baseUrl || environment?.SC?.ENVIRONMENT?.baseUrl,
    scriptStatuses: await getScriptStatuses(),
  }
}

async function postMessage() {
  const event = new CustomEvent('SCAToolbar:message', {
    detail: JSON.stringify(await getState()),
  })
  document.dispatchEvent(event)
}

setInterval(() => {
  postMessage()
}, 500)
