import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const ChatPanel = ({ isMobile = false }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { speakIfEnabled } = useTextToSpeech();
  
  // Tworzymy unikalny klucz do localStorage dla każdego użytkownika lub gościa
  const storageKey = `chatHistory_${user?.id || 'anonymous'}`;

  // --- NOWY KOD: Efekt do wczytywania historii czatu przy starcie ---
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages && savedMessages.length > 2) { // Prosta walidacja, czy dane nie są puste "[]"
        setMessages(JSON.parse(savedMessages));
      } else {
        // Jeśli brak historii, utwórz nową z wiadomością powitalną
        const welcomeMessage = t('chatWelcomeMessage');
        setMessages([{
          id: 1,
          type: 'ai',
          content: welcomeMessage,
          timestamp: new Date().toISOString() // Używamy ISOString dla spójności
        }]);
        speakIfEnabled(welcomeMessage);
      }
    } catch (error) {
        console.error("Failed to parse chat history from localStorage", error);
        // W razie błędu, zacznij od nowa
        const welcomeMessage = t('chatWelcomeMessage');
        setMessages([{
          id: 1,
          type: 'ai',
          content: welcomeMessage,
          timestamp: new Date().toISOString()
        }]);
    }
  }, [storageKey, t]); // Uruchom tylko raz, gdy zmieni się klucz (np. po zalogowaniu)

  // --- NOWY KOD: Efekt do zapisywania historii czatu po każdej zmianie ---
  useEffect(() => {
    // Zapisujemy tylko jeśli są jakieś wiadomości, aby uniknąć nadpisania pustą tablicą
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);


  const generateGeminiResponse = async (userInput) => {
    if (isLoading) return t('chatWaitMessage');
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing Gemini API key');
      return t('chatConfigError');
    }

    const contextPrompt = `
      Conversation context:
      - You are an AI mentor on an educational platform for learning mathematics
      - User language: ${currentLanguage === 'pl' ? 'Polish' : 'English'}
      ${user ? `- User: ${user.name}` : '- User: not logged in'}
      - Conversation history: ${messages.map(m => `${m.type}: ${m.content}`).join(' | ')}
      
      User question: ${userInput}
      
      Respond in a way that is:
      1. Helpful, short and friendly
      2. Adapted to the student's level
      3. Focused on understanding mathematical concepts
      4. In ${currentLanguage === 'pl' ? 'Polish' : 'English'} language
    `;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        role: "user",
        parts: [{
          text: contextPrompt
        }]
      }]
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (!result.candidates || !result.candidates[0]?.content?.parts) {
        throw new Error('Invalid API response structure');
      }

      const text = result.candidates[0].content.parts[0]?.text;
      if (!text) {
        throw new Error('No text in API response');
      }

      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
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
  
  // Reszta komponentu (część JSX) pozostaje bez zmian
  if (isMobile) {
    return (
      <div className={`bg-ai-bg shadow-lg transition-all duration-300 ${isExpanded ? 'h-96' : 'h-16'} fixed bottom-0 left-0 md:left-16 right-0 z-20`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between border-b border-ai-bg/50"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-nav-bg" />
            <h3 className="font-semibold text-text-color">
              {t('aiMentor')}
            </h3>
          </div>
          <ChevronUp className={`w-5 h-5 text-nav-bg transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <>
            <div className="h-64 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-accent-primary text-white'
                        : 'bg-bg-card text-text-color'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-ai-bg/50">
              <div className="flex gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('typeMessage')}
                  className="flex-1 p-2 border border-bg-neutral rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color bg-white"
                  rows="2"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-3 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
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
      {/* Header - no top padding needed as it's handled by RightPanel */}
      <div className="p-4 border-b border-ai-bg/50 bg-ai-bg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-nav-bg" />
          <h3 className="font-semibold text-text-color">
            {t('aiMentor')}
          </h3>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-accent-primary text-white'
                  : 'bg-bg-card text-text-color'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-ai-bg/50">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('typeMessage')}
            className="flex-1 p-2 border border-bg-neutral rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color bg-white"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;