import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
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
import { EmptyState } from "@/components/ui/EmptyState";
import { TransactionTypeBadge } from "@/components/ui/TransactionTypeBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Landmark, Settings, Wallet, ArrowUpRight, ArrowDownRight, Receipt } from "lucide-react";
import { PlatformReserveTransaction, DateRangeFilter, PlatformTreasurySummary } from "@/types";

interface PlatformTreasuryTabProps {
  treasurySummary: PlatformTreasurySummary;
  reserveTransactions: PlatformReserveTransaction[];
  dateRange: DateRangeFilter;
  onDateRangeChange: (value: DateRangeFilter) => void;
  onManageReserve: () => void;
}

export function PlatformTreasuryTab({
  treasurySummary,
  reserveTransactions,
  dateRange,
  onDateRangeChange,
  onManageReserve,
}: PlatformTreasuryTabProps) {
  // Draft filter state
  const [draftDateRange, setDraftDateRange] = useState<DateRangeFilter>(dateRange);

  // Track if there are pending changes
  const hasChanges = draftDateRange !== dateRange;

  const handleApply = () => {
    onDateRangeChange(draftDateRange);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && hasChanges) {
      handleApply();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-6">
      {/* Treasury Summary Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="icon-container-sm">
            <Landmark className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Platform Reserve Summary</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onManageReserve}>
          <Settings className="w-4 h-4 mr-2" />
          Manage Reserve
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium">Current Balance</span>
              <div className="icon-container-sm">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(treasurySummary.currentBalance)}</p>
            <p className="text-xs text-muted-foreground mt-1">Available in reserve</p>
          </CardContent>
        </Card>

        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium">Total Deposited</span>
              <div className="icon-container-sm">
                <ArrowUpRight className="w-4 h-4 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-success">{formatCurrency(treasurySummary.totalDeposited)}</p>
            <p className="text-xs text-muted-foreground mt-1">All-time deposits</p>
          </CardContent>
        </Card>

        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium">Total Withdrawn</span>
              <div className="icon-container-sm">
                <ArrowDownRight className="w-4 h-4 text-destructive" />
              </div>
            </div>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(treasurySummary.totalWithdrawn)}</p>
            <p className="text-xs text-muted-foreground mt-1">All-time withdrawals</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                <CardTitle className="text-base font-medium">Platform Reserve Audit Trail</CardTitle>
              </div>
              <div className="flex items-center gap-2" onKeyDown={handleKeyDown}>
                <Select value={draftDateRange} onValueChange={(v) => setDraftDateRange(v as DateRangeFilter)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this_month">This Month</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                    <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                    <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleApply}
                  disabled={!hasChanges}
                  size="sm"
                  className="min-w-[80px]"
                >
                  Apply
                </Button>
              </div>
            </div>
            
            {/* Pending changes message */}
            {hasChanges && (
              <div className="flex items-center gap-2 text-sm text-warning">
                <AlertCircle className="w-4 h-4" />
                <span>Pending changes. Click Apply or press Enter.</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {reserveTransactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No reserve transactions"
              description="No platform reserve transactions found for the selected period."
            />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header">
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Admin User</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reserveTransactions.map((tx) => (
                      <TableRow key={tx.id} className="table-row-hover">
                        <TableCell>
                          <TransactionTypeBadge type={tx.type} />
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          <span className={tx.type === "PLATFORM_RESERVE_DEPOSIT" ? "text-success" : "text-destructive"}>
                            {tx.type === "PLATFORM_RESERVE_DEPOSIT" ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{tx.adminUser}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDateTime(tx.timestamp)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{tx.reference}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate">{tx.reason}</TableCell>
                        <TableCell>
                          <StatusBadge status={tx.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {reserveTransactions.map((tx) => (
                  <div key={tx.id} className="bg-muted/30 rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <TransactionTypeBadge type={tx.type} />
                      <span className={`font-semibold ${tx.type === "PLATFORM_RESERVE_DEPOSIT" ? "text-success" : "text-destructive"}`}>
                        {tx.type === "PLATFORM_RESERVE_DEPOSIT" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{tx.adminUser}</span>
                      <StatusBadge status={tx.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">{tx.reason}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDateTime(tx.timestamp)}</span>
                      <span className="font-mono">{tx.reference}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
