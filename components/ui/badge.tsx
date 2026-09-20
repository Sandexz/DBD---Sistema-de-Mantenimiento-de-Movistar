import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "cyan" | "orange" | "blue" | "dark" | "gray" | "green";
  size?: "sm" | "md";
  className?: string;
  pulse?: boolean;
}

export function Badge({
  children,
  variant = "cyan",
  size = "md",
  className = "",
  pulse = false,
}: BadgeProps) {
  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 font-mono",
    md: "text-xs px-2.5 py-1 font-mono",
  };

  const variantStyles = {
    cyan: "bg-[#00AEEF]/15 text-[#00AEEF] border border-[#00AEEF]/40",
    orange: "bg-[#FF6A13]/15 text-[#FF6A13] border border-[#FF6A13]/40",
    blue: "bg-[#0A2E5C] text-slate-200 border border-[#144585]",
    dark: "bg-[#0B0C0E] text-slate-300 border border-[#1E232B]",
    gray: "bg-[#1E232B] text-slate-400 border border-[#2A313C]",
    green: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-medium tracking-wide uppercase ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              variant === "orange" ? "bg-[#FF6A13]" : "bg-[#00AEEF]"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              variant === "orange" ? "bg-[#FF6A13]" : "bg-[#00AEEF]"
            }`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
