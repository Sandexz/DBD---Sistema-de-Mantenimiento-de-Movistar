import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "movistar" | "blue" | "outline" | "ghost" | "danger" | "orange";
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
    "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5BC500] disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-xs sm:text-sm px-4 py-2 gap-2",
    lg: "text-sm sm:text-base px-5 py-2.5 gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-[#5BC500] hover:bg-[#489E00] text-white shadow-sm font-semibold active:scale-[0.99]",
    movistar:
      "bg-[#5BC500] hover:bg-[#489E00] text-white shadow-sm font-semibold active:scale-[0.99]",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm",
    blue:
      "bg-[#019DF4] hover:bg-[#0082CC] text-white shadow-sm font-semibold active:scale-[0.99]",
    orange:
      "bg-[#FF6A13] hover:bg-[#E5590B] text-white shadow-sm font-semibold",
    outline:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    ghost:
      "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 shadow-sm font-semibold",
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
