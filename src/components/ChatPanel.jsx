import React, { useState, useEffect } from 'react';
import { Send, Bot, ChevronUp, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { callSecureApi } from '../lib/apiClient';

// ZMIANA: Importujemy react-markdown i plugin GFM
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatPanel = ({ isMobile = false }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { speakIfEnabled } = useTextToSpeech();
  
  const storageKey = `chatHistory_${user?.id || 'anonymous'}`;

  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages && savedMessages.length > 2) {
        setMessages(JSON.parse(savedMessages));
      } else {
        const welcomeMessage = t('chatWelcomeMessage');
        setMessages([{
          id: 1,
          type: 'ai',
          content: welcomeMessage,
          timestamp: new Date().toISOString()
        }]);
        speakIfEnabled(welcomeMessage);
      }
    } catch {
        const welcomeMessage = t('chatWelcomeMessage');
        setMessages([{
          id: 1,
          type: 'ai',
          content: welcomeMessage,
          timestamp: new Date().toISOString()
        }]);
    }
  }, [storageKey, t]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  // Funkcja do czyszczenia historii czatu
  const handleClearChat = () => {
    if (window.confirm(t('clearChatConfirm') || 'Are you sure you want to clear the chat history?')) {
      const welcomeMessage = t('chatWelcomeMessage');
      setMessages([{
        id: Date.now(),
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date().toISOString()
      }]);
      speakIfEnabled(welcomeMessage);
    }
  };

  const generateGeminiResponse = async (userInput) => {
    if (isLoading) return t('chatWaitMessage');
    setIsLoading(true);

    const contextPrompt = `
      Conversation context:
      - You are an AI mentor on an educational platform for learning mathematics.
      - User language: ${currentLanguage === 'pl' ? 'Polish' : 'English'}.
      - IMPORTANT: Your response MUST use Markdown for formatting (e.g., lists with *, bold with **, italics with *).
      ${user ? `- User: ${user.name}` : '- User: not logged in'}
      - Conversation history: ${messages.map(m => `${m.type}: ${m.content}`).join(' | ')}
      
      User question: ${userInput}
      
      Respond in a way that is:
      1. Helpful, short and friendly.
      2. Adapted to the student's level.
      3. Focused on understanding mathematical concepts.
      4. In ${currentLanguage === 'pl' ? 'Polish' : 'English'} language.
    `;

    try {
      const response = await callSecureApi('/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: contextPrompt,
          locale: currentLanguage,
          history: messages.map(m => ({ role: m.type, content: m.content }))
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (!result || typeof result.reply !== 'string') {
        throw new Error('Invalid proxy response structure');
      }

      return result.reply;
    } catch (error) {
      if (typeof error?.message === 'string' && error.message.includes('Secure proxy URL')) {
        return t('chatConfigError');
      }
      return t('chatErrorMessage');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const aiResponse = await generateGeminiResponse(inputValue);
    
    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: aiResponse,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, aiMessage]);
    speakIfEnabled(aiResponse);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const renderMessageContent = (content) => (
    // ZMIANA: Używamy ReactMarkdown do renderowania treści.
    // Klasy `prose` (z pluginu @tailwindcss/typography) dbają o ładne style.
    // Klasy `prose-p:my-0` itd. usuwają domyślne marginesy, aby tekst w dymku był zwarty.
    <div className="prose prose-sm max-w-none text-inherit prose-p:my-0 prose-ul:my-1 prose-li:my-0 prose-strong:text-inherit prose-em:text-inherit">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );

  if (isMobile) {
    // ... (reszta kodu dla widoku mobilnego bez zmian, ale z użyciem renderMessageContent)
    return (
        <div className={`bg-ai-bg shadow-lg transition-all duration-300 ${isExpanded ? 'h-96' : 'h-16'} fixed bottom-0 left-0 md:left-16 right-0 z-20`}>
          <button onClick={() => setIsExpanded(!isExpanded)} className="w-full p-4 flex items-center justify-between border-b border-ai-bg/50">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-nav-bg" />
              <h3 className="font-semibold text-text-color">{t('aiMentor')}</h3>
            </div>
            <ChevronUp className={`w-5 h-5 text-nav-bg transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
  
          {isExpanded && (
            <>
              <div className="h-64 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${message.type === 'user' ? 'bg-accent-primary text-white' : 'bg-bg-card text-text-color'}`}>
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                ))}
              </div>
  
              <div className="p-4 border-t border-ai-bg/50">
                <div className="flex gap-2">
                  <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder={t('typeMessage')} className="flex-1 p-2 border border-bg-neutral rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color bg-white" rows="2" disabled={isLoading} />
                  <button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} className="px-3 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      );
  }

  return (
    <div className="bg-ai-bg shadow-lg w-full h-full flex flex-col">
      <div className="p-4 border-b border-ai-bg/50 bg-ai-bg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-nav-bg" />
          <h3 className="font-semibold text-text-color">{t('aiMentor')}</h3>
        </div>
        <button
          onClick={handleClearChat}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          title={t('clearChat') || "Clear chat history"}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${message.type === 'user' ? 'bg-accent-primary text-white' : 'bg-bg-card text-text-color'}`}>
              {/* ZMIANA: Wywołanie funkcji renderującej */}
              {renderMessageContent(message.content)}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-ai-bg/50">
        <div className="flex gap-2">
          <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder={t('typeMessage')} className="flex-1 p-2 border border-bg-neutral rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color bg-white" rows="2" disabled={isLoading} />
          <button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} className="px-3 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;