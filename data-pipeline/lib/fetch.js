'use strict';

const retryableStatus = status => status === 408 || status === 429 || status >= 500;

async function fetchText(url, options = {}) {
  const attempts = options.attempts || 3;
  const timeoutMs = options.timeoutMs || 30000;
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: options.method,
        headers: options.headers,
        body: options.body,
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (response.ok) return response.text();
      const error = new Error(`issuer returned HTTP ${response.status}`);
      error.retryable = retryableStatus(response.status);
      if (!error.retryable || attempt === attempts) throw error;
      lastError = error;
    } catch (error) {
      lastError = error;
      if (error.retryable === false || attempt === attempts) throw error;
    }

    const delayMs = (options.retryDelayMs || 500) * (2 ** (attempt - 1));
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  throw lastError;
}

module.exports = { fetchText, retryableStatus };
