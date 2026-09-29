import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "info" | "destructive" | "purple";
  onClick?: () => void;
}

const variantStyles = {
  default: "bg-[#131622] border-[#202538] text-slate-100 hover:border-white/20",
  info: "bg-[#101726] border-[#1C2844] text-blue-400 hover:border-blue-500/40 shadow-[0_4px_20px_rgba(37,99,235,0.06)]",
  success: "bg-[#0D1C1A] border-[#153630] text-emerald-400 hover:border-emerald-500/40 shadow-[0_4px_20px_rgba(5,150,105,0.06)]",
  warning: "bg-[#1C160F] border-[#382615] text-amber-400 hover:border-amber-500/40 shadow-[0_4px_20px_rgba(217,119,6,0.06)]",
  destructive: "bg-[#1F1014] border-[#3B1A22] text-rose-400 hover:border-rose-500/40 shadow-[0_4px_20px_rgba(225,29,72,0.06)]",
  purple: "bg-[#171326] border-[#291E44] text-purple-400 hover:border-purple-500/40 shadow-[0_4px_20px_rgba(124,58,237,0.06)]",
};

const iconVariants = {
  default: "bg-white/5 text-slate-400 border border-white/5",
  info: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  destructive: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
  purple: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-[20px] border p-5 transition-all duration-200",
        onClick && "cursor-pointer hover:-translate-y-0.5",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold tracking-tight text-white">
              {value}
            </h3>
            {trend && (
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  trend.isPositive
                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                    : "bg-rose-950/60 text-rose-400 border border-rose-800/40"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs font-medium text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn("rounded-2xl p-3 flex items-center justify-center", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
