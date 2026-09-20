import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "orange" | "cyan" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0C0E] disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-[#0A2E5C] text-white hover:bg-[#144585] focus:ring-[#00AEEF] border border-[#1E232B] shadow-sm",
    secondary:
      "bg-[#121418] text-slate-200 hover:bg-[#181B21] hover:text-white border border-[#1E232B] focus:ring-slate-400",
    orange:
      "bg-[#FF6A13] text-white hover:bg-[#E5590B] focus:ring-[#FF6A13] shadow-md shadow-[#FF6A13]/20 font-semibold",
    cyan:
      "bg-[#00AEEF] text-[#061D3A] hover:bg-[#0098D1] focus:ring-[#00AEEF] shadow-md shadow-[#00AEEF]/20 font-semibold",
    outline:
      "bg-transparent text-slate-300 border border-[#2A313C] hover:bg-[#121418] hover:text-white focus:ring-[#00AEEF]",
    ghost:
      "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-[#121418] focus:ring-slate-500",
    danger:
      "bg-[#FF6A13] text-white hover:bg-[#E5590B] focus:ring-[#FF6A13]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Cargando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
