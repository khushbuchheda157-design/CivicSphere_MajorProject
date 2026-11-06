import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function DashboardHeader({
  onToggleSidebar,
  onToggleMobile,
  _isCollapsed,
}) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    showToast("Signed out successfully", "info");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E5EAE8] px-4 md:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & branding */}
      <div className="flex items-center gap-3">
        {/* Mobile toggle */}
        <button
          onClick={onToggleMobile}
          className="md:hidden p-2 rounded-lg text-[#17212B] hover:bg-slate-100 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop sidebar toggle button */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex p-2 rounded-lg text-[#64748B] hover:text-[#17212B] hover:bg-[#F5F8F7] transition-colors"
          aria-label="Toggle sidebar width"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Evidence verification pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#15965B]/10 rounded-full text-xs font-semibold text-[#087443] border border-[#15965B]/20">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15965B]" />
          <span>Evidence Grounded Civic AI</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3" ref={dropdownRef}>
        {/* Quick New Chat Button */}
        <Link
          to="/chat"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#15965B] hover:bg-[#087443] rounded-lg shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#17212B] hover:bg-[#F5F8F7] transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#15965B] ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-[#E5EAE8] shadow-xl py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-[#E5EAE8] flex items-center justify-between">
                <span className="text-xs font-bold text-[#17212B]">
                  Civic Notifications
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    className="text-[10px] text-[#15965B] font-semibold cursor-pointer hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="divide-y divide-[#E5EAE8] max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#64748B]">
                    No new civic notifications
                  </div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={idx} className="p-3 hover:bg-[#F5F8F7] transition text-xs">
                      <p className="font-semibold text-[#17212B]">{notif.title}</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">{notif.desc}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-[#F5F8F7] transition"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "User"}
                className="w-8 h-8 rounded-full object-cover border border-[#E5EAE8]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#15965B] text-white font-bold flex items-center justify-center text-xs border border-[#15965B]/30 shadow-xs">
                {(user?.name || "C")[0].toUpperCase()}
              </div>
            )}
            <span className="hidden md:block text-xs font-semibold text-[#17212B]">
              {user?.name?.split(" ")[0] || "Citizen"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-[#E5EAE8] shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-[#E5EAE8]">
                <p className="text-xs font-bold text-[#17212B] truncate">
                  {user?.name || "Citizen"}
                </p>
                <p className="text-[11px] text-[#64748B] truncate">
                  {user?.email || ""}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#17212B] hover:bg-[#F5F8F7] transition"
                >
                  <User className="w-4 h-4 text-[#64748B]" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  to="/history"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#17212B] hover:bg-[#F5F8F7] transition"
                >
                  <Sparkles className="w-4 h-4 text-[#64748B]" />
                  <span>My Queries & History</span>
                </Link>
              </div>

              <div className="border-t border-[#E5EAE8] pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
