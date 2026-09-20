import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "interactive";
}

export function Card({
  children,
  className = "",
  variant = "default",
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-[#121418] border border-[#1E232B] rounded-lg",
    bordered: "bg-[#0B0C0E] border border-[#2A313C] rounded-lg",
    interactive:
      "bg-[#121418] border border-[#1E232B] hover:border-[#00AEEF]/50 transition-colors duration-200 rounded-lg",
  };

  return (
    <div
      className={`${variantStyles[variant]} p-5 shadow-card-dark ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1E232B] mb-4">
      <div className="flex items-center gap-3">
        {icon && <div className="text-[#00AEEF] p-2 bg-[#0A2E5C]/30 rounded-md border border-[#0A2E5C]">{icon}</div>}
        <div>
          <h3 className="text-base font-semibold text-white tracking-wide font-grotesk">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 font-sans mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
