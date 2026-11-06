import axios from "axios";

// Base API instance configured for FastAPI with HTTP-Only Cookies
// Defaults to relative URL ("") so requests flow through Vite proxy on the same origin,
// ensuring the browser treats cookies as first-party and automatically preserves session across refreshes.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: ensures HTTP-only cookies are automatically sent & received
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // 120 seconds: allows Gemini LLM enough time for deep civic reasoning & citations
});

// Note: No tokens are read from or stored in localStorage or JavaScript memory!
// The browser manages the HTTP-only cookie automatically.

// Response interceptor: handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Helper for other mock services
export const simulateDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default apiClient;
