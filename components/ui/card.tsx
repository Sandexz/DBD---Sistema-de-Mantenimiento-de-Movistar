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
    default: "bg-white border border-slate-200 rounded-xl shadow-card-clean",
    bordered: "bg-white border-2 border-slate-200 rounded-xl shadow-sm",
    interactive:
      "bg-white border border-slate-200 hover:border-[#5BC500] hover:shadow-card-hover transition-all duration-200 rounded-xl cursor-pointer",
  };

  return (
    <div
      className={`${variantStyles[variant]} p-5 ${className}`}
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
    <div className="flex items-start justify-between gap-4 pb-3.5 border-b border-slate-150 mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="text-[#019DF4] p-2 bg-[#E5F4FD] rounded-lg border border-[#B8E2FB] shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight font-grotesk">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 font-sans mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
