"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Chào bạn 👋 Mình là trợ lý AI của HUGs STUDIO. Mình có thể giúp gì cho bạn hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg.content,
          history: messages 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        console.error(data.error);
        setMessages((prev) => [...prev, { role: "assistant", content: "Xin lỗi, hiện tại đường truyền đang gặp chút sự cố. Bạn thử lại sau nhé." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Xin lỗi, hiện tại đường truyền đang gặp chút sự cố. Bạn thử lại sau nhé." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-2 rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open Chat"
      >
        <Image 
          src="/CHATBOT HUGSTUDIO.png" 
          alt="Chatbot Icon" 
          width={60} 
          height={60} 
          className="rounded-full select-none"
        />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-[60] w-[350px] sm:w-[400px] h-[500px] max-h-[85vh] flex flex-col bg-[#141414] border border-[#222] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#222] bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#333]">
                  <Image 
                    src="/CHATBOT HUGSTUDIO.png" 
                    alt="HUGs AI" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium leading-none">HUGs Assistant</h3>
                  <span className="text-xs text-white/50 mt-1 block">AI Agent</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/50 hover:text-white transition-colors hover:bg-white/10 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-5 pb-2 scrollbar-none flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-white text-black rounded-br-sm shadow-md' 
                        : 'bg-[#222] border border-[#333] text-white/90 rounded-bl-sm'
                    }`}
                  >
                    <div className={`markdown font-sans [&>p]:mb-2 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>li]:mb-1 [&_strong]:font-semibold ${msg.role === 'user' ? '[&_strong]:text-black' : '[&_strong]:text-white'}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#222] border border-[#333] px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                    <motion.div 
                      animate={{ y: [0, -4, 0] }} 
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-1.5 h-1.5 bg-white/40 rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -4, 0] }} 
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-white/40 rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -4, 0] }} 
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-white/40 rounded-full"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1a1a1a] border-t border-[#222]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Hỏi mình bất cứ điều gì..."
                  className="w-full bg-[#111] border border-[#333] focus:border-white/40 transition-colors text-white text-sm rounded-full py-2.5 pl-4 pr-12 outline-none placeholder:text-white/30"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1 text-black bg-white disabled:bg-white/20 disabled:text-black/50 p-1.5 rounded-full transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-white/30">Powered by Google Vertex AI</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
