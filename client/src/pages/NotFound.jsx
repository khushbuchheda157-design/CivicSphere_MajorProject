import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home, LayoutDashboard, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#F5F8F7] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5EAE8] p-8 sm:p-10 shadow-lg flex flex-col items-center">
        {/* Visual Shield */}
        <div className="w-20 h-20 rounded-2xl bg-[#15965B]/10 flex items-center justify-center text-[#15965B] mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>

        {/* 404 Heading */}
        <span className="text-6xl font-black text-[#080D18] tracking-tight mb-2">
          404
        </span>

        <h1 className="text-xl font-bold text-[#17212B] mb-2">
          Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
          The civic information you're looking for seems to have taken a different route.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Button
            variant="outline"
            size="md"
            className="w-full"
            leftIcon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>

          {isAuthenticated ? (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              leftIcon={LayoutDashboard}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              leftIcon={Home}
              onClick={() => navigate("/")}
            >
              Homepage
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

