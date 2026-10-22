import { useState } from 'react';
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { askGemini } from '../services/gemini';

const questionCategories = [
  {
    name: 'My result',
    questions: [
      'Why does this worldview fit my answers?',
      'What does my result say about the way I see life?',
      'Which part of my result should I question?',
    ],
  },
  {
    name: 'Compare worldviews',
    questions: [
      'What is the difference between my top two worldviews?',
      'Why did I match some worldviews more than others?',
      'Could I identify with more than one worldview?',
    ],
  },
  {
    name: 'Religion and belief',
    questions: [
      'Which religion or belief system is closest to my result?',
      'What does the population percentage mean?',
      'Does my result mean that I am religious or atheist?',
    ],
  },
  {
    name: 'Philosophers',
    questions: [
      'Which philosopher on this page is most like me?',
      'What is the main idea of the philosophers shown here?',
      'How could one of these philosophers challenge my result?',
    ],
  },
  {
    name: 'Books and films',
    questions: [
      'Which recommended book should I start with?',
      'Why was this movie recommended to me?',
      'How do the books and films connect to my worldview?',
    ],
  },
];

export default function GeminiChat({ result, media, recommendations }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(questionCategories[0].name);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    setMessage('');
    const nextMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setIsSending(true);
    try {
      const reply = await askGemini(trimmed, { result, media, recommendations }, messages);
      setMessages([...nextMessages, { role: 'assistant', text: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          text: 'Let me look at your result again. Please choose one of the suggested questions or try sending your question once more.',
        },
      ]);
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
          <div className="ai-chat-messages" aria-live="polite">
            {messages.length === 0 && <div className="ai-chat-welcome"><Bot className="w-5 h-5" /><p>Ask me anything about your result, your worldview, or the recommendations.</p></div>}
            {messages.map((item, index) => <p key={`${item.role}-${index}`} className={`ai-message ${item.role}`}>{item.text}</p>)}
            {isSending && <p className="ai-message assistant ai-thinking"><span className="thinking-dots"><i /><i /><i /></span> Writing a reply...</p>}
          </div>
          <div className="ai-chat-starters">
            {questionCategories.map((category) => (
              <button key={category.name} onClick={() => setSelectedCategory(category.name)} disabled={isSending} className={selectedCategory === category.name ? 'active' : ''}>
                {category.name}
              </button>
            ))}
          </div>
          <div className="ai-chat-starters">
            {questionCategories.find((category) => category.name === selectedCategory).questions.map((question) => (
              <button key={question} onClick={() => sendMessage(question)} disabled={isSending}>{question}</button>
            ))}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); sendMessage(message); }} className="ai-chat-form">
            <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask your own question..." disabled={isSending} />
            <button type="submit" aria-label="Send question" disabled={isSending || !message.trim()}><Send className="w-4 h-4" /></button>
          </form>
        </section>
      )}
    </div>
  );
}
