/**
 * @fileoverview Frontend API service for making requests to the backend
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://election-backend-898515869127.asia-south1.run.app";

const responseCache = new Map();

/**
 * Unwraps the standard API response format.
 * @param {any} payload
 * @returns {any}
 */
const unwrapResponse = (payload) => {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "success")) {
    if (!payload.success) {
      throw new Error(payload.message || "Request failed");
    }
    return payload.data;
  }

  return payload;
};

/**
 * Fetches JSON data from the API, with basic GET caching.
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
const fetchJson = async (path, options) => {
  const cacheKey = `${path}:${options?.method || "GET"}`;
  if (!options && responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }

  const data = unwrapResponse(await response.json());
  if (!options) {
    responseCache.set(cacheKey, data);
  }
  return data;
};

/**
 * Fetches the election guide steps.
 * @returns {Promise<any>}
 */
export const fetchGuide = () => fetchJson("/api/guide");

/**
 * Fetches the election timeline data.
 * @returns {Promise<any>}
 */
export const fetchTimeline = () => fetchJson("/api/timeline");

/**
 * Fetches the FAQ data.
 * @returns {Promise<any>}
 */
export const fetchFaq = () => fetchJson("/api/faq");

/**
 * Sends a chat message to the backend.
 * @param {string} message
 * @param {string} language
 * @returns {Promise<any>}
 */
export const sendChatMessage = (message, language) =>
  fetchJson("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, language }),
  });

/**
 * Streams a chat response from the backend.
 * @param {string} message
 * @param {string} language
 * @param {(event: any) => void} onEvent Callback triggered for each chunk
 * @returns {Promise<void>}
 */
export const streamChatMessage = async (message, language, onEvent) => {
  const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, language }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Network error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const processBuffer = () => {
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";
    parts.forEach((part) => {
      const line = part.trim();
      if (!line.startsWith("data:")) {
        return;
      }
      const payload = line.replace(/^data:\s*/, "");
      if (!payload) {
        return;
      }
      try {
        const event = JSON.parse(payload);
        onEvent?.(event);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("API call failed:", error);
        throw new Error(`API call failed: ${error.message}`);
      }
    });
  };

  let isDone = false;
  while (!isDone) {
    const { value, done } = await reader.read();
    isDone = done;
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    processBuffer();
  }
};
