import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  UploadCloud,
  FolderClosed,
  Landmark,
  Scale,
  Share2,
  Clock,
  Star,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Chat Assistant", path: "/chat", icon: MessageSquare },
  { name: "Upload Documents", path: "/documents/upload", icon: UploadCloud },
  { name: "My Documents", path: "/documents", icon: FolderClosed },
  { name: "Government Schemes", path: "/schemes", icon: Landmark },
  { name: "Legal Guidance", path: "/legal-guidance", icon: Scale },
  { name: "Civic Knowledge", path: "/civic-knowledge", icon: Share2 },
  { name: "Chat History", path: "/history", icon: Clock },
  { name: "Feedback", path: "/feedback", icon: Star },
  { name: "Profile Settings", path: "/profile", icon: User },
];

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showToast("You have been signed out successfully.", "info");
      navigate("/");
    } catch (err) {
      showToast("Logout failed: " + err.message, "error");
    }
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between bg-[#080D18] text-white">
      {/* Top Header / Branding */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#087443] to-[#15965B] flex items-center justify-center shrink-0 shadow-md shadow-[#15965B]/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  CivicSphere <span className="text-[#15965B] text-xs font-semibold px-1.5 py-0.2 bg-[#15965B]/20 rounded">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate">
                  Civic & Legal Intelligence
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? "bg-[#15965B] text-white shadow-sm shadow-[#15965B]/30 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  } ${isCollapsed && !mobileOpen ? "justify-center px-2" : ""}`
                }
                title={isCollapsed && !mobileOpen ? item.name : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                {(!isCollapsed || mobileOpen) && (
                  <span className="truncate">{item.name}</span>
                )}
                {isCollapsed && !mobileOpen && (
                  <span className="sr-only">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User info & Logout */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {(!isCollapsed || mobileOpen) && user && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 border border-white/5">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-[#15965B]/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#15965B] text-white font-bold flex items-center justify-center text-xs shrink-0 border border-[#15965B]/40">
                {(user.name || "C")[0].toUpperCase()}
              </div>
            )}
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors group ${
            isCollapsed && !mobileOpen ? "justify-center px-2" : ""
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          {(!isCollapsed || mobileOpen) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#080D18] transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out bg-[#080D18] border-r border-white/5 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
