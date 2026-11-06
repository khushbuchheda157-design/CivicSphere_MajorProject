import React from "react";

export default function Badge({
  children,
  variant = "emerald",
  size = "sm",
  className = "",
}) {
  const variantClasses = {
    emerald: "bg-[#15965B]/10 text-[#087443] border border-[#15965B]/20",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
    amber: "bg-amber-50 text-amber-800 border border-amber-200",
    rose: "bg-rose-50 text-rose-700 border border-rose-200",
    cyan: "bg-cyan-50 text-cyan-800 border border-cyan-200",
    gray: "bg-slate-100 text-slate-700 border border-slate-200",
  };

  const sizeClasses = {
    xs: "text-[10px] px-2 py-0.5 rounded-full font-medium",
    sm: "text-xs px-2.5 py-0.5 rounded-full font-medium",
    md: "text-sm px-3 py-1 rounded-md font-medium",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 ${
        variantClasses[variant] || variantClasses.emerald
      } ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {children}
    </span>
  );
}

