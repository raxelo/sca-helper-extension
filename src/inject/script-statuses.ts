let scriptStatuses: ScriptStatus[] = []

type ScriptStatusUpdatEvent = CustomEvent<ScriptStatus[]>

document.addEventListener('ScriptStatuses:Update', (e) => {
  const event = e as ScriptStatusUpdatEvent
  if (event.detail && Array.isArray(event.detail))
    scriptStatuses = event.detail
})

export function getScriptStatuses(): ScriptStatus[] {
  return scriptStatuses
}
