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
  variant?: "default" | "success" | "warning" | "info" | "destructive";
}

const variantStyles = {
  default: "from-muted/50 to-muted/30 border-border/50",
  success: "from-success/10 to-success/5 border-success/20",
  warning: "from-warning/10 to-warning/5 border-warning/20",
  info: "from-info/10 to-info/5 border-info/20",
  destructive: "from-destructive/10 to-destructive/5 border-destructive/20",
};

const iconVariants = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  info: "bg-info/20 text-info",
  destructive: "bg-destructive/20 text-destructive",
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 transition-all hover:shadow-lg",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("rounded-lg p-3", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
