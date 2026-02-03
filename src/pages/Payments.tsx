import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { KpiCard } from "@/components/ui/KpiCard";
import { LoadingState } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPayments } from "@/services/api";
import { Payment } from "@/types";
import { DollarSign, TrendingUp, AlertCircle, CreditCard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await getPayments();
        setPayments(data);
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.airlineName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = payments
    .filter((p) => p.type === "payout" && p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayouts = payments
    .filter((p) => p.type === "payout" && p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const failedPayouts = payments.filter((p) => p.status === "failed").length;

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading payments..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header title="Payments & Revenue" subtitle="Platform financial overview and payout management" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Total Platform Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={{ value: 18, label: "vs last month" }}
        />
        <KpiCard
          title="Pending Payouts"
          value={formatCurrency(pendingPayouts)}
          icon={TrendingUp}
        />
        <KpiCard
          title="Failed Payouts"
          value={failedPayouts}
          icon={AlertCircle}
          trend={{ value: -2, label: "vs last month" }}
        />
        <KpiCard
          title="Total Transactions"
          value={payments.length}
          icon={CreditCard}
        />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <PaymentsList 
            payments={filteredPayments} 
            search={search} 
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
        <TabsContent value="completed">
          <PaymentsList 
            payments={filteredPayments.filter(p => p.status === "completed")} 
            search={search} 
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
        <TabsContent value="pending">
          <PaymentsList 
            payments={filteredPayments.filter(p => p.status === "pending")} 
            search={search} 
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
        <TabsContent value="failed">
          <PaymentsList 
            payments={filteredPayments.filter(p => p.status === "failed")} 
            search={search} 
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}

function PaymentsList({
  payments,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  formatCurrency,
}: {
  payments: Payment[];
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  formatCurrency: (value: number) => string;
}) {
  if (payments.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No payments found"
        description="No payments match your current filters."
      />
    );
  }

  return (
    <>
      <FilterBar
        searchPlaceholder="Search by airline..."
        searchValue={search}
        onSearchChange={onSearchChange}
        filters={[
          {
            name: "Status",
            value: statusFilter,
            onChange: onStatusFilterChange,
            placeholder: "All Status",
            options: [
              { value: "all", label: "All Status" },
              { value: "completed", label: "Completed" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
            ],
          },
        ]}
      />

      {/* Desktop Table */}
      <div className="hidden lg:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Date</TableHead>
              <TableHead>Airline</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="table-row-hover">
                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{payment.airlineName}</TableCell>
                <TableCell className="capitalize">{payment.type}</TableCell>
                <TableCell className="text-muted-foreground">{payment.description}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <StatusBadge status={payment.status as StatusType} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id} className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium">{payment.airlineName}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{payment.type}</p>
                </div>
                <StatusBadge status={payment.status as StatusType} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</span>
                <span className="font-semibold">{formatCurrency(payment.amount)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{payment.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
