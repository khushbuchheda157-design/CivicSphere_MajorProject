import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
  size = "md",
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-[#64748B] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white border border-[#E5EAE8] rounded-xl pl-10 pr-9 text-sm text-[#17212B] placeholder-[#94A3B8] transition-colors focus:border-[#15965B] focus:ring-1 focus:ring-[#15965B] outline-none shadow-xs ${
          size === "sm" ? "py-1.5 text-xs" : size === "lg" ? "py-3 text-base" : "py-2.5"
        }`}
      />
      {value && (
        <button
          onClick={onClear || (() => onChange({ target: { value: "" } }))}
          className="absolute right-3 p-0.5 rounded-full text-[#94A3B8] hover:text-[#17212B] transition-colors"
          type="button"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

