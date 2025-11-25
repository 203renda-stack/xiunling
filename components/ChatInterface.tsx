import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Icons } from '../constants';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'model',
      text: '你好！我是心灵 (XinLing)。今天感觉怎么样？无论你想聊什么，我都在这里陪着你。🌱',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session Tracking State
  const startTimeRef = useRef(Date.now());
  const [sessionDuration, setSessionDuration] = useState('00:00');
  const [interactionCount, setInteractionCount] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Scroll on new message or loading state change

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diffInSeconds = Math.floor((now - startTimeRef.current) / 1000);
      
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;
      
      setSessionDuration(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setInteractionCount(prev => prev + 1); // Increment count

    try {
      const responseText = await sendMessageToGemini(messages, userMsg.text);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-sage-50 relative">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-sm z-20 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-700 shadow-sm border-2 border-white">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">XinLing 陪伴</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[11px] text-slate-500 font-medium">在线 • 隐私保护中</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Session Stats Bar */}
        <div className="flex gap-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 justify-between items-center shadow-inner">
            <div className="flex items-center gap-4 px-1">
                <div className="flex items-center gap-1.5">
                    <Icons.Clock className="w-3.5 h-3.5 text-sage-500" />
                    <span>陪伴时长: <span className="font-mono font-bold text-sage-700">{sessionDuration}</span></span>
                </div>
                <div className="flex items-center gap-1.5 pl-4 border-l border-slate-200">
                    <Icons.Message className="w-3.5 h-3.5 text-sage-500" />
                    <span>互动: <span className="font-mono font-bold text-sage-700">{interactionCount}</span></span>
                </div>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      {/* Added pb-48 to ensure content isn't hidden behind the floating input box */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar pb-48">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
             {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm mr-2 shrink-0 mt-1 border border-teal-200 shadow-sm">
                    🤖
                </div>
             )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-sage-600 text-white rounded-br-none'
                  : 'bg-white text-slate-700 rounded-bl-none border border-sage-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
             <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm mr-2 shrink-0 mt-1 border border-teal-200">
                🤖
            </div>
            <div className="bg-white rounded-2xl rounded-bl-none px-4 py-4 border border-sage-100 shadow-sm flex items-center gap-1.5 h-12">
              <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Adjusted position to sit ABOVE the NavBar */}
      <div className="absolute bottom-[68px] left-0 right-0 bg-white border-t border-slate-100 px-3 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-sage-400 focus-within:ring-1 focus-within:ring-sage-400 transition-all flex items-center relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="告诉心灵你的想法..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm px-4 py-3 max-h-32 resize-none text-slate-700 placeholder:text-slate-400"
              rows={1}
            />
          </div>
           {/* Placeholder for Voice Input */}
          <button 
             className="p-3 text-slate-400 hover:text-sage-600 hover:bg-sage-50 rounded-full transition-colors active:scale-95"
             title="语音输入"
             onClick={() => alert("语音功能开发中，请期待！")}
          >
            <Icons.Mic className="w-6 h-6" />
          </button>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`p-3 rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center ${
              inputText.trim() && !isLoading
                ? 'bg-sage-600 text-white hover:bg-sage-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Icons.Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;