/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Calendar, Compass, Sprout, Landmark, MessageSquareText, ShieldAlert, Sparkles, Send, X } from "lucide-react";
import { AIChatMessage } from "../types";

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"advisor" | "predictor">("advisor");
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Hello! I am **Donare AI**, your transparent social impact predictor. Use the tabs below to ask guidelines on verified NGO campaigns, or execute an **Impact Prediction Plan** to project quantitative socio-economic yields for your planned donation!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  
  // Chat typing input
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Predictor form state
  const [predCategory, setPredCategory] = useState("Books & Studying");
  const [predValue, setPredValue] = useState("S$ 750");
  const [predictionOutputMarkdown, setPredictionOutputMarkdown] = useState<string>("");
  const [isPredictorLoading, setIsPredictorLoading] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping, predictionOutputMarkdown]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ sender: m.sender, text: m.text }))
        })
      });
      const data = await response.json();
      
      setMessages((prev) => [...prev, {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: data.reply || "I am processing transparent donation audits. How can I help you?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        id: `msg-err`,
        sender: "ai",
        text: "My ledger connector encountered an administrative delay. Please re-type your request shortly!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePredictorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredictorLoading(true);
    setPredictionOutputMarkdown("");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          predictionPlan: {
            category: predCategory,
            value: predValue
          }
        })
      });
      const data = await response.json();
      setPredictionOutputMarkdown(data.reply || "Projections completed.");
    } catch (err) {
      console.error("Predictor error:", err);
      setPredictionOutputMarkdown("Administrative feedback delayed. Please connect your global Gemini API key inside Secrets.");
    } finally {
      setIsPredictorLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="ai-companion-floating-system">
      
      {/* 1. Toggle circular button */}
      {!isOpen && (
        <button
          id="btn-open-ai-chat"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-600 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center transition-all group ring-4 ring-emerald-100"
          title="Open Donare AI Assistant"
        >
          <Sparkles className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
          
          <span className="absolute right-full mr-3.5 bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Ask Donare AI Advisor
          </span>
        </button>
      )}

      {/* 2. Floating AI Chat panel body */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white border border-slate-150 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between" id="ai-chat-panel">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center relative">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white animate-pulse">
                <Sparkles className="w-4.5 h-4.5 fill-current" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-white leading-none">Donare Intelligence</h4>
                <span className="text-[9px] font-mono tracking-wider uppercase text-emerald-400 block mt-1">Smart Impact Forecasts</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switch tabs */}
          <div className="flex bg-slate-50 border-b border-slate-100 p-1">
            <button
              onClick={() => setActiveMode("advisor")}
              className={`flex-1 py-1.5 text-[10px] tracking-wide uppercase font-black rounded-lg transition-transform ${
                activeMode === "advisor"
                  ? "bg-white text-slate-800 shadow-2xs scale-98"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Donation Assistant
            </button>
            <button
              onClick={() => setActiveMode("predictor")}
              className={`flex-1 py-1.5 text-[10px] tracking-wide uppercase font-black rounded-lg transition-transform ${
                activeMode === "predictor"
                  ? "bg-white text-slate-800 shadow-2xs scale-98"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Impact Plan Predictor
            </button>
          </div>

          {/* Body Panels content */}
          {activeMode === "advisor" ? (
            /* Advisor Chat viewport */
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[85%] ${
                      m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <div className={`p-3 rounded-2xl text-[11px] font-sans leading-relaxed ${
                      m.sender === "user"
                        ? "bg-slate-900 text-white rounded-br-none"
                        : "bg-slate-50 text-slate-850 border border-slate-100 rounded-bl-none"
                    }`}>
                      {/* Very simple markdown parsing helper for bold matches */}
                      {m.text.split("**").map((chunk, idx) => 
                        idx % 2 === 1 ? <strong key={idx} className="font-black text-emerald-600">{chunk}</strong> : chunk
                      )}
                    </div>
                    <span className="text-[8px] font-mono text-slate-400 mt-1">{m.timestamp}</span>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center space-x-1 p-2 bg-slate-50 rounded-xl max-w-max text-[9px] text-slate-400 animate-pulse font-mono">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <span>AI Model is structuring recommendations...</span>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask donor questions, tracking code etc..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-150 focus:border-slate-850 rounded-xl text-xs font-sans focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-slate-900 hover:bg-emerald-500 rounded-xl text-white transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : (
            /* Predictor Form & Outcome analysis viewport */
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4" id="predictor-viewport">
                
                {/* Inputs area */}
                <form onSubmit={handlePredictorSubmit} className="space-y-3.5 p-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-3xs" id="predictor-inputs">
                  <div className="grid grid-cols-2 gap-2.5">
                    
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Target Category</label>
                      <select
                        value={predCategory}
                        onChange={(e) => setPredCategory(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-150 rounded-lg text-[10px] uppercase font-bold text-slate-650"
                      >
                        <option value="School Textbooks & Laptops">Books & Study</option>
                        <option value="Maternal hot-meals Center">Food Kitchens</option>
                        <option value="Disaster Winter Blankets">Warm clothes</option>
                        <option value="Clean Classrooms Build">Direct Funds</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">Pledge Support</label>
                      <input
                        type="text"
                        value={predValue}
                        onChange={(e) => setPredValue(e.target.value)}
                        placeholder="e.g. S$ 1,000"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-150 rounded-lg text-[10px] font-mono font-black text-slate-850 focus:outline-none"
                      />
                    </div>

                  </div>

                  <button
                    id="btn-predictor-run"
                    type="submit"
                    disabled={isPredictorLoading}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-[10px] font-sans tracking-wide shadow-md shadow-emerald-500/15 cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <span>{isPredictorLoading ? "Forecasting outcome..." : "Predict Social Outcome"}</span>
                  </button>
                </form>

                {/* Outputs results markdown renderer */}
                {predictionOutputMarkdown && (
                  <div className="p-4 bg-slate-900 border border-slate-800 text-white font-sans text-xs rounded-2xl shadow-md space-y-2.5 leading-relaxed" id="prediction-output">
                    
                    <div className="flex items-center space-x-1.5 text-emerald-400 text-[10px] uppercase font-mono font-black border-b border-slate-800 pb-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Social Horizon Projections</span>
                    </div>

                    {/* Simple rendering logic for bullet outputs */}
                    <div className="space-y-2 font-sans tracking-normal leading-relaxed text-[11px] text-slate-200">
                      {predictionOutputMarkdown.split("\n").map((line, idx) => {
                        if (line.startsWith("###")) {
                          return <h4 key={idx} className="font-extrabold text-emerald-400 text-xs mt-2.5 block leading-tight">{line.replace("###", "")}</h4>;
                        } else if (line.trim().startsWith("-")) {
                          return (
                            <div key={idx} className="flex items-start space-x-1">
                              <span className="text-emerald-500 font-black flex-shrink-0 mt-0.5">•</span>
                              <span>
                                {line.replace("-", "").split("**").map((piece, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-white">{piece}</strong> : piece)}
                              </span>
                            </div>
                          );
                        } else {
                          return (
                            <p key={idx} className="leading-relaxed">
                              {line.split("**").map((piece, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-white">{piece}</strong> : piece)}
                            </p>
                          );
                        }
                      })}
                    </div>
                  </div>
                )}

                {isPredictorLoading && (
                  <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-500 animate-pulse font-mono">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 border-t-transparent animate-spin"></div>
                    <span>Computing quantitative statistics yields...</span>
                  </div>
                )}
                
                <div ref={endRef} />
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
