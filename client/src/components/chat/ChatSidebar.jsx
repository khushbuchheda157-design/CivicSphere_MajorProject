import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import Button from "../common/Button";

export default function ChatSidebar({
  recentChats,
  onNewChat,
  onDeleteChat,
  activeChatId,
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E5EAE8] p-4 flex flex-col h-full shadow-xs ${className}`}
    >
      {/* New Chat Button matching Reference Image 5 */}
      <Button
        variant="primary"
        size="md"
        leftIcon={Plus}
        onClick={onNewChat}
        className="w-full font-bold shadow-sm mb-4"
      >
        New Chat
      </Button>

      {/* Recent Chats Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5EAE8]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Recent Chats
          </span>
          <Link
            to="/history"
            className="text-[11px] font-semibold text-[#15965B] hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="overflow-y-auto space-y-1 pr-1 flex-1">
          {recentChats.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#64748B]">
              No recent chats
            </div>
          ) : (
            recentChats.map((c) => {
              const isActive = activeChatId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => navigate(`/chat/${c.id}`)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition text-xs ${
                    isActive
                      ? "bg-[#15965B]/10 text-[#087443] font-bold border border-[#15965B]/20"
                      : "text-[#17212B] hover:bg-[#F5F8F7]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate mr-1">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? "text-[#15965B]" : "text-slate-400"
                      }`}
                    />
                    <span className="truncate">{c.title}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(c.id);
                      }}
                      className="p-1 hover:text-red-500 rounded transition"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
