"use client";

// Kit de interfaz del SGMR (tema claro corporativo). Se mantiene separado de
// components/ui/* porque el módulo Batch depende de las variantes oscuras originales.
import React, { useEffect } from "react";
import { X, Search, CheckCircle2, XCircle, AlertTriangle, Info, CalendarCheck, Wrench } from "lucide-react";
import type { Chequeo } from "@/lib/validaciones";
import type { Criticidad, EstadoOt, EstadoPlan, EstadoTicket, EstadoTracking, TipoMantenimiento } from "@/lib/types";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// ───────────────────────── Tonos semánticos
export type ToneName = "ok" | "warn" | "crit" | "info" | "neutral" | "brand" | "teal";

const TONE: Record<ToneName, string> = {
  ok: "bg-st-ok-bg text-st-ok-fg border-st-ok/30",
  warn: "bg-st-warn-bg text-st-warn-fg border-st-warn/40",
  crit: "bg-st-crit-bg text-st-crit-fg border-st-crit/30",
  info: "bg-st-info-bg text-st-info-fg border-st-info/30",
  neutral: "bg-mv-surface text-mv-ink-2 border-mv-line",
  brand: "bg-mv-green-50 text-mv-green-800 border-mv-green/40",
  teal: "bg-mv-teal-50 text-mv-teal-700 border-mv-teal/30",
};

const DOT: Record<ToneName, string> = {
  ok: "bg-st-ok",
  warn: "bg-st-warn",
  crit: "bg-st-crit",
  info: "bg-st-info",
  neutral: "bg-mv-muted",
  brand: "bg-mv-green",
  teal: "bg-mv-teal",
};

export function toneCriticidad(c: Criticidad): ToneName {
  return c === "CRÍTICA" ? "crit" : c === "ALTA" ? "warn" : c === "MEDIA" ? "info" : "neutral";
}
export function toneOt(s: EstadoOt | string): ToneName {
  switch (s) {
    case "CERRADA":
      return "ok";
    case "PENDIENTE":
    case "PENDIENTE DE CIERRE":
      return "warn";
    case "EN EJECUCIÓN":
      return "teal";
    default:
      return "info";
  }
}
export function toneTicket(s: EstadoTicket): ToneName {
  if (s === "Cerrado" || s === "Solucionado") return "ok";
  if (s === "Detectado" || s === "Registrado") return "warn";
  if (s === "En atención") return "teal";
  return "info";
}
export function tonePlan(s: EstadoPlan | string): ToneName {
  switch (s) {
    case "Ejecutado":
      return "ok";
    case "Próximo":
      return "info";
    case "Pendiente":
      return "warn";
    case "Incumplido":
      return "crit";
    default:
      return "neutral";
  }
}
export function toneActivo(s: string): ToneName {
  if (s === "Operativo") return "ok";
  if (s === "En alerta") return "warn";
  if (s === "Fuera de servicio") return "crit";
  return "info";
}
export function toneTracking(s: EstadoTracking): ToneName {
  switch (s) {
    case "Disponible":
      return "ok";
    case "En ruta":
      return "info";
    case "En sitio":
      return "warn";
    case "En ejecución":
      return "teal";
    default:
      return "neutral";
  }
}

export function Pill({
  tone = "neutral",
  children,
  dot,
  className,
  title,
}: {
  tone?: ToneName;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-4",
        TONE[tone],
        className
      )}
    >
      {dot && <span className={cx("h-1.5 w-1.5 rounded-full", DOT[tone])} />}
      {children}
    </span>
  );
}

export function Dot({ tone }: { tone: ToneName }) {
  return <span className={cx("inline-block h-2 w-2 rounded-full", DOT[tone])} />;
}

export function CriticidadBadge({ c }: { c: Criticidad }) {
  return (
    <Pill tone={toneCriticidad(c)} dot>
      {c}
    </Pill>
  );
}

/** Etiqueta obligatoria para distinguir el tipo de orden. */
export function TipoOtTag({ tipo, short }: { tipo: TipoMantenimiento; short?: boolean }) {
  const prev = tipo === "PREVENTIVO";
  const Icon = prev ? CalendarCheck : Wrench;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        prev ? "bg-mv-teal-50 text-mv-teal-700 ring-1 ring-inset ring-mv-teal/30" : "bg-mv-ink text-white"
      )}
    >
      <Icon className="h-3 w-3" />
      {short ? (prev ? "Preventiva" : "Correctiva") : prev ? "OT PREVENTIVA" : "OT CORRECTIVA"}
    </span>
  );
}

export function TipoMantTag({ tipo }: { tipo: TipoMantenimiento }) {
  const prev = tipo === "PREVENTIVO";
  return (
    <span
      className={cx(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        prev ? "bg-mv-teal-50 text-mv-teal-700" : "bg-mv-surface text-mv-ink ring-1 ring-inset ring-mv-line-2"
      )}
    >
      {tipo}
    </span>
  );
}

// ───────────────────────── Botones
type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "teal" | "subtle";

export function Btn({
  variant = "secondary",
  size = "md",
  icon,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}) {
  const v: Record<BtnVariant, string> = {
    primary: "bg-mv-green-700 text-white hover:bg-mv-green-800 border border-mv-green-700 shadow-sm",
    secondary: "bg-white text-mv-ink border border-mv-line-2 hover:bg-mv-surface",
    ghost: "bg-transparent text-mv-ink-2 border border-transparent hover:bg-mv-surface hover:text-mv-ink",
    danger: "bg-st-crit text-white border border-st-crit hover:bg-st-crit-fg",
    teal: "bg-mv-teal-700 text-white border border-mv-teal-700 hover:bg-[#006570]",
    subtle: "bg-mv-green-50 text-mv-green-800 border border-mv-green/30 hover:bg-mv-green-100",
  };
  const s = {
    sm: "h-8 px-2.5 text-xs gap-1.5",
    md: "h-9 px-3.5 text-[13px] gap-2",
    lg: "h-11 px-5 text-sm gap-2",
  }[size];
  return (
    <button
      className={cx(
        "inline-flex select-none items-center justify-center whitespace-nowrap rounded-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45",
        v[variant],
        s,
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

// ───────────────────────── Contenedores
export function Panel({
  title,
  subtitle,
  icon,
  actions,
  children,
  className,
  bodyClassName,
  noPad,
  id,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPad?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={cx("rounded-lg border border-mv-line bg-white", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-mv-line px-4 py-3">
          <div className="flex min-w-0 items-start gap-2.5">
            {icon && <span className="mt-0.5 text-mv-green-700">{icon}</span>}
            <div className="min-w-0">
              {title && <h2 className="text-sm font-semibold text-mv-ink">{title}</h2>}
              {subtitle && <p className="mt-0.5 text-xs text-mv-ink-2">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cx(noPad ? "" : "p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone,
  icon,
  onClick,
  active,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: ToneName;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  const color =
    tone === "ok"
      ? "text-st-ok-fg"
      : tone === "warn"
      ? "text-st-warn-fg"
      : tone === "crit"
      ? "text-st-crit-fg"
      : tone === "info"
      ? "text-st-info-fg"
      : tone === "teal"
      ? "text-mv-teal-700"
      : tone === "brand"
      ? "text-mv-green-700"
      : "text-mv-ink";
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cx(
        "flex flex-col gap-1 rounded-lg border bg-white p-3.5 text-left",
        active ? "border-mv-green-700 ring-1 ring-mv-green-700" : "border-mv-line",
        onClick && "transition-colors hover:border-mv-line-2 hover:bg-mv-surface-2"
      )}
    >
      <span className="flex items-center justify-between gap-2 text-xs font-medium text-mv-ink-2">
        {label}
        {icon && <span className="text-mv-muted">{icon}</span>}
      </span>
      <span className={cx("num text-2xl font-bold tracking-tight", color)}>{value}</span>
      {hint && <span className="text-[11px] text-mv-muted">{hint}</span>}
    </Comp>
  );
}

export function Callout({
  tone = "info",
  title,
  children,
  className,
  icon,
}: {
  tone?: "ok" | "warn" | "crit" | "info" | "neutral";
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  const Ico = tone === "ok" ? CheckCircle2 : tone === "crit" ? XCircle : tone === "warn" ? AlertTriangle : Info;
  return (
    <div className={cx("flex gap-2.5 rounded-lg border px-3.5 py-3 text-[13px]", TONE[tone], className)}>
      <span className="mt-0.5 shrink-0">{icon ?? <Ico className="h-4 w-4" />}</span>
      <div className="min-w-0 space-y-0.5">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="leading-relaxed [&_a]:font-semibold [&_a]:underline">{children}</div>}
      </div>
    </div>
  );
}

export function Progress({ value, tone = "brand", className }: { value: number; tone?: ToneName; className?: string }) {
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-mv-surface", className)}>
      <div
        className={cx("h-full rounded-full transition-all", DOT[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function EmptyState({ title, children, icon }: { title: string; children?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      {icon && <span className="text-mv-muted">{icon}</span>}
      <p className="text-sm font-semibold text-mv-ink">{title}</p>
      {children && <div className="max-w-sm text-xs text-mv-ink-2">{children}</div>}
    </div>
  );
}

export function KV({ k, v, mono }: { k: string; v: React.ReactNode; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium text-mv-muted">{k}</dt>
      <dd className={cx("mt-0.5 break-words text-[13px] text-mv-ink", mono && "font-mono text-xs")}>{v}</dd>
    </div>
  );
}

// ───────────────────────── Formularios
export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
  htmlFor,
}: {
  label: string;
  hint?: React.ReactNode;
  error?: string | null;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <div className={cx("space-y-1", className)}>
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-mv-ink">
        {label}
        {required && <span className="ml-0.5 text-st-crit">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] font-medium text-st-crit-fg">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-mv-muted">{hint}</p>
      ) : null}
    </div>
  );
}

const CONTROL =
  "rounded-md border border-mv-line-2 bg-white px-3 text-[13px] text-mv-ink placeholder:text-mv-muted focus:border-mv-green-700 focus:outline-none focus:ring-2 focus:ring-mv-green/25 disabled:bg-mv-surface disabled:text-mv-muted";

/** Ancho completo por defecto, salvo que la clase indique otro ancho (w-auto, w-40…). */
function ancho(className?: string) {
  return /(^|\s)w-/.test(className ?? "") ? "" : "w-full";
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...p }, ref) {
    return <input ref={ref} className={cx(CONTROL, ancho(className), "h-9", className)} {...p} />;
  }
);

export function Select({ className, children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(CONTROL, ancho(className), "h-9 cursor-pointer pr-8", className)} {...p}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(CONTROL, "w-full min-h-[76px] py-2", className)} {...p} />;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cx("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mv-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cx(CONTROL, "h-9 w-full pl-8 pr-8")}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-mv-muted hover:text-mv-ink"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { value: T; label: React.ReactNode; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg bg-mv-surface p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cx(
            "inline-flex items-center gap-1.5 rounded-md font-semibold transition-colors",
            size === "sm" ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
            value === o.value ? "bg-white text-mv-ink shadow-sm ring-1 ring-mv-line" : "text-mv-ink-2 hover:text-mv-ink"
          )}
        >
          {o.label}
          {o.count !== undefined && (
            <span
              className={cx(
                "num rounded px-1 text-[10px]",
                value === o.value ? "bg-mv-green-50 text-mv-green-800" : "bg-white/70 text-mv-muted"
              )}
            >
              {o.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function CheckboxRow({
  checked,
  onChange,
  label,
  hint,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  hint?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <label
      className={cx(
        "flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2 text-[13px] transition-colors",
        checked ? "border-mv-green/50 bg-mv-green-50" : "border-mv-line bg-white hover:bg-mv-surface-2",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#3B8500]"
      />
      <span className="min-w-0">
        <span className="font-medium text-mv-ink">{label}</span>
        {hint && <span className="block text-[11px] text-mv-muted">{hint}</span>}
      </span>
    </label>
  );
}

/** Lista de resultados de validación (✓ / ✗) con su explicación. */
export function Checklist({ items, compact }: { items: Chequeo[]; compact?: boolean }) {
  return (
    <ul className={cx("divide-y divide-mv-line rounded-lg border border-mv-line bg-white", compact && "text-xs")}>
      {items.map((c) => (
        <li key={c.id} className="flex items-start gap-2.5 px-3 py-2">
          {c.ok ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-st-ok" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-st-crit" />
          )}
          <div className="min-w-0">
            <p className={cx("font-semibold", c.ok ? "text-mv-ink" : "text-st-crit-fg")}>{c.etiqueta}</p>
            <p className="break-words text-[12px] text-mv-ink-2">{c.detalle}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ───────────────────────── Modal (tema claro)
export function Dialog({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  const w = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" }[size];
  return (
    <div className="no-print fixed inset-0 z-[60] flex items-end justify-center bg-mv-ink/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className={cx("relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-xl bg-white shadow-pop sm:rounded-xl", w)}>
        <div className="flex items-start justify-between gap-3 border-b border-mv-line px-5 py-4">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-mv-ink">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-mv-ink-2">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-mv-muted hover:bg-mv-surface hover:text-mv-ink" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-mv-line bg-mv-surface-2 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function TableWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("max-h-[560px] overflow-auto", className)}>{children}</div>;
}

/**
 * Panel de detalle maestro-detalle: en pantallas ≥ 1536 px se muestra fijo a la derecha
 * de la tabla; en pantallas menores se abre como panel deslizante al seleccionar un registro.
 */
export function DetailAside({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return (
    <>
      {open && <div className="no-print fixed inset-0 z-40 bg-mv-ink/30 2xl:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        className={cx(
          "2xl:sticky 2xl:top-20 2xl:block 2xl:max-h-[calc(100vh-6rem)] 2xl:self-start 2xl:overflow-y-auto",
          open
            ? "fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-pop 2xl:static 2xl:z-auto 2xl:w-auto 2xl:max-w-none 2xl:bg-transparent 2xl:shadow-none"
            : "hidden"
        )}
      >
        {open && (
          <div className="sticky top-0 z-10 flex justify-end border-b border-mv-line bg-white px-3 py-2 2xl:hidden">
            <button onClick={onClose} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-mv-ink-2 hover:bg-mv-surface">
              <X className="h-4 w-4" /> Cerrar detalle
            </button>
          </div>
        )}
        {children}
      </aside>
    </>
  );
}
