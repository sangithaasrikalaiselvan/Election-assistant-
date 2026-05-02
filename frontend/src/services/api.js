const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://election-backend-898515869127.asia-south1.run.app";

const responseCache = new Map();

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

export const fetchGuide = () => fetchJson("/api/guide");
export const fetchTimeline = () => fetchJson("/api/timeline");
export const fetchFaq = () => fetchJson("/api/faq");

export const sendChatMessage = (message, language) =>
  fetchJson("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, language }),
  });

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
        // Ignore malformed chunks
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
