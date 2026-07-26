import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BillingTransactionType } from "@/types";

interface TransactionTypeBadgeProps {
  type: BillingTransactionType;
  className?: string;
}

const transactionConfig: Record<BillingTransactionType, {
  label: string;
  className: string;
  icon?: "up" | "down";
}> = {
  service_fee: {
    label: "Service Fee",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: "up",
  },
  fee_payment: {
    label: "Fee Payment",
    className: "bg-success/10 text-success border-success/20",
    icon: "down",
  },
  fee_adjustment: {
    label: "Fee Adjustment",
    className: "bg-info/10 text-info border-info/20",
  },
  credit_change: {
    label: "Credit Change",
    className: "bg-warning/10 text-warning border-warning/20",
  },
};

export function TransactionTypeBadge({ type, className }: TransactionTypeBadgeProps) {
  const config = transactionConfig[type] || {
    label: type,
    className: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.icon === "up" && <ArrowUpRight className="w-3 h-3" />}
      {config.icon === "down" && <ArrowDownRight className="w-3 h-3" />}
      {config.label}
    </span>
  );
}
