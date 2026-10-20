import { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { askGemini, isGeminiConfigured } from '../services/gemini';

const starterQuestions = [
  'Why does this result fit me?',
  'What should I read first?',
  'Help me question this result.',
];

export default function GeminiChat({ result, media }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [lastFailedMessage, setLastFailedMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text = message) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    setMessage('');
    setError('');
    setLastFailedMessage('');
    const nextMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setIsSending(true);
    try {
      const reply = await askGemini(trimmed, { result, media }, messages);
      setMessages([...nextMessages, { role: 'assistant', text: reply }]);
    } catch (requestError) {
      setError(requestError.message);
      setLastFailedMessage(trimmed);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="ai-chat">
      {!isOpen && (
        <button className="ai-chat-launcher" onClick={() => setIsOpen(true)} aria-label="Open chat">
          <MessageCircle className="w-4 h-4" /> Ask Aletheia
        </button>
      )}
      {isOpen && (
        <section className="ai-chat-panel" aria-label="Chat with Aletheia">
          <header className="ai-chat-header">
            <div><span className="eyebrow"><Sparkles className="w-3 h-3" /> AI conversation</span><strong>Talk through your result</strong></div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat"><X className="w-4 h-4" /></button>
          </header>
          {!isGeminiConfigured && <p className="ai-chat-error">Add your Gemini API key to enable this chat.</p>}
          <div className="ai-chat-messages" aria-live="polite">
            {messages.length === 0 && <div className="ai-chat-welcome"><Bot className="w-5 h-5" /><p>Ask anything about your result, your interests, or the ideas behind it.</p></div>}
            {messages.map((item, index) => <p key={`${item.role}-${index}`} className={`ai-message ${item.role}`}>{item.text}</p>)}
            {isSending && <p className="ai-message assistant ai-thinking"><span className="thinking-dots"><i /><i /><i /></span> Writing a reply...</p>}
          </div>
          <div className="ai-chat-starters">
            {starterQuestions.map((question) => <button key={question} onClick={() => sendMessage(question)} disabled={isSending}>{question}</button>)}
          </div>
          {error && <div className="ai-chat-error"><p>{error}</p><button onClick={() => sendMessage(lastFailedMessage)} disabled={isSending}>Try again</button></div>}
          <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="ai-chat-form">
            <input ref={inputRef} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask a question..." disabled={isSending || !isGeminiConfigured} />
            <button type="submit" aria-label="Send message" disabled={isSending || !message.trim() || !isGeminiConfigured}><Send className="w-4 h-4" /></button>
          </form>
        </section>
      )}
    </div>
  );
}
