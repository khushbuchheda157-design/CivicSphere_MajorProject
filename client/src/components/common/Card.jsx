import React from "react";

export default function Card({
  children,
  className = "",
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#E5EAE8] p-5 shadow-xs transition-all ${
        hoverable ? "hover:border-[#CBD5E1] hover:shadow-md cursor-pointer transition-all duration-200" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

