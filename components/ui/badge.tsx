import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "cyan" | "orange" | "blue" | "dark" | "gray" | "green" | "movistar" | "red" | "yellow";
  size?: "sm" | "md";
  className?: string;
  pulse?: boolean;
}

export function Badge({
  children,
  variant = "movistar",
  size = "md",
  className = "",
  pulse = false,
}: BadgeProps) {
  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 font-mono",
    md: "text-xs px-2.5 py-1 font-mono",
  };

  const variantStyles = {
    movistar: "bg-[#F0F9E8] text-[#3F8500] border border-[#C6EE94] font-semibold",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold",
    cyan: "bg-sky-50 text-sky-700 border border-sky-200 font-semibold",
    blue: "bg-[#E5F4FD] text-[#0070B8] border border-[#B8E2FB] font-semibold",
    yellow: "bg-amber-50 text-amber-800 border border-amber-200 font-semibold",
    orange: "bg-orange-50 text-orange-700 border border-orange-200 font-semibold",
    red: "bg-rose-50 text-rose-700 border border-rose-200 font-semibold",
    dark: "bg-slate-800 text-white border border-slate-700 font-semibold",
    gray: "bg-slate-100 text-slate-700 border border-slate-200 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium tracking-wide uppercase ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              variant === "red" || variant === "orange"
                ? "bg-rose-500"
                : variant === "yellow"
                ? "bg-amber-500"
                : "bg-[#5BC500]"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              variant === "red" || variant === "orange"
                ? "bg-rose-600"
                : variant === "yellow"
                ? "bg-amber-600"
                : "bg-[#5BC500]"
            }`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
