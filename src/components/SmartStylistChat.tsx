/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageSquare, Send, Bot, Sparkles, Loader2, RefreshCw, ShoppingBag, X } from "lucide-react";
import { Product, ShoppingMessage } from "../types";

interface SmartStylistChatProps {
  catalogProducts: Product[];
  onProductClick: (product: Product) => void;
  onClose?: () => void;
}

export default function SmartStylistChat({ catalogProducts, onProductClick, onClose }: SmartStylistChatProps) {
  const [messages, setMessages] = useState<ShoppingMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "أهلاً بك في بوتيك يزن للأزياء والتفصيل. أنا مستشارك الخاص للأناقة وتنسيق الملابس بالذكاء الاصطناعي ✨\n\nكيف يمكنني مساعدتكِ اليوم؟ يمكنكِ أن تسألني عن تنسيق الألوان، أو اقتراح أقمشة معينة، أو البحث عن عباءات أو ثياب رجالية لمناسبة محددة!",
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    
    const userMessage: ShoppingMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/smart-shopping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({ role: m.sender === "user" ? "user" : "model", parts: [{ text: m.text }] })),
          catalogProducts,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Match recommended product IDs from catalog
        const recProducts = catalogProducts.filter((p) => 
          (data.recommendedProductIds || []).includes(p.id)
        );

        const assistantMessage: ShoppingMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "assistant",
          text: data.responseText,
          timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
          recommendedProducts: recProducts.length > 0 ? recProducts : undefined,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error();
      }
    } catch (err) {
      const errorMessage: ShoppingMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        text: "معذرةً، حدثت مشكلة أثناء الاتصال بخبير الأناقة. هل تود أن تسألني عن عباءة، فستان، ثوب، صندل، أو عطر؟ سأساعدك فوراً!",
        timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "assistant",
        text: "أهلاً بك مجدداً في بوتيك يزن للأزياء الفاخرة. أنا مستشارك للأناقة والموضة. ما الذي تبحث عنه اليوم لتسوق مخصص أو تفصيل مميز؟",
        timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[550px] w-full max-w-sm shrink-0">
      {/* Header */}
      <div className="p-4 bg-stone-950 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-white text-sm">مستشار يزن للأناقة</h4>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span className="text-[10px] text-stone-400">متصل الآن ومستعد لإرشادك</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            id="clear-chat-btn"
            onClick={clearChat} 
            title="إعادة تهيئة المحادثة" 
            className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button 
              id="close-chat-btn"
              onClick={onClose} 
              className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-stone-950/20">
        {messages.map((msg) => (
          <div
            id={`chatmsg-${msg.id}`}
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === "user" ? "mr-auto items-end" : "ml-auto items-start"
            }`}
          >
            <div
              className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-amber-600 text-white rounded-br-none"
                  : "bg-stone-800/80 text-stone-100 rounded-bl-none border border-stone-700/30"
              } whitespace-pre-wrap`}
            >
              {msg.text}
            </div>

            {/* Recommended Products display */}
            {msg.recommendedProducts && (
              <div className="mt-2.5 space-y-2 w-full">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">منتجات مرشحة لك:</span>
                <div className="grid grid-cols-1 gap-2">
                  {msg.recommendedProducts.map((p) => (
                    <div 
                      id={`rec-item-${p.id}`}
                      key={p.id}
                      onClick={() => onProductClick(p)}
                      className="p-2 bg-stone-900 border border-stone-800 rounded-xl flex gap-2.5 hover:border-amber-500/50 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-12 h-12 rounded-lg object-cover bg-stone-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <h5 className="font-bold text-xs text-white truncate">{p.name}</h5>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono text-[11px] text-amber-400 font-bold">{p.price} ر.س</span>
                          <span className="text-[9px] bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded">
                            {p.category === "women" ? "نسائي" : "رجالي"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <span className="text-[10px] text-stone-500 font-mono mt-1">{msg.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-amber-500 text-xs py-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>جاري تحليل طلبك من قبل مستشار الأناقة...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-stone-950 border-t border-stone-800 flex gap-2">
        <input
          id="chat-input-text"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="مثال: أحتاج ثوب أبيض رسمي فاخر للعمل..."
          className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white text-sm focus:border-amber-600 focus:outline-none placeholder:text-stone-500"
        />
        <button
          id="btn-chat-send"
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-800 disabled:text-stone-600 text-white rounded-xl transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
