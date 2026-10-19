import { API_BASE_URL } from '../constants/config';
import type { Post } from '../types/news';

const REQUEST_TIMEOUT_MS = 10_000;

export async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  let didTimeout = false;

  const abortFromCaller = () => controller.abort();
  if (signal?.aborted) {
    controller.abort();
  } else {
    signal?.addEventListener('abort', abortFromCaller, { once: true });
  }

  const timeout = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/+$/, '')}${path}`, {
      method: 'GET',
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Request failed with HTTP status ${response.status}.`);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new Error('The server returned an invalid JSON response.');
    }
  } catch (error) {
    if (didTimeout) {
      throw new Error('The request timed out after 10 seconds.');
    }

    if (signal?.aborted) {
      throw new Error('The request was cancelled.');
    }

    if (
      error instanceof Error &&
      (error.message.startsWith('Request failed with HTTP status') ||
        error.message === 'The server returned an invalid JSON response.')
    ) {
      throw error;
    }

    const reason = error instanceof Error ? error.message : 'Unknown network error.';
    throw new Error(`Network request failed: ${reason}`);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}

export async function getPosts(signal?: AbortSignal): Promise<Post[]> {
  return fetchJson<Post[]>('/posts?_limit=20', signal);
}
