import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  size = "md",
  message = "Loading...",
  fullScreen = false,
}) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2
        className={`${sizeMap[size] || sizeMap.md} animate-spin text-[#15965B]`}
      />
      {message && (
        <p className="text-xs font-medium text-[#64748B] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return <div className="p-6 flex items-center justify-center">{content}</div>;
}

