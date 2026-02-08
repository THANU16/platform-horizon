import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export type TransactionBadgeType = 
  | "AIRLINE_TOPUP" 
  | "PLATFORM_CREDIT" 
  | "HOTEL_BOOKING_CHARGE" 
  | "PLATFORM_RESERVE_DEPOSIT" 
  | "PLATFORM_RESERVE_WITHDRAWAL"
  | "top_up"
  | "booking_charge"
  | "refund"
  | "adjustment"
  | "credit_change"
  | "platform_fee";

interface TransactionTypeBadgeProps {
  type: TransactionBadgeType;
  className?: string;
}

const transactionConfig: Record<TransactionBadgeType, { 
  label: string; 
  className: string; 
  icon?: "up" | "down";
}> = {
  // Strict transaction types
  AIRLINE_TOPUP: { 
    label: "Airline Top-up", 
    className: "bg-success/10 text-success border-success/20",
    icon: "up"
  },
  PLATFORM_CREDIT: { 
    label: "Platform Credit", 
    className: "bg-warning/10 text-warning border-warning/20"
  },
  HOTEL_BOOKING_CHARGE: { 
    label: "Hotel Booking", 
    className: "bg-muted text-muted-foreground border-border"
  },
  PLATFORM_RESERVE_DEPOSIT: { 
    label: "Deposit", 
    className: "bg-success/10 text-success border-success/20",
    icon: "up"
  },
  PLATFORM_RESERVE_WITHDRAWAL: { 
    label: "Withdrawal", 
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: "down"
  },
  // Legacy types mapping
  top_up: { 
    label: "Airline Top-up", 
    className: "bg-success/10 text-success border-success/20",
    icon: "up"
  },
  booking_charge: { 
    label: "Hotel Booking", 
    className: "bg-muted text-muted-foreground border-border"
  },
  refund: { 
    label: "Refund", 
    className: "bg-info/10 text-info border-info/20"
  },
  adjustment: { 
    label: "Adjustment", 
    className: "bg-secondary text-secondary-foreground border-border"
  },
  credit_change: { 
    label: "Platform Credit", 
    className: "bg-warning/10 text-warning border-warning/20"
  },
  platform_fee: { 
    label: "Platform Fee", 
    className: "bg-primary/10 text-primary border-primary/20"
  },
};

export function TransactionTypeBadge({ type, className }: TransactionTypeBadgeProps) {
  const config = transactionConfig[type] || { 
    label: type, 
    className: "bg-muted text-muted-foreground border-border" 
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
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
