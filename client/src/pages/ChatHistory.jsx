import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MessageSquare,
  ChevronRight,
  Trash2,
  Plus,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { chatService } from "../services/chatService";
import { useToast } from "../context/ToastContext";

export default function ChatHistory() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [chats, setChats] = useState(() => chatService.getRecentChats());
  const [searchQuery, setSearchQuery] = useState("");
  const [chatToDelete, setChatToDelete] = useState(null);

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.preview?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (chatToDelete) {
      chatService.deleteChat(chatToDelete.id);
      setChats(chatService.getRecentChats());
      showToast("Conversation deleted from history", "info");
      setChatToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chat History"
        subtitle="View your past conversations"
        badge={
          <Badge variant="emerald" size="sm">
            {chats.length} Sessions
          </Badge>
        }
      >
        <Button
          variant="primary"
          size="sm"
          leftIcon={Plus}
          onClick={() => navigate("/chat")}
        >
          New Consultation
        </Button>
      </PageHeader>

      {/* Search Input Bar matching Reference Image 11 */}
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search conversations by keywords..."
        className="max-w-md"
      />

      {/* Conversation List matching Reference Image 11 */}
      {filteredChats.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No conversations found"
          description={
            searchQuery
              ? `No chat matched "${searchQuery}".`
              : "Your chat history is currently empty. Ask your first civic question to get started!"
          }
          actionLabel="Start a Chat"
          onAction={() => navigate("/chat")}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5EAE8] divide-y divide-[#E5EAE8] shadow-xs overflow-hidden">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#F5F8F7] transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 truncate min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#15965B]/10 text-[#15965B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h4 className="text-xs sm:text-sm font-bold text-[#17212B] group-hover:text-[#15965B] transition-colors truncate">
                    {chat.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                    <span>{chat.date || "Recent"}</span>
                    {chat.time && (
                      <>
                        <span>•</span>
                        <span>{chat.time}</span>
                      </>
                    )}
                    <span>•</span>
                    <span className="hidden sm:inline bg-slate-100 text-slate-700 px-2 py-0.2 rounded">
                      {chat.category || "General"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side Chevron & Delete Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatToDelete(chat);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-80 group-hover:opacity-100"
                  title="Delete chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="p-1 text-slate-300 group-hover:text-[#15965B] transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Conversation"
        message={`Are you sure you want to delete "${chatToDelete?.title}"? This conversation history cannot be retrieved.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
