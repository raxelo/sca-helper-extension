import { getScriptStatuses } from './script-statuses'

function isSuiteCommerce() {
  return !!window.SC
}

function getEnvironment() {
  if (!isSuiteCommerce())
    return

  return window.SC && window.SC.ENVIRONMENT
}

function getState(): SCState {
  const environment = getEnvironment()
  return {
    touchpoint: environment?.touchpoint || environment?.SCTouchpoint,
    baseUrl: environment?.baseUrl || environment?.SC?.ENVIRONMENT?.baseUrl,
    scriptStatuses: getScriptStatuses(),
  }
}

async function postMessage() {
  const event = new CustomEvent('SCAToolbar:message', {
    detail: JSON.stringify(getState()),
  })
  document.dispatchEvent(event)
}

setInterval(() => {
  postMessage()
}, 500)
