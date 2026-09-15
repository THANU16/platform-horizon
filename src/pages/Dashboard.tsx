import { useEffect, useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { LoadingState } from "@/components/ui/Spinner";
import { getDashboardStats, getAirlines } from "@/services/api";
import { DashboardStats, Airline } from "@/types";
import { Plane, PlaneTakeoff, DollarSign, TrendingUp, CreditCard, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

type KpiRange = "today" | "this_week" | "this_month" | "this_year" | "all";

const RANGE_LABEL: Record<KpiRange, string> = {
  today: "Today",
  this_week: "This Week",
  this_month: "This Month",
  this_year: "This Year",
  all: "All Time",
};

// Mock scaling factor applied to KPI numeric values
const RANGE_FACTOR: Record<KpiRange, number> = {
  today: 0.03,
  this_week: 0.2,
  this_month: 1,
  this_year: 8,
  all: 12,
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpiRange, setKpiRange] = useState<KpiRange>("this_month");

  useEffect(() => {
    const load = async () => {
      try {
        const [data, a] = await Promise.all([getDashboardStats(), getAirlines()]);
        setStats(data);
        setAirlines(a);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const topAirlines = useMemo(
    () =>
      [...airlines]
        .sort((a, b) => b.platformRevenue - a.platformRevenue)
        .slice(0, 10),
    [airlines]
  );

  const totalWalletBalance = useMemo(
    () => airlines.reduce((sum, a) => sum + (a.walletBalance ?? 0), 0),
    [airlines]
  );

  const totalBookingValue = useMemo(
    () => airlines.reduce((sum, a) => sum + (a.totalBookingValue ?? 0), 0),
    [airlines]
  );

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading dashboard..." />
      </MainLayout>
    );
  }

  if (!stats) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const f = RANGE_FACTOR[kpiRange];
  const scaledTotalAirlines = Math.max(0, Math.round(stats.totalAirlines * Math.min(1, f)));
  const scaledFlights = Math.max(0, Math.round(stats.cancelledFlightsThisMonth * f));
  const scaledRevenue = Math.max(0, totalBookingValue * f);
  const scaledEarnings = Math.max(0, stats.platformRevenue * f);

  return (
    <MainLayout>
      <Header title="Dashboard" subtitle="Platform health and operational overview" />

      {/* KPI Cards - filter applies only to matrix cards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground">{RANGE_LABEL[kpiRange]} metrics</h2>
        <Select value={kpiRange} onValueChange={(v) => setKpiRange(v as KpiRange)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(scaledRevenue)}
          icon={DollarSign}
          trend={{ value: stats.revenueChangePercent, label: "vs prior period" }}
          subtext="Total booking value"
        />
        <KpiCard
          title="Total Cancelled Flights"
          value={scaledFlights}
          icon={PlaneTakeoff}
          trend={{ value: stats.flightChangePercent, label: "vs prior period" }}
          subtext={RANGE_LABEL[kpiRange]}
        />
        <KpiCard
          title="Total Earnings"
          value={formatCurrency(scaledEarnings)}
          icon={TrendingUp}
          trend={{ value: stats.revenueChangePercent, label: "vs prior period" }}
          subtext="Platform fees earned"
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KpiCard
          title="Total Airlines"
          value={scaledTotalAirlines}
          icon={Plane}
          trend={{ value: stats.airlineGrowthPercent, label: "vs prior period" }}
          subtext={RANGE_LABEL[kpiRange]}
        />
        <KpiCard
          title="Total Credit Issued"
          value={formatCurrency(stats.totalCreditIssued)}
          icon={CreditCard}
          subtext="Max outstanding fees allowed"
        />
        <KpiCard
          title="Total Wallet Balance"
          value={formatCurrency(totalWalletBalance)}
          icon={Wallet}
          subtext="All airline wallets (bank balance)"
        />
      </div>

      {/* Row 3 — Monthly Platform Revenue (full width) */}
      <Card className="animate-fade-in mb-6">
        <CardHeader>
          <CardTitle className="text-base font-medium">Monthly Platform Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--success))", strokeWidth: 0, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Row 4 — Cancelled flights trend + Top 10 airlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base font-medium">Cancelled Flights Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyCancellations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, "Flights"]}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base font-medium">Top 10 Airlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] overflow-y-auto pr-1 space-y-2">
              {topAirlines.map((airline, index) => (
                <div
                  key={airline.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-muted text-xs font-semibold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{airline.name}</p>
                      <Badge variant="secondary" className="rounded-full text-xs font-mono h-5 mt-1">
                        {airline.iataCode}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold tabular-nums">
                      {formatCurrency(airline.platformRevenue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {airline.cancelledFlights.toLocaleString()} cancelled flights
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
