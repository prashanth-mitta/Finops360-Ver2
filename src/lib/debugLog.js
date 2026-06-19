/** Debug session logging — remove after Vercel issue is verified fixed. */
export function debugLog(location, message, data = {}, hypothesisId = '') {
  // #region agent log
  fetch('http://127.0.0.1:7497/ingest/3a286298-0ed2-40eb-8523-6992c7d909c2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'cc3635' },
    body: JSON.stringify({
      sessionId: 'cc3635',
      location,
      message,
      data: {
        ...data,
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'ssr',
      },
      timestamp: Date.now(),
      hypothesisId,
    }),
  }).catch(() => {});
  // #endregion
}
