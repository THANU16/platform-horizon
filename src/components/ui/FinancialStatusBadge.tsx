import { cn } from "@/lib/utils";
import { AirlineFinancialStatus } from "@/types";

interface FinancialStatusBadgeProps {
  status: AirlineFinancialStatus;
  className?: string;
}

const statusConfig: Record<AirlineFinancialStatus, { label: string; className: string }> = {
  healthy: {
    label: "Healthy",
    className: "bg-success/10 text-success border-success/20",
  },
  using_credit: {
    label: "Using Credit",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  critical: {
    label: "Critical",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  topup_required: {
    label: "Top-up Required",
    className: "bg-warning/10 text-warning border-warning/20",
  },
};

export function FinancialStatusBadge({ status, className }: FinancialStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
