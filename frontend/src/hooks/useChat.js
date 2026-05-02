import { useCallback, useMemo, useState } from "react";
import { streamChatMessage } from "../services/api";
import { useDebouncedCallback } from "./useDebouncedCallback";

const createMessage = (role, text) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  text,
});

export const useChat = (language) => {
  const [messages, setMessages] = useState([
    createMessage(
      "assistant",
      "Ask me about registration, nomination, campaigning, or results."
    ),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) {
      return;
    }

    setLoading(true);
    setError("");
    const userMessage = createMessage("user", trimmed);
    const assistantMessage = createMessage("assistant", "");
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");

    try {
      await streamChatMessage(trimmed, language, (event) => {
        if (event.type === "chunk") {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantMessage.id
                ? { ...message, text: message.text + event.content }
                : message
            )
          );
        }
      });
    } catch (err) {
      setMessages((prev) => prev.filter((message) => message.id !== assistantMessage.id));
      setError("Unable to reach the assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [input, language, loading]);

  const sendMessageDebounced = useDebouncedCallback(sendMessage, 350);

  return useMemo(
    () => ({ messages, input, loading, error, setInput, sendMessageDebounced }),
    [messages, input, loading, error, sendMessageDebounced]
  );
};
