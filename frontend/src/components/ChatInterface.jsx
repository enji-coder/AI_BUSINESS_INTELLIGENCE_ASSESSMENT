import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare,
  Lightbulb,
  CornerDownLeft,
  ArrowRight
} from 'lucide-react';

export default function ChatInterface({ onSendMessage, chatHistory = [] }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(chatHistory);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setMessages(chatHistory);
    }
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
      agent_sources: 'Director Prompt',
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
          message: `Error connecting to agents: ${err.message}`,
          agent_sources: 'System Exception',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    {
      q: "Why is our student dropout rate 23.94% and which courses are most affected?",
      tag: "Operations & Academic Risk"
    },
    {
      q: "How much tuition fee is currently uncollected (pending + failed)?",
      tag: "Tuition & Financial Controller"
    },
    {
      q: "What are the key attendance differences between Online and Hybrid delivery?",
      tag: "Demographics & Marketing"
    },
    {
      q: "What are the urgent Human-in-the-Loop recommendations awaiting Director approval?",
      tag: "Strategy & Governance"
    }
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-2xl">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Multi-Agent Decision Intelligence Q&A
            </h3>
            <p className="text-[11px] text-slate-400">
              Grounded exclusively on 8,300+ database records • Zero Hallucination Mode
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Audit Fact-Checked
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-5">
            <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Ask the Multi-Agent Intelligence Swarm</h4>
              <p className="text-xs text-slate-400 max-w-lg mt-1.5 leading-relaxed">
                Pose strategic, operational, financial, or demographic questions. The collective intelligence will route your inquiry to the appropriate specialized agent.
              </p>
            </div>

            {/* Quick Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full pt-2">
              {sampleQuestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.q)}
                  className="p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition flex flex-col justify-between group shadow-sm"
                >
                  <p className="text-xs text-slate-200 font-medium group-hover:text-white leading-snug mb-2">
                    "{item.q}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="text-cyan-400 font-mono">{item.tag}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
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
                className={`flex items-start space-x-3.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                  isUser 
                    ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20' 
                    : 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-5 text-xs space-y-2 shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {!isUser && msg.agent_sources && (
                    <div className="flex items-center space-x-1.5 text-[10px] text-cyan-400 font-mono pb-1.5 border-b border-slate-800/80 font-bold">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{msg.agent_sources}</span>
                    </div>
                  )}

                  <div className="whitespace-pre-line leading-relaxed font-sans text-xs">
                    {msg.message}
                  </div>

                  <div className={`text-[10px] pt-1 text-right font-mono ${isUser ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {new Date(msg.created_at || Date.now()).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 rounded-tl-none flex items-center space-x-2.5 text-xs text-slate-300">
              <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Agents collaborating & retrieving exact database metrics...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about student retention, fees, attendance bottlenecks, or recommendations..."
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-2xl px-5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center space-x-2 ${
              !input.trim() || loading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 active:scale-95'
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
