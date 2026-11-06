import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scale,
  Building,
  Users,
  Briefcase,
  ShieldAlert,
  ShieldCheck,
  Send,
  Search,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { popularLegalTopics } from "../data/mockData";
import { useToast } from "../context/ToastContext";

export default function LegalGuidance() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(popularLegalTopics[0]); // Property Law default

  const getTopicIcon = (iconName) => {
    switch (iconName) {
      case "Building":
        return Building;
      case "Users":
        return Users;
      case "Scale":
        return Scale;
      case "Briefcase":
        return Briefcase;
      case "ShieldAlert":
        return ShieldAlert;
      case "ShieldCheck":
        return ShieldCheck;
      default:
        return Scale;
    }
  };

  const getColorStyles = (color) => {
    switch (color) {
      case "amber":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          activeBg: "bg-amber-500/10",
        };
      case "blue":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          activeBg: "bg-blue-500/10",
        };
      case "emerald":
        return {
          bg: "bg-emerald-50",
          text: "text-[#15965B]",
          border: "border-emerald-200",
          activeBg: "bg-emerald-500/10",
        };
      case "rose":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          activeBg: "bg-rose-500/10",
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          activeBg: "bg-purple-500/10",
        };
      case "cyan":
        return {
          bg: "bg-cyan-50",
          text: "text-cyan-700",
          border: "border-cyan-200",
          activeBg: "bg-cyan-500/10",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          activeBg: "bg-slate-500/10",
        };
    }
  };

  const handleAskInChat = (customQuery = null) => {
    const text = customQuery || query;
    if (!text.trim()) {
      showToast("Please enter a legal query first.", "error");
      return;
    }
    navigate("/chat", { state: { initialPrompt: text } });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Legal Guidance"
        subtitle="Get AI-powered legal insights and information"
        badge={
          <Badge variant="emerald" size="sm">
            Statute Indexed
          </Badge>
        }
      />

      {/* Search Input Box matching Reference Image 9 */}
      <div className="bg-white rounded-2xl border border-[#E5EAE8] p-2 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskInChat();
          }}
          className="flex items-center gap-2"
        >
          <Search className="w-5 h-5 text-[#64748B] ml-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your legal question (e.g. rights as a tenant, consumer refund, zero FIR)..."
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-[#17212B] placeholder-[#94A3B8] outline-none py-2 px-1"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-xl bg-[#15965B] hover:bg-[#087443] text-white flex items-center justify-center transition shadow-xs shrink-0"
            title="Search statutory database"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Popular Topics Section matching Reference Image 9 */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
          Popular Topics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {popularLegalTopics.map((topic) => {
            const Icon = getTopicIcon(topic.icon);
            const style = getColorStyles(topic.color);
            const isSelected = selectedTopic?.id === topic.id;

            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`bg-white rounded-2xl border p-4 text-center transition-all duration-200 flex flex-col items-center justify-center cursor-pointer group ${
                  isSelected
                    ? "border-[#15965B] shadow-md ring-1 ring-[#15965B]/20 bg-[#F5F8F7]"
                    : "border-[#E5EAE8] hover:border-[#CBD5E1] hover:shadow-xs"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${style.bg} ${style.text} flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#17212B] group-hover:text-[#15965B] transition-colors">
                  {topic.title}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Topic Breakdown & Provisions */}
      {selectedTopic && (
        <div className="bg-white rounded-2xl border border-[#E5EAE8] p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAE8]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#17212B]">
                  {selectedTopic.title} Knowledge Matrix
                </h3>
                <Badge variant={selectedTopic.color || "emerald"} size="xs">
                  Evidence Grounded
                </Badge>
              </div>
              <p className="text-xs text-[#64748B] mt-1">{selectedTopic.tagline}</p>
            </div>

            <Button
              variant="primary"
              size="sm"
              leftIcon={Sparkles}
              onClick={() => handleAskInChat(`Legal consultation regarding ${selectedTopic.title}`)}
            >
              Consult in Chat
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-[#17212B] leading-relaxed">
            {selectedTopic.description}
          </p>

          {/* Statutory Provisions Table/Cards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
              Key Codified Provisions & Precedents
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {selectedTopic.relevantSections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#F5F8F7] border border-[#E5EAE8] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#15965B]">
                        {sec.section}
                      </span>
                      <span className="text-[10px] text-[#64748B] font-medium bg-white px-2 py-0.5 rounded border border-[#E5EAE8]">
                        Central Act
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#17212B] mb-1.5">
                      {sec.code}
                    </p>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {sec.summary}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#E5EAE8] flex justify-end">
                    <a
                      href="https://www.indiacode.nic.in"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-[#15965B] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read Section Text</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Common Inquiries */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2.5">
              Frequently Inquired Citizen Questions
            </h4>
            <div className="space-y-2">
              {selectedTopic.sampleQueries.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAskInChat(q)}
                  className="p-3 rounded-xl bg-white border border-[#E5EAE8] hover:border-[#15965B]/40 hover:bg-[#F5F8F7] transition cursor-pointer flex items-center justify-between group"
                >
                  <span className="text-xs font-medium text-[#17212B] group-hover:text-[#15965B]">
                    "{q}"
                  </span>
                  <span className="text-xs font-bold text-[#15965B] inline-flex items-center gap-1">
                    <span>Ask AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

