import { cn } from "@/lib/utils";
import { AirlineFinancialStatus } from "@/types";

interface FinancialStatusBadgeProps {
  status: AirlineFinancialStatus;
  className?: string;
}

const statusConfig: Record<AirlineFinancialStatus, { label: string; className: string }> = {
  settled: {
    label: "Settled",
    className: "bg-success/10 text-success border-success/20",
  },
  outstanding: {
    label: "Fees Outstanding",
    className: "bg-info/10 text-info border-info/20",
  },
  credit_warning: {
    label: "Credit Warning",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  credit_exceeded: {
    label: "Credit Exceeded",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function FinancialStatusBadge({ status, className }: FinancialStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
