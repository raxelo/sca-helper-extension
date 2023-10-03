function getScriptNameAfterPort(src: string) {
  return src.split('/').pop() || 'No name'
}

const cache = new Map<string, 'loaded' | 'failed' | 'loading'>()
async function cacheRequest(src: string) {
  if (cache.has(src))
    return cache.get(src) || 'failed'

  cache.set(src, 'loading')

  const res = await doRequest(src)

  const scriptStatus = res ? 'loaded' : 'failed'
  cache.set(src, scriptStatus)
  return scriptStatus
}

// CLIENT
async function doRequest(src: string) {
  return fetch(src)
    .catch(() => false)
    .then(res => (res as Response).ok)
}

export async function getScriptStatuses(): Promise<ScriptStatus[]> {
  // Get scripts
  const scripts = Array.from(
    document.querySelectorAll('script[src^="http://localhost"]'),
  ) as HTMLScriptElement[]

  // Map to statuses
  const statuses = scripts.map(async (script) => {
    return {
      name: getScriptNameAfterPort(script.src),
      status: await cacheRequest(script.src),
      src: script.src,
    }
  })

  const tryUrls = [
    'http://localhost:7779/tmp/extensions/shopping_ext.js',
    'http://localhost:7777/who/shopping',
    'http://localhost:7777/extensions',
    'http://localhost:7777/javascript/shopping.js',
    'http://localhost:7777/shopping-templates.js',
    'http://localhost:7778/tmp/shopping-templates.js',
    'http://localhost:7779/tmp/shopping-templates.js',
    'http://localhost:7777/css/shopping.css',
    'http://localhost:7778/tmp/css/shopping.css',
    'http://localhost:7779/tmp/css/shopping.css',
  ]

  const tryStatuses = tryUrls.map(async (url) => {
    return {
      name: getScriptNameAfterPort(url),
      status: await cacheRequest(url),
      src: url,
    }
  })

  cache.clear()

  return Promise.all([...statuses, ...tryStatuses])
}
