import { memo, useCallback } from "react";
import { useChat } from "../hooks/useChat";

/**
 * A chat interface component powered by the election assistant API.
 * @param {{ language: string }} props
 */
const ChatBox = ({ language }) => {
  const { messages, input, loading, error, setInput, sendMessageDebounced } =
    useChat(language);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      sendMessageDebounced();
    },
    [sendMessageDebounced]
  );

  return (
    <div className="chat-panel" role="region" aria-label="Chat assistant">
      <div className="chat-messages" aria-live="polite" role="log">
        {messages.map((message) => (
          <div key={message.id} className={`chat-bubble ${message.role}`}>
            <span>{message.text}</span>
          </div>
        ))}
        {loading && <div className="chat-bubble assistant">Typing...</div>}
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <label htmlFor="chat-input" className="visually-hidden">
          Ask a question
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about registration, nominations, or results"
          aria-label="Chat message"
        />
        <button
          type="submit"
          aria-label="Send chat message"
          disabled={!input.trim() || loading}
        >
          Send
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default memo(ChatBox);
