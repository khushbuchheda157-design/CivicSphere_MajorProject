import React from "react";
import { Link } from "react-router-dom";
import { MessageSquarePlus, UploadCloud, Landmark, Scale } from "lucide-react";

export default function QuickActionGrid() {
  const actions = [
    {
      title: "New Chat",
      desc: "Ask any civic or legal query",
      path: "/chat",
      icon: MessageSquarePlus,
      color: "text-[#15965B]",
      bg: "bg-[#15965B]/10",
      borderColor: "hover:border-[#15965B]/50",
    },
    {
      title: "Upload Document",
      desc: "Analyze laws, notices & acts",
      path: "/documents/upload",
      icon: UploadCloud,
      color: "text-blue-600",
      bg: "bg-blue-50",
      borderColor: "hover:border-blue-300",
    },
    {
      title: "Explore Schemes",
      desc: "Filter & test your eligibility",
      path: "/schemes",
      icon: Landmark,
      color: "text-purple-600",
      bg: "bg-purple-50",
      borderColor: "hover:border-purple-300",
    },
    {
      title: "Legal Guidance",
      desc: "Browse Indian statutory topics",
      path: "/legal-guidance",
      icon: Scale,
      color: "text-amber-600",
      bg: "bg-amber-50",
      borderColor: "hover:border-amber-300",
    },
  ];

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              to={act.path}
              className={`bg-white rounded-xl border border-[#E5EAE8] p-4 shadow-xs transition-all duration-200 ${act.borderColor} hover:shadow-md flex items-center gap-3.5 group`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${act.bg} ${act.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="truncate">
                <h4 className="text-sm font-bold text-[#17212B] group-hover:text-[#15965B] transition-colors">
                  {act.title}
                </h4>
                <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                  {act.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

