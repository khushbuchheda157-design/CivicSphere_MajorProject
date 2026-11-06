import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
    icon: "p-2",
  };

  const variantClasses = {
    primary:
      "bg-[#15965B] hover:bg-[#087443] text-white shadow-sm focus:ring-[#15965B]/40 active:scale-[0.99]",
    secondary:
      "bg-[#F5F8F7] hover:bg-[#E5EAE8] text-[#17212B] border border-[#E5EAE8] focus:ring-[#64748B]/30",
    outline:
      "bg-white hover:bg-[#F5F8F7] text-[#17212B] border border-[#E5EAE8] hover:border-[#CBD5E1] shadow-xs focus:ring-[#15965B]/30",
    ghost:
      "bg-transparent hover:bg-slate-100 text-[#64748B] hover:text-[#17212B] focus:ring-slate-300",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500/40",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" />
      )}
      {children}
      {!isLoading && RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
    </button>
  );
}

