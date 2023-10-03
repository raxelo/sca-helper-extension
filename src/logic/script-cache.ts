function getScriptNameAfterPort(script: HTMLScriptElement) {
  return script.src.split('/').pop()
}

export type ScritStatus = 'loading' | 'loaded' | 'failed'
const cache = new Map<string, ScritStatus>()
async function cacheRequest(src: string) {
  if (cache.has(src))
    return cache.get(src)

  cache.set(src, 'loading')

  const res = await doRequest(src)

  const st = res ? 'loaded' : 'failed'
  cache.set(src, st)
  return st
}

async function doRequest(src: string) {
  return fetch(src)
    .then(res => res.ok)
    .catch(() => false)
}

export async function getScriptStatuses() {
  // Get scripts
  const scripts = Array.from(
    document.querySelectorAll('script[src^="http://localhost"]'),
  )

  // Map to statuses
  const statuses = scripts.map(async (script) => {
    return {
      name: getScriptNameAfterPort(script as HTMLScriptElement),
      status: await cacheRequest((script as HTMLScriptElement).src),
    }
  })

  // Wait for all statuses
  return Promise.all(statuses)
}
