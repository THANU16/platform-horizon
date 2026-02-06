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
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Receipt, Eye } from "lucide-react";
import { WalletTransaction, WalletTransactionType, Airline, Airport } from "@/types";

interface WalletTransactionsTableProps {
  transactions: WalletTransaction[];
  airlines: Airline[];
  countries: string[];
  airports: Airport[];
  typeFilter: string;
  countryFilter: string;
  airlineFilter: string;
  onTypeFilterChange: (value: string) => void;
  onCountryFilterChange: (value: string) => void;
  onAirlineFilterChange: (value: string) => void;
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

export function WalletTransactionsTable({
  transactions,
  airlines,
  countries,
  airports,
  typeFilter,
  countryFilter,
  airlineFilter,
  onTypeFilterChange,
  onCountryFilterChange,
  onAirlineFilterChange,
}: WalletTransactionsTableProps) {
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
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesCountry = countryFilter === "all" || transaction.country === countryFilter;
    const matchesAirline = airlineFilter === "all" || transaction.airlineId === airlineFilter;
    return matchesType && matchesCountry && matchesAirline;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Transactions & Audit Trail</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Table Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Type" />
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
          <Select value={airlineFilter} onValueChange={onAirlineFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Airline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Airlines</SelectItem>
              {airlines.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={onCountryFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="table-row-hover">
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{transaction.airlineName}</TableCell>
                      <TableCell>
                        {transaction.airport ? (
                          <Badge variant="outline" className="text-xs font-mono">
                            {transaction.airport}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {transaction.country}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={transactionTypeVariants[transaction.type]}
                          className="text-xs"
                        >
                          {transactionTypeLabels[transaction.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={transaction.amount < 0 ? "text-destructive" : "text-success"}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={transaction.status as StatusType} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {transaction.reference}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className="animate-fade-in">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{transaction.airlineName}</h3>
                        <Badge 
                          variant={transactionTypeVariants[transaction.type]}
                          className="text-xs mt-1"
                        >
                          {transactionTypeLabels[transaction.type]}
                        </Badge>
                      </div>
                      <StatusBadge status={transaction.status as StatusType} />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                      {transaction.airport && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Airport</span>
                          <Badge variant="outline" className="text-xs font-mono">
                            {transaction.airport}
                          </Badge>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country</span>
                        <Badge variant="outline" className="text-xs">
                          {transaction.country}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className={`font-semibold ${transaction.amount < 0 ? "text-destructive" : "text-success"}`}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{transaction.reference}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
