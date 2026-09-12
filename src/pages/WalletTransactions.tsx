import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { LoadingState } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SimplePagination } from "@/components/ui/SimplePagination";
import { getWalletTransactions, getAirlineById } from "@/services/api";
import { Airline, WalletTransaction } from "@/types";
import { Plus, Minus, ArrowLeft, Wallet } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

// UI status label: data "completed" is shown as "Success"
const statusLabel = (status: WalletTransaction["status"]) =>
  status === "completed" ? "Success" : status === "pending" ? "Pending" : "Failed";

const statusVariant = (status: WalletTransaction["status"]) =>
  status === "completed"
    ? "bg-secondary/15 text-secondary border-secondary/30"
    : status === "pending"
    ? "bg-warning/15 text-warning border-warning/30"
    : "bg-destructive/15 text-destructive border-destructive/30";

export default function WalletTransactions() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [airline, setAirline] = useState<Airline | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const [a, txs] = await Promise.all([
          getAirlineById(id),
          getWalletTransactions(id),
        ]);
        setAirline(a ?? null);
        setTransactions(txs);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleClearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const startTs = startDate ? new Date(startDate).getTime() : null;
    const endTs = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1 : null;
    return transactions.filter((tx) => {
      const matchesSearch =
        !q ||
        tx.id.toLowerCase().includes(q) ||
        (tx.reference ?? "").toLowerCase().includes(q) ||
        (tx.description ?? "").toLowerCase().includes(q);
      // map UI "success" back to data "completed"
      const txStatus = tx.status === "completed" ? "success" : tx.status;
      const matchesStatus = statusFilter === "all" || txStatus === statusFilter;
      const ts = new Date(tx.date).getTime();
      const matchesStart = startTs === null || ts >= startTs;
      const matchesEnd = endTs === null || ts <= endTs;
      return matchesSearch && matchesStatus && matchesStart && matchesEnd;
    });
  }, [transactions, search, statusFilter, startDate, endDate]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, startDate, endDate, pageSize]);

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading wallet transactions..." />
      </MainLayout>
    );
  }

  const subtitle = airline
    ? `${airline.name} — Wallet Balance ${formatCurrency(airline.walletBalance ?? 0)}`
    : "Airline wallet ledger";

  return (
    <MainLayout>
      <Header title="Wallet Transactions" subtitle={subtitle}>
        <Button variant="outline" size="sm" onClick={() => navigate("/airlines")}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Airlines
        </Button>
      </Header>

      <FilterBar
        searchPlaceholder="Search by ID, reference or reason..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            name: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            placeholder: "All Status",
            options: [
              { value: "all", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "success", label: "Success" },
              { value: "failed", label: "Failed" },
            ],
          },
        ]}
        onClear={handleClearFilters}
      >
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Start date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 w-[150px]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">End date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 w-[150px]"
            />
          </div>
        </div>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No wallet transactions found"
          description="No transactions match your current filters. Try adjusting the date range or status."
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="text-right">Opening Balance</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Closing Balance</TableHead>
                  <TableHead className="text-right">Credit Limit</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((tx) => {
                  const isCredit = tx.direction === "credit";
                  return (
                    <TableRow key={tx.id} className="table-row-hover">
                      <TableCell className="whitespace-nowrap text-sm">{formatDate(tx.date)}</TableCell>
                      <TableCell className="font-mono text-sm">{tx.id}</TableCell>
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
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(airline?.creditLimit ?? 0)}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>
                          {tx.source === "cancelled_flight" ? "Cancelled flight" : "Manual adjustment"}
                        </div>
                        {tx.reference && (
                          <div className="text-xs text-muted-foreground font-mono">{tx.reference}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`rounded-full capitalize ${statusVariant(tx.status)}`}>
                          {statusLabel(tx.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {paginated.map((tx) => {
              const isCredit = tx.direction === "credit";
              return (
                <div key={tx.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-sm">{tx.id}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                    </div>
                    <Badge variant="outline" className={`rounded-full capitalize ${statusVariant(tx.status)}`}>
                      {statusLabel(tx.status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>
                      <p className="text-muted-foreground">Opening</p>
                      <p className="font-medium tabular-nums">{formatCurrency(tx.openingBalance)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Closing</p>
                      <p className="font-medium tabular-nums">{formatCurrency(tx.closingBalance)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Credit Limit</p>
                      <p className="font-medium tabular-nums">{formatCurrency(airline?.creditLimit ?? 0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reason</p>
                      <p className="font-medium">
                        {tx.source === "cancelled_flight" ? "Cancelled flight" : "Manual adjustment"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <span
                      className={`inline-flex items-center gap-1 font-medium tabular-nums ${
                        isCredit ? "text-secondary" : "text-destructive"
                      }`}
                    >
                      {isCredit ? <Plus className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <SimplePagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </MainLayout>
  );
}
