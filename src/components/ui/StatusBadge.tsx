import { cn } from "@/lib/utils";

export type StatusType = 
  | "success" | "completed" | "active" | "published" | "connected"
  | "warning" | "pending" | "sent"
  | "error" | "failed" | "expired" | "suspended"
  | "info" | "in_progress" | "processing"
  | "default" | "draft" | "inactive" | "revoked" | "disabled";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { class: string; defaultLabel: string }> = {
  // Success variants
  success: { class: "badge-success", defaultLabel: "Success" },
  completed: { class: "badge-success", defaultLabel: "Completed" },
  active: { class: "badge-success", defaultLabel: "Active" },
  published: { class: "badge-success", defaultLabel: "Published" },
  connected: { class: "badge-success", defaultLabel: "Connected" },
  
  // Warning variants
  warning: { class: "badge-warning", defaultLabel: "Warning" },
  pending: { class: "badge-warning", defaultLabel: "Pending" },
  sent: { class: "badge-warning", defaultLabel: "Sent" },
  
  // Error variants
  error: { class: "badge-destructive", defaultLabel: "Error" },
  failed: { class: "badge-destructive", defaultLabel: "Failed" },
  expired: { class: "badge-destructive", defaultLabel: "Expired" },
  suspended: { class: "badge-destructive", defaultLabel: "Suspended" },
  
  // Info variants
  info: { class: "badge-info", defaultLabel: "Info" },
  in_progress: { class: "badge-info", defaultLabel: "In Progress" },
  processing: { class: "badge-info", defaultLabel: "Processing" },
  
  // Default/Muted variants
  default: { class: "bg-muted text-muted-foreground border-border", defaultLabel: "Default" },
  draft: { class: "bg-muted text-muted-foreground border-border", defaultLabel: "Draft" },
  inactive: { class: "bg-muted text-muted-foreground border-border", defaultLabel: "Inactive" },
  revoked: { class: "bg-muted text-muted-foreground border-border", defaultLabel: "Revoked" },
  disabled: { class: "bg-muted text-muted-foreground border-border", defaultLabel: "Disabled" },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.default;
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.class,
        className
      )}
    >
      {label || config.defaultLabel}
    </span>
  );
}
