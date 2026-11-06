import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Send,
  Paperclip,
  Sparkles,
  RotateCcw,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatMessage from "../components/chat/ChatMessage";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { chatService } from "../services/chatService";
import { useToast } from "../context/ToastContext";

// Helper outside component to avoid purity lint false positive
const createMessageId = () => "temp-" + Date.now().toString(36);

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [recentChats, setRecentChats] = useState(() => chatService.getRecentChats());
  const activeChatId = chatId || recentChats[0]?.id || "new";

  // Conversation messages state keyed by chatId
  const [messagesMap, setMessagesMap] = useState(() => {
    const initialConvo = chatService.getConversation(activeChatId);
    return { [activeChatId]: initialConvo };
  });

  const messages = messagesMap[activeChatId] ?? chatService.getConversation(activeChatId);

  const [input, setInput] = useState(() => location.state?.initialPrompt || "");
  const [isSending, setIsSending] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const appliedPromptRef = useRef(location.state?.initialPrompt);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Pre-fill input if navigated with a new initialPrompt
  useEffect(() => {
    const nextPrompt = location.state?.initialPrompt;
    if (nextPrompt && nextPrompt !== appliedPromptRef.current) {
      appliedPromptRef.current = nextPrompt;
      const timer = setTimeout(() => {
        setInput(nextPrompt);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [location.state?.initialPrompt]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isSending) return;

    setInput("");
    setIsSending(true);

    try {
      let targetId = activeChatId;
      if (!targetId || targetId === "new") {
        const newChat = await chatService.createNewChat(query);
        targetId = newChat.id;
        setRecentChats(chatService.getRecentChats());
        navigate(`/chat/${newChat.id}`, { replace: true });
      }

      // Add user message optimistically
      const timestampStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const tempUserMsg = {
        id: createMessageId(),
        sender: "user",
        text: query,
        timestamp: timestampStr,
      };

      setMessagesMap((prev) => ({
        ...prev,
        [targetId]: [...(prev[targetId] || messages), tempUserMsg],
      }));

      // Call simulated AI service
      const res = await chatService.sendMessage(targetId, query);
      setMessagesMap((prev) => ({
        ...prev,
        [targetId]: res.conversation,
      }));
      setRecentChats(chatService.getRecentChats());
    } catch (err) {
      showToast("Error processing query: " + err.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const newChat = await chatService.createNewChat();
      setRecentChats(chatService.getRecentChats());
      setMessagesMap((prev) => ({ ...prev, [newChat.id]: [] }));
      navigate(`/chat/${newChat.id}`);
      showToast("New conversation initiated", "info");
    } catch {
      showToast("Failed to create chat", "error");
    }
  };

  const handleDeleteChat = (id) => {
    setChatToDelete(id);
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      chatService.deleteChat(chatToDelete);
      const remaining = chatService.getRecentChats();
      setRecentChats(remaining);
      if (activeChatId === chatToDelete) {
        if (remaining.length > 0) {
          navigate(`/chat/${remaining[0].id}`);
        } else {
          handleNewChat();
        }
      }
      setChatToDelete(null);
      showToast("Conversation deleted", "info");
    }
  };

  const handleClearCurrent = () => {
    setShowClearConfirm(false);
    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [],
    }));
    showToast("Chat conversation cleared", "info");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast(`Attached "${file.name}" for contextual legal analysis`, "success");
      setInput((prev) => `[Referenced Document: ${file.name}] ` + prev);
    }
  };

  const activeChatObj = recentChats.find((c) => c.id === activeChatId);

  return (
    <div className="h-[calc(100vh-125px)] flex gap-4 relative">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.docx,.txt"
      />

      {/* Chat Sidebar Sub-panel matching Reference Image 5 */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "hidden"
        } shrink-0 hidden lg:flex flex-col h-full`}
      >
        <ChatSidebar
          recentChats={recentChats}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          activeChatId={activeChatId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-2xl border border-[#E5EAE8] shadow-xs overflow-hidden">
        
        {/* Chat Toolbar Header */}
        <div className="px-5 py-3 border-b border-[#E5EAE8] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-lg text-[#64748B] hover:text-[#17212B] hover:bg-[#F5F8F7] transition"
              title={sidebarOpen ? "Hide chat list" : "Show chat list"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
            </button>

            <div>
              <h2 className="text-sm font-bold text-[#17212B] truncate max-w-md">
                {activeChatObj ? activeChatObj.title : "Civic & Legal Consultation"}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                <span className="inline-flex items-center gap-1 text-[#15965B] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15965B]" />
                  Active Session
                </span>
                <span>•</span>
                <span>{activeChatObj?.category || "Evidence Grounded"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={handleNewChat}
              className="lg:hidden"
            >
              New
            </Button>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-2 text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Clear conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#F5F8F7]/40">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#15965B]/10 text-[#15965B] flex items-center justify-center mb-3 shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#17212B]">
                How can I assist your civic inquiry?
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Ask about Indian laws, tenancy rights, scheme eligibility, or court procedures.
              </p>

              <div className="grid grid-cols-1 gap-2 mt-6 w-full text-left">
                {[
                  "What are my rights as a tenant in India?",
                  "How to apply for PM Kisan Samman Nidhi?",
                  "Information about RTI Act 2005 filing steps",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="p-3 text-xs text-[#17212B] bg-white rounded-xl border border-[#E5EAE8] hover:border-[#15965B]/40 hover:bg-[#F5F8F7] transition shadow-xs"
                  >
                    "{prompt}" →
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <ChatMessage
                key={m.id}
                message={m}
                onSelectPrompt={(text) => handleSend(text)}
              />
            ))
          )}

          {/* Typing Indicator */}
          {isSending && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#E5EAE8] max-w-xs shadow-xs text-xs text-[#64748B]">
              <span className="w-2 h-2 rounded-full bg-[#15965B] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#15965B] animate-bounce delay-100" />
              <span className="w-2 h-2 rounded-full bg-[#15965B] animate-bounce delay-200" />
              <span className="font-medium text-[#17212B] ml-1">
                Searching statutory evidence...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar at bottom matching Reference Image 5 */}
        <div className="p-3.5 border-t border-[#E5EAE8] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-[#F5F8F7] rounded-xl border border-[#E5EAE8] px-3 py-1.5 focus-within:border-[#15965B] focus-within:bg-white transition"
          >
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-[#64748B] hover:text-[#17212B] rounded-lg transition"
              title="Attach document for analysis"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Input field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isSending}
              className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-[#17212B] placeholder-[#94A3B8] outline-none py-2"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="w-9 h-9 rounded-lg bg-[#15965B] hover:bg-[#087443] disabled:opacity-40 disabled:hover:bg-[#15965B] text-white flex items-center justify-center transition shadow-xs shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-400 mt-2">
            CivicSphere AI references official gazettes and statutes. Always cross-verify critical matters with legal counsel.
          </p>
        </div>
      </div>

      {/* Confirm Clear Modal */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearCurrent}
        title="Clear Conversation"
        message="Are you sure you want to clear the messages in this session? This action cannot be undone."
        confirmLabel="Clear"
      />

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Conversation"
        message="Are you sure you want to permanently delete this chat from your history?"
        confirmLabel="Delete"
      />
    </div>
  );
}
