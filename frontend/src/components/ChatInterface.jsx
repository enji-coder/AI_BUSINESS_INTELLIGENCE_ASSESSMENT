import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export default function ChatInterface({ onSendMessage, chatHistory = [] }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(chatHistory);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(chatHistory);
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = {
      role: 'user',
      message: text,
      agent_sources: 'Executive Prompt',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await onSendMessage(text);
      const asstMsg = {
        role: 'assistant',
        message: res.reply,
        agent_sources: res.agent_sources || 'Multi-Agent Swarm',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, asstMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          message: `Error generating response: ${err.message}`,
          agent_sources: 'System Error',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "What is our overall student dropout rate and retention status?",
    "How much tuition fee is currently outstanding (pending + failed)?",
    "Which course has the highest student enrollment and dropout risk?",
    "What are the urgent HITL recommendations formulated by the Strategy Agent?"
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Multi-Agent Collective Intelligence Chat
            </h3>
            <p className="text-[11px] text-slate-400">
              Grounded exclusively on 8,300+ database records • Zero Hallucination Mode Active
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Audit Fact-Checked
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Ask the Education Intelligence Collective</h4>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                Pose strategic, operational, financial, or demographic questions. The system will route your query to the appropriate specialized agent.
              </p>
            </div>

            {/* Quick Prompt Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl w-full pt-4">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-left text-xs text-slate-300 transition flex items-start space-x-2 group"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                  isUser 
                    ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20' 
                    : 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-xs space-y-1.5 ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}>
                  {!isUser && msg.agent_sources && (
                    <div className="flex items-center space-x-1.5 text-[10px] text-cyan-400 font-mono pb-1 border-b border-slate-800/80">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{msg.agent_sources}</span>
                    </div>
                  )}

                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.message}
                  </div>

                  <div className={`text-[10px] pt-1 text-right ${isUser ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {new Date(msg.created_at || Date.now()).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 rounded-tl-none flex items-center space-x-2 text-xs text-slate-400">
              <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Agents collaborating and retrieving database metrics...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about student retention, fees, attendance bottlenecks, or recommendations..."
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              !input.trim() || loading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/25 active:scale-95'
            }`}
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
