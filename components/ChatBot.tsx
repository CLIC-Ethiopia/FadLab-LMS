
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, User, Bot, Sparkles, Trash2 } from 'lucide-react';
import { aiService } from '../services/aiService';
import { Course, Student, Enrollment, ChatMessage } from '../types';

interface ChatBotProps {
  courses: Course[];
  user: Student | null;
  enrollments: Enrollment[];
  leaderboard: Student[];
}

const WELCOME_TEXT = "Hello! I'm **Prof. Fad**, your AI academic advisor. 🎓\n\nI can help you find courses, check your progress, or answer questions about FadLab. How can I assist you today?";

const ChatBot: React.FC<ChatBotProps> = ({ courses, user, enrollments, leaderboard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize state from localStorage if available
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fadlab_chat_history');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Hydrate date strings back to Date objects
          return parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }));
        }
      } catch (e) {
        console.error("Failed to recover chat history", e);
      }
    }
    return [{
      id: 'welcome',
      role: 'model',
      text: WELCOME_TEXT,
      timestamp: new Date()
    }];
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('fadlab_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history", e);
    }
  }, [messages]);

  const suggestedPrompts = [
    "What is STEAM-IE?",
    "Recommend a course",
    "How is my progress?",
    "How do I submit a project?",
    "Tell me about CLIC Ethiopia"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for the AI service
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      
      const responseText = await aiService.sendMessage(
        userMsg.text,
        { courses, user, enrollments, leaderboard },
        history
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      const resetMessages: ChatMessage[] = [
        {
          id: 'welcome',
          role: 'model',
          text: WELCOME_TEXT,
          timestamp: new Date()
        },
        {
          id: `cleared-${Date.now()}`,
          role: 'model',
          text: "History cleared.",
          timestamp: new Date()
        }
      ];
      setMessages(resetMessages);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple Markdown-like parser for bold text
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Toggle Button - Adjusted position for mobile to sit above BottomNav */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 md:bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center
          ${isOpen 
            ? 'bg-red-500 text-white rotate-90' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
          }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-[144px] md:bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-12rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-in origin-bottom-right">
          
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Prof. Fad</h3>
                <p className="text-xs text-indigo-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online • AI Advisor
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleClearHistory}
              className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-800"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                  ${msg.role === 'user' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
                    : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                  ${msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                  }`}
                >
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                   <Bot className="w-4 h-4" />
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    <span className="text-xs text-slate-400">Prof. Fad is thinking...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {!isLoading && (
            <div className="px-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800/50">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-fade">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap snap-start"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask about courses, progress..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 text-center">
               <p className="text-[10px] text-slate-400">Powered by Gemini 3.0 Pro</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
