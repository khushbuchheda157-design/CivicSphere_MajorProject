import React, { useState } from "react";
import {
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

export default function ChatMessage({ message, onSelectPrompt }) {
  const isUser = message.sender === "user";
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null

  const handleCopy = () => {
    let fullText = message.text || "";
    if (message.intro) fullText += message.intro + "\n\n";
    if (message.points) fullText += message.points.map((p) => "• " + p).join("\n") + "\n\n";
    if (message.legalSummary) fullText += message.legalSummary + "\n\n";

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
        <div className="max-w-xl bg-[#15965B] text-white rounded-2xl rounded-tr-xs px-4.5 py-3 shadow-xs">
          <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
          <div className="mt-1 text-[10px] text-white/80 text-right">
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  }

  // AI Response bubble matching Reference Image 5
  return (
    <div className="flex justify-start mb-6 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="max-w-2xl w-full bg-white rounded-2xl rounded-tl-xs border border-[#E5EAE8] p-5 shadow-xs">
        
        {/* AI Header with Badge */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5EAE8]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#15965B]/10 text-[#15965B] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#17212B]">CivicSphere AI</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#15965B]/10 text-[#087443] font-semibold">
              Statutory Evidence
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={handleCopy}
              className="p-1 hover:text-[#17212B] rounded transition"
              title="Copy response"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#15965B]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setFeedback(feedback === "up" ? null : "up")}
              className={`p-1 rounded transition ${
                feedback === "up" ? "text-[#15965B]" : "hover:text-[#17212B]"
              }`}
              title="Helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFeedback(feedback === "down" ? null : "down")}
              className={`p-1 rounded transition ${
                feedback === "down" ? "text-red-500" : "hover:text-[#17212B]"
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Structured Body */}
        {message.intro && (
          <p className="text-xs sm:text-sm font-medium text-[#17212B] mb-3 leading-relaxed">
            {message.intro}
          </p>
        )}

        {/* Bullet points */}
        {message.points && message.points.length > 0 && (
          <ul className="space-y-2 mb-4 text-xs sm:text-sm text-[#17212B]">
            {message.points.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15965B] mt-1.5 shrink-0" />
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Legal Summary */}
        {message.legalSummary && (
          <p className="text-xs sm:text-sm text-[#17212B] bg-[#F5F8F7] p-3 rounded-xl border border-[#E5EAE8] mb-4 leading-relaxed font-normal">
            {message.legalSummary}
          </p>
        )}

        {/* Source Citations */}
        {message.sources && message.sources.length > 0 && (
          <div className="mb-4 pt-3 border-t border-[#E5EAE8]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1">
              <span>Sources & Statutory Citations</span>
            </p>
            <div className="space-y-1.5">
              {message.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E5EAE8] hover:border-[#15965B]/40 hover:bg-[#F5F8F7] transition text-xs font-semibold text-[#17212B] group"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="w-4 h-4 rounded-full bg-[#15965B]/10 text-[#087443] flex items-center justify-center text-[10px] shrink-0">
                      {i + 1}
                    </span>
                    <span className="truncate group-hover:text-[#15965B] transition-colors">
                      {src.title}
                    </span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#15965B] shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related Follow-Up Questions */}
        {message.relatedQuestions && message.relatedQuestions.length > 0 && (
          <div className="pt-3 border-t border-[#E5EAE8]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-[#15965B]" />
              <span>Related Inquiries</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {message.relatedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPrompt && onSelectPrompt(q)}
                  className="text-left text-xs text-[#17212B] bg-[#F5F8F7] hover:bg-[#15965B]/10 hover:text-[#087443] hover:border-[#15965B]/30 border border-[#E5EAE8] px-3 py-1.5 rounded-full transition-colors"
                >
                  {q} →
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer timestamp and disclaimer */}
        <div className="mt-4 pt-2.5 border-t border-[#E5EAE8] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-slate-400">
          <span>AI-generated information should be verified with official sources.</span>
          <span>{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
