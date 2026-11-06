import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquareText, FileText, ChevronRight, ArrowRight, Plus } from "lucide-react";

export default function RecentChatsList({ chats = [] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAE8] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5EAE8]">
        <div className="flex items-center gap-2">
          <MessageSquareText className="w-4 h-4 text-[#15965B]" />
          <h3 className="text-sm font-bold text-[#17212B]">Recent Chats</h3>
        </div>
        {chats.length > 0 && (
          <Link
            to="/history"
            className="text-xs font-semibold text-[#15965B] hover:text-[#087443] flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="divide-y divide-[#E5EAE8]">
        {chats && chats.length > 0 ? (
          chats.slice(0, 4).map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#F5F8F7] px-2 rounded-xl transition cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#15965B]/10 text-[#15965B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-[#17212B] group-hover:text-[#15965B] transition-colors truncate">
                    {chat.title}
                  </p>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    {chat.category || "Civic Law"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-400 font-medium">
                  {chat.timestamp}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#17212B] transition-colors" />
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-[#64748B]">
            <p className="font-medium">No recent consultations found.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Start your first inquiry to receive evidence-backed civic guidance.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#E5EAE8] text-center">
        {chats.length > 0 ? (
          <Link
            to="/history"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#15965B] hover:text-[#087443] transition"
          >
            <span>View All Chats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15965B] hover:text-[#087443] transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Start a New Consultation</span>
          </Link>
        )}
      </div>
    </div>
  );
}
