import { initialSchemes } from "../data/mockData";
import { simulateDelay } from "./api";

const SCHEMES_STORAGE_KEY = "civicsphere_schemes";
const FEEDBACK_STORAGE_KEY = "civicsphere_feedback";

export const schemeService = {
  getSchemes() {
    const stored = localStorage.getItem(SCHEMES_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(SCHEMES_STORAGE_KEY, JSON.stringify(initialSchemes));
    return initialSchemes;
  },

  async toggleSaveScheme(schemeId) {
    await simulateDelay(200);
    const schemes = this.getSchemes().map(s => {
      if (s.id === schemeId) {
        return { ...s, isSaved: !s.isSaved };
      }
      return s;
    });
    localStorage.setItem(SCHEMES_STORAGE_KEY, JSON.stringify(schemes));
    return schemes.find(s => s.id === schemeId);
  }
};

export const feedbackService = {
  getFeedbacks() {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const cleaned = parsed.filter((f) => !["fb-1", "fb-2"].includes(f.id));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  },

  async submitFeedback({ rating, category, comment, user }) {
    await simulateDelay(500);
    if (!rating) {
      throw new Error("Please select a star rating.");
    }
    const current = this.getFeedbacks();
    const newFeedback = {
      id: "fb-" + Date.now(),
      rating,
      category: category || "General",
      comment: comment || "",
      author: user?.name || "Anonymous Citizen",
      date: new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    const updated = [newFeedback, ...current];
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    return newFeedback;
  }
};

