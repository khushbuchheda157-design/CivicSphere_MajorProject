import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import StatCard from "../components/common/StatCard";
import QuickActionGrid from "../components/dashboard/QuickActionGrid";
import RecentChatsList from "../components/dashboard/RecentChatsList";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../data/mockData";
import { chatService } from "../services/chatService";
import { documentService } from "../services/documentService";
import { schemeService } from "../services/schemeService";

export default function Dashboard() {
  const { user } = useAuth();
  const [chats] = useState(() => chatService.getRecentChats());
  const [docs] = useState(() => documentService.getDocuments());
  const [schemes] = useState(() => schemeService.getSchemes());

  const firstName = user?.name ? user.name.split(" ")[0] : "Citizen";
  const stats = getDashboardStats(chats, docs, schemes);

  return (
    <div className="space-y-6">
      {/* Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17212B] flex items-center gap-2">
            Hello, {firstName} <span className="animate-wave inline-block">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
            Welcome back! How can I assist you today?
          </p>
        </div>

        {/* Quick query launcher bar */}
        <div className="flex items-center gap-2">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#15965B] hover:bg-[#087443] text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask CivicSphere</span>
          </Link>
        </div>
      </div>

      {/* 4 Dynamic Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            accent={stat.accent}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Quick Action Cards */}
      <QuickActionGrid />

      {/* Two Column Layout: Recent Chats + Grounded Intelligence Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Chats (8 cols) */}
        <div className="lg:col-span-7">
          <RecentChatsList chats={chats} />
        </div>

        {/* Right Column: Quick Civic Knowledge & Resources (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Evidence Grounding Card */}
          <div className="bg-gradient-to-br from-[#080D18] to-[#111A2E] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#15965B]/20 text-[11px] font-semibold text-emerald-300 border border-[#15965B]/30">
                <ShieldCheck className="w-3.5 h-3.5 text-[#15965B]" />
                <span>Statutory Grounding</span>
              </div>
              <h3 className="text-base font-bold">
                Evidence-Grounded Law Repository
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All generated responses are verified against current Indian legislation, Central gazettes, and Supreme Court doctrine.
              </p>
              <div className="pt-1">
                <Link
                  to="/civic-knowledge"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15965B] hover:text-emerald-400 transition"
                >
                  <span>Explore Knowledge Graph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            {/* Subtle decorative circles */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-[#15965B]/10 blur-xl" />
          </div>

          {/* Featured Scheme Reminder Card */}
          <div className="bg-white rounded-2xl border border-[#E5EAE8] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#17212B]">
                Key Welfare Scheme Alert
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Action Required
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#17212B]">
              PM Kisan e-KYC Verification
            </h4>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Mandatory Aadhaar OTP verification for upcoming 17th disbursement cycle. Verify online before release.
            </p>
            <div className="mt-3.5 pt-3 border-t border-[#E5EAE8] flex items-center justify-between">
              <Link
                to="/schemes"
                className="text-xs font-bold text-[#15965B] hover:text-[#087443] transition"
              >
                Check Eligibility →
              </Link>
              <a
                href="https://pmkisan.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#64748B] hover:text-[#17212B] flex items-center gap-1"
              >
                Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
