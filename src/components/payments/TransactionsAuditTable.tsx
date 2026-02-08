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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionTypeBadge } from "@/components/ui/TransactionTypeBadge";
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
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-medium">Transactions & Audit Trail</CardTitle>
          </div>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="top_up">Airline Top-up</SelectItem>
              <SelectItem value="credit_change">Platform Credit</SelectItem>
              <SelectItem value="booking_charge">Hotel Booking</SelectItem>
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
                          <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                            {transaction.airport}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {transaction.country}
                      </TableCell>
                      <TableCell>
                        <TransactionTypeBadge type={transaction.type} />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
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
                    <TransactionTypeBadge type={transaction.type} />
                    {transaction.airport && (
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                        {transaction.airport}
                      </span>
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
