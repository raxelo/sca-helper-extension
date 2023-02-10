function getScriptNameAfterPort(script) {
  return script.src.split("/").pop();
}


// CACHE
const cache = new Map();
async function cacheRequest(src) {
  if (cache.has(src)) return cache.get(src);

  cache.set(src, 'loading');

  const res = await doRequest(src)

  const st = res ? 'loaded' : 'failed';
  cache.set(src, st);
  return st;
}

// CLIENT
async function doRequest(src) {
  return fetch(src)
    .catch(() => false)
    .then((res) => res.ok);
}


async function getScriptStatuses() {
  // Get scripts
  const scripts = Array.from(
    document.querySelectorAll('script[src^="http://localhost"]')
  );

  // Map to statuses
  const statuses = scripts.map(async (script) => {
    return {
      scriptName: getScriptNameAfterPort(script),
      hasLoaded: await cacheRequest(script.src),
    };
  });

  // Wait for all statuses
  return Promise.all(statuses);
}

async function parseContext() {
  const context = {
    ENVIRONMENT: SC.ENVIRONMENT,
    windowLocation: window.location,
    scriptStatuses: await getScriptStatuses(),
  };

  return JSON.parse(JSON.stringify(context));
}

setInterval(async function () {
  const context = await parseContext();
  window.postMessage({ type: "FROM_PAGE", context });
}, 100);
