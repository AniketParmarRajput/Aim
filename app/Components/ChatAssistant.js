"use client";
import React, { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";

const SUGGESTIONS = ["Show me best sellers", "Men's products under ₹1500", "Any sale items?", "Do you have shoes?"];

const ChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm the Easy Shop assistant 🛍️ Ask me about products, prices, or deals." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const bottomRef = useRef(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/getPrizing`)
        .then((r) => r.json())
        .then((res) => setCatalog(res.data || []))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  const send = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gemini/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, products: catalog }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "bot", text: data.reply || "Sorry, I couldn't respond. Please try again." }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "bot", text: "Something went wrong connecting to the assistant. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-xl shadow-orange-500/30 hover:scale-110 hover:bg-orange-500 transition-all duration-300"
      >
        <Bot size={26} />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-dark border-2 border-white" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-[360px] bg-brand-light rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scale-in flex flex-col" style={{ height: "min(520px, calc(100vh - 3rem))" }}>
          {/* Header */}
          <div className="flex items-center justify-between bg-brand-dark px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-tan to-brand-orange flex items-center justify-center text-white">
                <Bot size={17} />
              </div>
              <div>
                <p className="text-white text-[13px] font-bold leading-tight">Easy Shop Assistant</p>
                <p className="text-[10px] text-green-400 font-medium">● Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors" aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] text-[12.5px] leading-relaxed px-3.5 py-2.5 rounded-2xl whitespace-pre-wrap break-words ${
                    m.role === "user"
                      ? "bg-brand-dark text-white rounded-br-md"
                      : "bg-brand-cream border border-gray-200 text-gray-800 rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-brand-cream border border-gray-200 text-gray-500 text-[12.5px] px-4 py-2.5 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && !loading && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-[11px] font-medium text-brand-orange bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full hover:bg-orange-100 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2 border-t border-gray-200 px-3 py-2.5 bg-brand-light"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products..."
              className="flex-1 px-3.5 py-2.5 text-[13px] bg-brand-cream border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all"
            />
            <button type="submit" disabled={loading} className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center hover:bg-orange-500 disabled:opacity-50 transition-all shrink-0" aria-label="Send message">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;