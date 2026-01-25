
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, User, Bot, Sparkles, Trash2, Briefcase } from 'lucide-react';
import { aiService } from '../services/aiService';
import { Course, Student, Enrollment, ChatMessage } from '../types';

interface ChatBotProps {
  courses: Course[];
  user: Student | null;
  enrollments: Enrollment[];
  leaderboard: Student[];
}

const WELCOME_TEXT = "Hello! I'm **Prof. Fad**, your AI academic advisor and SME strategist. 🎓💼\n\nI can help you find courses, check your progress, or **generate SME business ideas** based on your STEAM skills. How can I assist you today?";

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
    "Generate Business Idea",
    "What is STEAM-IE?",
    "Recommend a course",
    "How is my progress?",
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

  // Simple Markdown-like parser for links and bold text
  const renderText = (text: string) => {
    // Matches Markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    const parts = text.split(/(\[.*?\]\(.*?\))|(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (!part) return null;
      
      // Handle links
      const linkMatch = [...part.matchAll(linkRegex)];
      if (linkMatch.length > 0) {
        return (
          <a 
            key={index} 
            href={linkMatch[0][2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-200 underline hover:text-white font-bold"
          >
            {linkMatch[0][1]}
          </a>
        );
      }
      
      // Handle bold
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 md:bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center
          ${isOpen 
            ? 'bg-red-500 text-white rotate-90 shadow-red-500/20' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-indigo-500/20'
          }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-[144px] md:bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-12rem)] glass dark:glass border border-white/20 dark:border-white/5 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-scale-in origin-bottom-right">
          
          {/* Header */}
          <div className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md p-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Prof. Fad</h3>
                <p className="text-[10px] text-indigo-200 flex items-center gap-1 font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                  SME Advisor
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleClearHistory}
              className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-white/5"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white/50 dark:bg-slate-950/50 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-indigo-500 text-white'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                  ${msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'glass dark:glass text-slate-800 dark:text-slate-200 rounded-tl-none border border-white/20 dark:border-white/5'
                  }`}
                >
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 animate-pulse">
                 <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
                   <Bot className="w-4 h-4" />
                 </div>
                 <div className="glass dark:glass p-4 rounded-2xl rounded-tl-none border border-white/20 dark:border-white/5 shadow-sm flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Generating Strategy...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {!isLoading && (
            <div className="px-4 pt-3 pb-1 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm border-t border-white/10">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-bold transition-all whitespace-nowrap shadow-sm
                      ${prompt === 'Generate Business Idea' 
                        ? 'bg-amber-500 text-white border-amber-400 hover:bg-amber-400' 
                        : 'glass dark:glass text-slate-600 dark:text-slate-300 border-white/20 dark:border-white/5 hover:bg-white/10 dark:hover:bg-white/5'
                      }`}
                  >
                    {prompt === 'Generate Business Idea' ? <Briefcase className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-indigo-400" />}
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask about SME ideas, courses..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="w-full pl-5 pr-14 py-3.5 glass dark:glass border border-white/20 dark:border-white/10 text-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-slate-400 text-sm shadow-inner"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="mt-3 flex justify-between items-center px-1">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">AI Stratgegy Engine</p>
               <a href="https://businessideabank.netlify.net" target="_blank" rel="noreferrer" className="text-[9px] font-black text-amber-500 dark:text-amber-400 uppercase tracking-tighter hover:underline flex items-center gap-1">
                  Idea Bank <Briefcase className="w-2 h-2" />
               </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
