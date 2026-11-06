import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Route Guards
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";

// Protected Dashboard Pages
import Dashboard from "../pages/Dashboard";
import Chat from "../pages/Chat";
import UploadDocuments from "../pages/UploadDocuments";
import MyDocuments from "../pages/MyDocuments";
import GovernmentSchemes from "../pages/GovernmentSchemes";
import LegalGuidance from "../pages/LegalGuidance";
import CivicKnowledge from "../pages/CivicKnowledge";
import ChatHistory from "../pages/ChatHistory";
import Feedback from "../pages/Feedback";
import ProfileSettings from "../pages/ProfileSettings";

// 404 Page
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public root layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />

          {/* Guest only routes: redirect to /dashboard if logged in */}
          <Route element={<GuestRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
        </Route>

        {/* Protected routes: redirect to /login if not authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:chatId" element={<Chat />} />
            <Route path="documents/upload" element={<UploadDocuments />} />
            <Route path="documents" element={<MyDocuments />} />
            <Route path="schemes" element={<GovernmentSchemes />} />
            <Route path="legal-guidance" element={<LegalGuidance />} />
            <Route path="civic-knowledge" element={<CivicKnowledge />} />
            <Route path="history" element={<ChatHistory />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>
        </Route>

        {/* 404 Custom Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
