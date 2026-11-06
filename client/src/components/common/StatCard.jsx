import React from "react";
import { MessageSquare, FileText, Landmark, Scale } from "lucide-react";

const icons = {
  MessageSquare,
  FileText,
  Landmark,
  Scale,
};

export default function StatCard({ label, value, change, accent = "emerald", icon }) {
  const IconComponent = typeof icon === "string" ? icons[icon] || MessageSquare : icon;

  const accentStyles = {
    emerald: {
      bg: "bg-[#15965B]/10",
      text: "text-[#15965B]",
      border: "hover:border-[#15965B]/40",
      num: "text-[#15965B]",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "hover:border-blue-300",
      num: "text-blue-600",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "hover:border-purple-300",
      num: "text-purple-600",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "hover:border-amber-300",
      num: "text-amber-600",
    },
  };

  const style = accentStyles[accent] || accentStyles.emerald;

  return (
    <div
      className={`bg-white rounded-xl border border-[#E5EAE8] p-4.5 shadow-xs transition-all duration-200 ${style.border} flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl font-extrabold tracking-tight text-[#17212B]">
          {value}
        </span>
        <div className={`p-2 rounded-lg ${style.bg} ${style.text}`}>
          <IconComponent className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-2.5">
        <p className="text-xs font-medium text-[#64748B]">{label}</p>
        {change && (
          <p className="text-[11px] font-semibold text-[#15965B] mt-0.5 flex items-center gap-0.5">
            {change}
          </p>
        )}
      </div>
    </div>
  );
}
