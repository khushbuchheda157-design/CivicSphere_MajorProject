import apiClient from "./api";

export const authService = {
  /**
   * Fetches the current user profile by verifying the HTTP-only cookie.
   * Called on initial page load / app refresh.
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get("/api/auth/me");
      return response.data.user;
    } catch {
      // If access token expired or temporarily missing, attempt seamless refresh
      try {
        const refreshRes = await apiClient.post("/api/auth/refresh");
        return refreshRes.data.user;
      } catch {
        return null;
      }
    }
  },

  /**
   * Logs in with email and password.
   * The backend sets the signed JWT in a secure HTTP-only cookie.
   */
  async login(email, password, rememberMe = true) {
    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
        rememberMe,
      });
      return response.data;
    } catch (error) {
      const detail =
        error.response?.data?.detail || "Invalid email or password. Please try again.";
      throw new Error(detail, { cause: error });
    }
  },

  /**
   * Registers a new user account.
   * Hashes the password with Argon2 on the backend and establishes an HTTP-only session.
   */
  async signup({ name, email, password, confirmPassword }) {
    try {
      const response = await apiClient.post("/api/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      const detail =
        error.response?.data?.detail || "Registration failed. Please check your details.";
      throw new Error(detail, { cause: error });
    }
  },

  /**
   * Logs out the user by instructing FastAPI to clear the HTTP-only cookie.
   */
  async logout() {
    try {
      await apiClient.post("/api/auth/logout");
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Google OAuth login handler establishing the same HTTP-only cookie session.
   */
  async googleAuth(googleData = {}) {
    try {
      const response = await apiClient.post("/api/auth/google", googleData);
      return response.data;
    } catch (error) {
      const detail =
        error.response?.data?.detail || "Google authentication failed.";
      throw new Error(detail, { cause: error });
    }
  },

  /**
   * Updates user profile (name, phone, avatar).
   */
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put("/api/auth/profile", profileData);
      return response.data.user;
    } catch (error) {
      const detail =
        error.response?.data?.detail || "Failed to update profile.";
      throw new Error(detail, { cause: error });
    }
  },

  /**
   * Updates password securely on backend with Argon2 verification.
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      const detail =
        error.response?.data?.detail || "Failed to change password.";
      throw new Error(detail, { cause: error });
    }
  },
};
