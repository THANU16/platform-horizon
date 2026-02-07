import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Receipt } from "lucide-react";
import { WalletTransaction, WalletTransactionType } from "@/types";
import { cn } from "@/lib/utils";

interface TransactionsAuditTableProps {
  transactions: WalletTransaction[];
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

const transactionTypeLabels: Record<WalletTransactionType, string> = {
  top_up: "Top-up",
  booking_charge: "Booking Charge",
  refund: "Refund",
  adjustment: "Adjustment",
  credit_change: "Credit Change",
  platform_fee: "Platform Fee",
};

const transactionTypeVariants: Record<WalletTransactionType, "default" | "secondary" | "destructive" | "outline"> = {
  top_up: "default",
  booking_charge: "secondary",
  refund: "outline",
  adjustment: "outline",
  credit_change: "secondary",
  platform_fee: "destructive",
};

export function TransactionsAuditTable({
  transactions,
  typeFilter,
  onTypeFilterChange,
}: TransactionsAuditTableProps) {
  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(absValue);
    return value < 0 ? `-${formatted}` : `+${formatted}`;
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return typeFilter === "all" || transaction.type === typeFilter;
  });

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Transactions & Audit Trail</CardTitle>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="top_up">Top-up</SelectItem>
              <SelectItem value="booking_charge">Booking Charge</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
              <SelectItem value="credit_change">Credit Change</SelectItem>
              <SelectItem value="platform_fee">Platform Fee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No transactions found"
            description="No transactions match your current filters."
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Date</TableHead>
                    <TableHead>Airline</TableHead>
                    <TableHead>Airport</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="table-row-hover">
                      <TableCell className="text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium text-primary">
                        {transaction.airlineName}
                      </TableCell>
                      <TableCell>
                        {transaction.airport ? (
                          <Badge variant="secondary" className="text-xs font-mono">
                            {transaction.airport}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {transaction.country}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={transactionTypeVariants[transaction.type]}
                          className="text-xs"
                        >
                          {transactionTypeLabels[transaction.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={cn(
                          transaction.amount < 0 ? "text-destructive" : "text-success"
                        )}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={transaction.status as StatusType} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {transaction.reference}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {transaction.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="bg-muted/30 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-primary text-sm">{transaction.airlineName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={cn(
                      "font-semibold",
                      transaction.amount < 0 ? "text-destructive" : "text-success"
                    )}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant={transactionTypeVariants[transaction.type]}
                      className="text-xs"
                    >
                      {transactionTypeLabels[transaction.type]}
                    </Badge>
                    {transaction.airport && (
                      <Badge variant="secondary" className="text-xs font-mono">
                        {transaction.airport}
                      </Badge>
                    )}
                    <StatusBadge status={transaction.status as StatusType} />
                  </div>
                  <p className="text-xs text-muted-foreground">{transaction.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
