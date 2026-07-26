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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FinancialStatusBadge } from "@/components/ui/FinancialStatusBadge";
import { TransactionTypeBadge } from "@/components/ui/TransactionTypeBadge";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  ArrowUpDown
} from "lucide-react";
import { AirlineFinancialHealth, BillingTransaction } from "@/types";
import { cn } from "@/lib/utils";

interface ExpandableAirlineHealthTableProps {
  data: AirlineFinancialHealth[];
  transactions: BillingTransaction[];
  onAirlineClick?: (airlineId: string) => void;
}

type SortField =
  | "airlineName"
  | "country"
  | "totalBookingValue"
  | "serviceFeesBilled"
  | "paymentsReceived"
  | "outstandingBalance"
  | "creditLimit";
type SortDirection = "asc" | "desc";

export function ExpandableAirlineHealthTable({ data, transactions, onAirlineClick }: ExpandableAirlineHealthTableProps) {
  const [expandedAirlines, setExpandedAirlines] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>("airlineName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleExpand = (airlineId: string) => {
    setExpandedAirlines(prev => {
      const next = new Set(prev);
      if (next.has(airlineId)) {
        next.delete(airlineId);
      } else {
        next.add(airlineId);
      }
      return next;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const multiplier = sortDirection === "asc" ? 1 : -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * multiplier;
    }
    return ((aVal as number) - (bVal as number)) * multiplier;
  });

  const getAirlineTransactions = (airlineId: string) => {
    return transactions.filter(t => t.airlineId === airlineId).slice(0, 3);
  };

  const getAirlineStats = (airline: AirlineFinancialHealth) => {
    const airlineTransactions = transactions.filter(t => t.airlineId === airline.airlineId);
    const serviceFees = airlineTransactions.filter(t => t.type === "service_fee");
    const disruptions = serviceFees.length;
    const collectionRate = airline.serviceFeesBilled > 0
      ? (airline.paymentsReceived / airline.serviceFeesBilled) * 100
      : 100;
    const creditUtilization = airline.creditLimit > 0
      ? (airline.outstandingBalance / airline.creditLimit) * 100
      : 0;

    return {
      disruptions,
      collectionRate,
      creditUtilization,
      feeTransactions: serviceFees.length,
    };
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={cn(
          "w-3 h-3",
          sortField === field ? "text-primary" : "text-muted-foreground/50"
        )} />
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          Airline Billing Health
          <span className="text-sm font-normal text-muted-foreground">({data.length} airlines)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No airlines found"
            description="No airlines match the current filters."
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <SortHeader field="airlineName">Airline</SortHeader>
                    <SortHeader field="country">Country</SortHeader>
                    <SortHeader field="totalBookingValue">Booking Value</SortHeader>
                    <SortHeader field="serviceFeesBilled">Service Fees</SortHeader>
                    <SortHeader field="paymentsReceived">Payments Received</SortHeader>
                    <SortHeader field="outstandingBalance">Outstanding</SortHeader>
                    <SortHeader field="creditLimit">Credit Limit</SortHeader>
                    <TableHead>Remaining Credit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((airline) => {
                    const isExpanded = expandedAirlines.has(airline.airlineId);
                    const airlineTransactions = getAirlineTransactions(airline.airlineId);
                    const stats = getAirlineStats(airline);

                    return (
                      <>
                        <TableRow
                          key={airline.airlineId}
                          className={cn(
                            "table-row-hover cursor-pointer",
                            isExpanded && "bg-muted/30"
                          )}
                          onClick={() => toggleExpand(airline.airlineId)}
                        >
                          <TableCell className="font-medium text-primary">
                            {airline.airlineName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {airline.country}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatCurrency(airline.totalBookingValue)}
                          </TableCell>
                          <TableCell>{formatCurrency(airline.serviceFeesBilled)}</TableCell>
                          <TableCell className="text-success font-medium">
                            {formatCurrency(airline.paymentsReceived)}
                          </TableCell>
                          <TableCell className={cn(
                            "font-medium",
                            airline.outstandingBalance > 0 ? "text-warning" : ""
                          )}>
                            {formatCurrency(airline.outstandingBalance)}
                          </TableCell>
                          <TableCell>{formatCurrency(airline.creditLimit)}</TableCell>
                          <TableCell className={cn(
                            airline.remainingCredit === 0 ? "text-destructive font-medium" : ""
                          )}>
                            {formatCurrency(airline.remainingCredit)}
                          </TableCell>
                          <TableCell>
                            <FinancialStatusBadge status={airline.status} />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Row */}
                        {isExpanded && (
                          <TableRow key={`${airline.airlineId}-expanded`} className="bg-muted/20">
                            <TableCell colSpan={10} className="p-0">
                              <div className="p-4 space-y-4">
                                {/* Stats Row */}
                                <div className="grid grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Fee Collection Rate</p>
                                    <p className="font-semibold">{stats.collectionRate.toFixed(1)}%</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Credit Utilization</p>
                                    <p className="font-semibold">{stats.creditUtilization.toFixed(1)}%</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Billed Disruptions</p>
                                    <p className="font-semibold">{stats.disruptions}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Fee Transactions</p>
                                    <p className="font-semibold">{stats.feeTransactions}</p>
                                  </div>
                                </div>

                                {/* Recent Transactions */}
                                {airlineTransactions.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium mb-2">Recent Billing Activity (Filtered)</p>
                                    <div className="space-y-2">
                                      {airlineTransactions.map((tx) => (
                                        <div
                                          key={tx.id}
                                          className="flex items-center justify-between text-sm bg-background rounded-lg p-2"
                                        >
                                          <div className="flex items-center gap-3">
                                            <span className="text-muted-foreground">{">>"}</span>
                                            <span className="text-muted-foreground">
                                              {new Date(tx.date).toLocaleDateString()}
                                            </span>
                                            <TransactionTypeBadge type={tx.type} />
                                            {tx.airport && (
                                              <Badge variant="secondary" className="text-xs font-mono">
                                                {tx.airport}
                                              </Badge>
                                            )}
                                            <span className="text-muted-foreground truncate max-w-[200px]">{tx.description}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className={cn(
                                              "font-medium",
                                              tx.amount < 0 ? "text-success" : "text-foreground"
                                            )}>
                                              {tx.amount < 0 ? `-${formatCurrency(Math.abs(tx.amount))}` : `+${formatCurrency(tx.amount)}`}
                                            </span>
                                            <StatusBadge status={tx.status as StatusType} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {sortedData.map((airline) => {
                const isExpanded = expandedAirlines.has(airline.airlineId);
                const airlineTransactions = getAirlineTransactions(airline.airlineId);
                const stats = getAirlineStats(airline);

                return (
                  <Card
                    key={airline.airlineId}
                    className="animate-fade-in cursor-pointer"
                    onClick={() => toggleExpand(airline.airlineId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-primary">{airline.airlineName}</h3>
                          <p className="text-sm text-muted-foreground">{airline.country}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FinancialStatusBadge status={airline.status} />
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Service Fees</span>
                          <p className="font-semibold">{formatCurrency(airline.serviceFeesBilled)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Payments Received</span>
                          <p className="font-semibold text-success">{formatCurrency(airline.paymentsReceived)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Outstanding</span>
                          <p className={cn(
                            "font-semibold",
                            airline.outstandingBalance > 0 ? "text-warning" : ""
                          )}>
                            {formatCurrency(airline.outstandingBalance)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Credit Limit</span>
                          <p className="font-semibold">{formatCurrency(airline.creditLimit)}</p>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-border space-y-4">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Fee Collection Rate</span>
                              <p className="font-semibold">{stats.collectionRate.toFixed(1)}%</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Credit Utilization</span>
                              <p className="font-semibold">{stats.creditUtilization.toFixed(1)}%</p>
                            </div>
                          </div>

                          {airlineTransactions.length > 0 && (
                            <div>
                              <p className="text-xs font-medium mb-2">Recent Billing Activity</p>
                              <div className="space-y-2">
                                {airlineTransactions.map((tx) => (
                                  <div
                                    key={tx.id}
                                    className="flex items-center justify-between text-xs bg-muted/50 rounded p-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <TransactionTypeBadge type={tx.type} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={cn(
                                        "font-medium",
                                        tx.amount < 0 ? "text-success" : "text-foreground"
                                      )}>
                                        {tx.amount < 0 ? `-${formatCurrency(Math.abs(tx.amount))}` : `+${formatCurrency(tx.amount)}`}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
