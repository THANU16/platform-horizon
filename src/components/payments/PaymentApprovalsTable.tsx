import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaymentApproval, PaymentApprovalStatus } from "@/types";
import { Banknote, CreditCard, Check, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentApprovalsTableProps {
  approvals: PaymentApproval[];
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

const statusStyles: Record<PaymentApprovalStatus, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabels: Record<PaymentApprovalStatus, string> = {
  pending: "Pending Approval",
  approved: "Approved",
  rejected: "Rejected",
};

export function PaymentApprovalsTable({
  approvals,
  statusFilter,
  onStatusFilterChange,
  onApprove,
  onReject,
}: PaymentApprovalsTableProps) {
  const [rejecting, setRejecting] = useState<PaymentApproval | null>(null);
  const [reason, setReason] = useState("");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const filtered = approvals.filter(
    (a) => statusFilter === "all" || a.status === statusFilter
  );

  const confirmReject = () => {
    if (rejecting) {
      onReject(rejecting.id, reason.trim() || "Rejected by admin");
      setRejecting(null);
      setReason("");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-medium">
              Payment Approvals
            </CardTitle>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Banknote}
            title="No payments found"
            description="No settlement payments match the current filter."
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Submitted</TableHead>
                    <TableHead>Airline</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference Number</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((approval) => (
                    <TableRow key={approval.id} className="table-row-hover">
                      <TableCell className="text-muted-foreground">
                        {new Date(approval.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium text-primary">
                        {approval.airlineName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {approval.country}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-muted/50 text-muted-foreground border-border">
                          {approval.method === "bank_transfer" ? (
                            <Banknote className="w-3 h-3" />
                          ) : (
                            <CreditCard className="w-3 h-3" />
                          )}
                          {approval.method === "bank_transfer"
                            ? "Bank Transfer"
                            : "Credit Card"}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {approval.referenceNumber}
                        {approval.bankName && (
                          <span className="block font-sans">{approval.bankName}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(approval.amount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap",
                            statusStyles[approval.status]
                          )}
                        >
                          {statusLabels[approval.status]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {approval.receiptUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(approval.receiptUrl, "_blank", "noopener")
                              }
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              Receipt
                            </Button>
                          )}
                          {approval.status === "pending" && (
                            <>
                              <Button size="sm" onClick={() => onApprove(approval.id)}>
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setRejecting(approval)}
                              >
                                <X className="w-3.5 h-3.5 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-3">
              {filtered.map((approval) => (
                <div key={approval.id} className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-primary text-sm">
                        {approval.airlineName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(approval.submittedAt).toLocaleDateString()} ·{" "}
                        {approval.referenceNumber}
                      </p>
                    </div>
                    <span className="font-semibold">{formatCurrency(approval.amount)}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-muted/50 text-muted-foreground border-border">
                      {approval.method === "bank_transfer" ? "Bank Transfer" : "Credit Card"}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        statusStyles[approval.status]
                      )}
                    >
                      {statusLabels[approval.status]}
                    </span>
                  </div>
                  {approval.status === "pending" && (
                    <div className="flex items-center gap-2 pt-1">
                      <Button size="sm" onClick={() => onApprove(approval.id)}>
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setRejecting(approval)}
                      >
                        Reject
                      </Button>
                      {approval.receiptUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(approval.receiptUrl, "_blank", "noopener")
                          }
                        >
                          Receipt
                        </Button>
                      )}
                    </div>
                  )}
                  {approval.rejectionReason && (
                    <p className="text-xs text-destructive">{approval.rejectionReason}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>

      <Dialog open={!!rejecting} onOpenChange={(open) => !open && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject payment</DialogTitle>
            <DialogDescription>
              {rejecting &&
                `${rejecting.airlineName} · ${formatCurrency(rejecting.amount)} · ${rejecting.referenceNumber}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Input
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Receipt does not match the reference number"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
