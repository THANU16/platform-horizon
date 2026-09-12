import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/Spinner";
import { getWalletTransactions } from "@/services/api";
import { Airline, WalletTransaction } from "@/types";
import { Plus, Minus } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const statusVariant = (status: WalletTransaction["status"]) =>
  status === "completed"
    ? "bg-secondary/15 text-secondary border-secondary/30"
    : status === "pending"
    ? "bg-warning/15 text-warning border-warning/30"
    : "bg-destructive/15 text-destructive border-destructive/30";

export function WalletTransactionsDialog({
  airline,
  onOpenChange,
}: {
  airline: Airline | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!airline) return;
    setLoading(true);
    getWalletTransactions(airline.id)
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, [airline]);

  return (
    <Dialog open={!!airline} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Wallet Transactions</DialogTitle>
          <DialogDescription>
            {airline?.name} — balance {formatCurrency(airline?.walletBalance ?? 0)}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <LoadingState />
        ) : transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No wallet transactions yet.
          </p>
        ) : (
          <div className="max-h-[60vh] overflow-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Opening Balance</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Closing Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const isCredit = tx.direction === "credit";
                  return (
                    <TableRow key={tx.id} className="table-row-hover">
                      <TableCell className="whitespace-nowrap text-sm">{formatDate(tx.date)}</TableCell>
                      <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                      <TableCell className="text-sm">
                        {tx.field === "walletCredit" ? "Wallet Credit" : "Wallet Balance"}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>
                          {tx.source === "cancelled_flight" ? "Cancelled flight" : "Manual adjustment"}
                        </div>
                        {tx.reference && (
                          <div className="text-xs text-muted-foreground font-mono">{tx.reference}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(tx.openingBalance)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-medium tabular-nums ${
                            isCredit ? "text-secondary" : "text-destructive"
                          }`}
                        >
                          {isCredit ? <Plus className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                          {formatCurrency(tx.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(tx.closingBalance)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`rounded-full capitalize ${statusVariant(tx.status)}`}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
