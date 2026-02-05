import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function KpiCard({ title, value, icon: Icon, subtext, trend, className }: KpiCardProps) {
  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;

  return (
    <div className={cn("card-kpi animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          {subtext && !trend && (
            <p className="text-xs text-muted-foreground">{subtext}</p>
          )}
          {trend && (
            <p className="text-xs">
              <span
                className={cn(
                  "font-medium",
                  isPositive && "text-success",
                  isNegative && "text-destructive",
                  !isPositive && !isNegative && "text-muted-foreground"
                )}
              >
                {isPositive && "+"}
                {trend.value}%
              </span>
              <span className="text-muted-foreground ml-1">{trend.label}</span>
            </p>
          )}
        </div>
        <div className="icon-container">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
