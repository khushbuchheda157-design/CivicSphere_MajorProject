import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Asynchronous session verification on page mount / refresh
  // The browser automatically attaches HTTP-only cookies via withCredentials
  useEffect(() => {
    let isSubscribed = true;

    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (isSubscribed) {
          setUser(currentUser);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isSubscribed) {
          setUser(null);
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const login = async (email, password, rememberMe = true) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password, rememberMe);
      // Backend sets HTTP-only cookie; UI only receives sanitized user profile
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const res = await authService.signup(formData);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleData = {}) => {
    setLoading(true);
    try {
      const res = await authService.googleAuth(googleData);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    const updatedUser = await authService.updateProfile(data);
    setUser(updatedUser);
    return updatedUser;
  };

  const changePassword = async (curr, next) => {
    return await authService.changePassword(curr, next);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        googleLogin,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
