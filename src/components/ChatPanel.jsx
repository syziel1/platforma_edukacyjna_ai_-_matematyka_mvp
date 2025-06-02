import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ChatPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Cześć! Jestem twoim mentorem AI. Zadaj mi pytanie o matematykę lub lekcję.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const { translate } = useLanguage();

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'To bardzo interesujące pytanie! W tym problemie kluczowe jest zrozumienie, że szukamy maksimum funkcji kwadratowej. Czy chcesz, żebym wyjaśnił to krok po kroku?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-ai-bg shadow-lg w-80 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-ai-bg/50 bg-ai-bg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-nav-bg" />
          <h3 className="font-semibold text-text-color">
            {translate('aiMentor')}
          </h3>
        </div>
      </div>

      {/* Messages */}
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

      {/* Input */}
      <div className="p-4 border-t border-ai-bg/50">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={translate('typeMessage')}
            className="flex-1 p-2 border border-bg-neutral rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color bg-white"
            rows="2"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
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