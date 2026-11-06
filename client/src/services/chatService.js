import apiClient, { simulateDelay } from "./api";

const CHATS_STORAGE_KEY = "civicsphere_recent_chats";
const CONVOS_STORAGE_KEY = "civicsphere_conversations";

export const chatService = {
  getRecentChats() {
    const stored = localStorage.getItem(CHATS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Strip out old dummy demo chats if present
        const cleaned = parsed.filter(
          (c) => !["chat-1", "chat-2", "chat-3", "chat-4"].includes(c.id)
        );
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  },

  getConversation(chatId) {
    if (!chatId || ["chat-1", "chat-2", "chat-3", "chat-4"].includes(chatId)) {
      return [];
    }
    const stored = localStorage.getItem(CONVOS_STORAGE_KEY);
    if (stored) {
      try {
        const convos = JSON.parse(stored);
        return convos[chatId] || [];
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  },

  async createNewChat(firstQuery = null) {
    await simulateDelay(200);
    const chats = this.getRecentChats();
    const newId = "chat-" + Date.now();
    const title = firstQuery ? (firstQuery.length > 40 ? firstQuery.substring(0, 37) + "..." : firstQuery) : "New Civic Query";
    
    const newChatObj = {
      id: newId,
      title: title,
      preview: firstQuery || "Ask any civic, legal, or government scheme question...",
      timestamp: "Just now",
      date: new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: "General Inquiry",
      messagesCount: 1,
    };

    const updatedChats = [newChatObj, ...chats];
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    return newChatObj;
  },

  async sendMessage(chatId, text, documentContext = "") {
    const stored = localStorage.getItem(CONVOS_STORAGE_KEY);
    let convos = stored ? JSON.parse(stored) : {};
    
    const messages = convos[chatId] ? [...convos[chatId]] : [];
    
    const userMsg = {
      id: "m-" + Date.now(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    let aiResponse;
    try {
      // Connect to Google Gemini via FastAPI Backend
      const response = await apiClient.post("/api/chat/message", {
        chatId,
        message: text,
        documentContext,
      });
      aiResponse = response.data.aiResponse;
    } catch (error) {
      const isKeyMissing = error.response?.data?.detail?.includes("GEMINI_API_KEY");
      const isTimeout = error.code === "ECONNABORTED" || error.message?.includes("timeout");
      
      let points;
      let intro = "⚠️ Civic Consultation Notice:";

      if (isKeyMissing) {
        intro = "⚠️ Gemini API Key Required:";
        points = [
          "To enable real-time Gemini AI guidance, add your GEMINI_API_KEY in server/.env.",
          "You can generate a free API key from Google AI Studio at: https://aistudio.google.com/."
        ];
      } else if (isTimeout) {
        intro = "⏱️ Response Delayed:";
        points = [
          "The legal analysis took longer than expected due to API load.",
          "Please click send again to retry your consultation."
        ];
      } else {
        points = [
          error.response?.data?.detail || error.message || "Failed to communicate with AI service.",
          "Please check your connection and retry in a moment."
        ];
      }
      
      aiResponse = {
        id: "m-" + (Date.now() + 1),
        sender: "ai",
        intro,
        points,
        legalSummary: "CivicSphere AI references official statutes from indiacode.nic.in and central ministry gazettes.",
        sources: [
          { title: "National Emergency Helpline (India)", link: "https://112.gov.in" },
          { title: "India Code - National Digital Repository of Laws", link: "https://www.indiacode.nic.in" }
        ],
        relatedQuestions: [
          "What emergency helplines exist in India?",
          "How to file a Zero FIR for immediate assistance?"
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    const updatedConvo = [...messages, userMsg, aiResponse];
    convos[chatId] = updatedConvo;
    localStorage.setItem(CONVOS_STORAGE_KEY, JSON.stringify(convos));

    // Update recent chat item preview and time
    const chats = this.getRecentChats();
    const chatIndex = chats.findIndex((c) => c.id === chatId);
    if (chatIndex >= 0) {
      chats[chatIndex].preview = text;
      chats[chatIndex].timestamp = "Just now";
      chats[chatIndex].messagesCount = updatedConvo.length;
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    }

    return { userMsg, aiResponse, conversation: updatedConvo };
  },

  deleteChat(chatId) {
    const chats = this.getRecentChats().filter(c => c.id !== chatId);
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));

    const stored = localStorage.getItem(CONVOS_STORAGE_KEY);
    if (stored) {
      const convos = JSON.parse(stored);
      delete convos[chatId];
      localStorage.setItem(CONVOS_STORAGE_KEY, JSON.stringify(convos));
    }
    return true;
  },

  clearAllChats() {
    localStorage.removeItem(CHATS_STORAGE_KEY);
    localStorage.removeItem(CONVOS_STORAGE_KEY);
  }
};

