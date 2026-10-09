import { useEffect, useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { LoadingState } from "@/components/ui/Spinner";
import { getDashboardStats, getAirlines } from "@/services/api";
import { DashboardStats, Airline } from "@/types";
import { Plane, PlaneTakeoff, DollarSign, TrendingUp, CreditCard, Wallet, Building2 } from "lucide-react";
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

type KpiRange = "today" | "yesterday" | "this_week" | "this_month" | "this_year";

const RANGE_LABEL: Record<KpiRange, string> = {
  today: "Today",
  yesterday: "Yesterday",
  this_week: "This Week",
  this_month: "This Month",
  this_year: "This Year",
};

// Mock scaling factor applied to KPI numeric values
const RANGE_FACTOR: Record<KpiRange, number> = {
  today: 0.03,
  yesterday: 0.028,
  this_week: 0.2,
  this_month: 1,
  this_year: 8,
};

type SeriesPoint = { label: string; value: number };

// Deterministic pseudo-random from an index (stable across renders)
const seeded = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const HOURS = Array.from({ length: 24 }, (_, h) => `${h.toString().padStart(2, "0")}:00`);
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildSeries(range: KpiRange, total: number, salt: number): SeriesPoint[] {
  if (total <= 0) return [];
  const now = new Date();

  if (range === "today" || range === "yesterday") {
    const lastHour = range === "today" ? now.getHours() : 23;
    const labels = HOURS.slice(0, lastHour + 1);
    const weights = labels.map((_, i) => 0.4 + seeded(i, salt));
    const sum = weights.reduce((a, b) => a + b, 0);
    return labels.map((label, i) => ({ label, value: Math.round((total * weights[i]) / sum) }));
  }

  if (range === "this_week") {
    const weights = WEEK_DAYS.map((_, i) => 0.5 + seeded(i, salt));
    const sum = weights.reduce((a, b) => a + b, 0);
    return WEEK_DAYS.map((label, i) => ({ label, value: Math.round((total * weights[i]) / sum) }));
  }

  if (range === "this_month") {
    const weights = MONTHS.map((_, i) => 0.5 + seeded(i, salt));
    const sum = weights.reduce((a, b) => a + b, 0);
    return MONTHS.map((label, i) => ({ label, value: Math.round((total * weights[i]) / sum) }));
  }

  // this_year — last 6 years
  const years = Array.from({ length: 6 }, (_, i) => `${now.getFullYear() - 5 + i}`);
  const weights = years.map((_, i) => 0.4 + seeded(i, salt) + i * 0.25);
  const sum = weights.reduce((a, b) => a + b, 0);
  return years.map((label, i) => ({ label, value: Math.round((total * weights[i]) / sum) }));
}

const VENDORS = ["Hotelbeds", "RateHawk", "Booking.com"] as const;

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

  const f = RANGE_FACTOR[kpiRange];

  const totalWalletBalance = useMemo(
    () => airlines.reduce((sum, a) => sum + (a.walletBalance ?? 0), 0),
    [airlines]
  );

  const totalBookingValue = useMemo(
    () => airlines.reduce((sum, a) => sum + (a.totalBookingValue ?? 0), 0),
    [airlines]
  );

  const topAirlines = useMemo(
    () =>
      [...airlines]
        .map((a) => ({
          ...a,
          platformRevenue: a.platformRevenue * f,
          cancelledFlights: Math.max(0, Math.round(a.cancelledFlights * f)),
        }))
        .sort((a, b) => b.platformRevenue - a.platformRevenue)
        .slice(0, 10),
    [airlines, f]
  );

  const scaledRevenue = Math.max(0, totalBookingValue * f);
  const scaledEarnings = Math.max(0, (stats?.platformRevenue ?? 0) * f);
  const scaledFlights = Math.max(0, Math.round((stats?.cancelledFlightsThisMonth ?? 0) * f));

  const revenueSeries = useMemo(
    () => buildSeries(kpiRange, scaledEarnings, 7),
    [kpiRange, scaledEarnings]
  );

  const cancellationSeries = useMemo(
    () => buildSeries(kpiRange, scaledFlights, 13),
    [kpiRange, scaledFlights]
  );

  // Vendor performance: bookings, commission earned, share of earnings
  const vendorStats = useMemo(() => {
    const totalBookings = airlines.reduce((s, a) => s + (a.totalBookings ?? 0), 0);
    const weights = VENDORS.map((_, i) => 0.6 + seeded(i, 21));
    const wSum = weights.reduce((a, b) => a + b, 0);
    return VENDORS.map((name, i) => {
      const share = weights[i] / wSum;
      const commission = scaledEarnings * share * 0.55; // commission portion of earnings
      return {
        name,
        bookings: Math.round(totalBookings * f * share),
        commission,
        shareOfEarnings: share * 100,
      };
    });
  }, [airlines, scaledEarnings, f]);

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

  const scaledTotalAirlines = Math.max(0, Math.round(stats.totalAirlines * Math.min(1, f)));

  return (
    <MainLayout>
      <Header title="Dashboard" subtitle="Platform health and operational overview" />

      {/* KPI Cards + charts — all respond to this filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground">{RANGE_LABEL[kpiRange]} metrics</h2>
        <Select value={kpiRange} onValueChange={(v) => setKpiRange(v as KpiRange)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
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

      {/* Row 3 — Platform Revenue (full width, responds to filter) */}
      <Card className="animate-fade-in mb-6">
        <CardHeader>
          <CardTitle className="text-base font-medium">Platform Revenue — {RANGE_LABEL[kpiRange]}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                  dataKey="value"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--success))", strokeWidth: 0, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Row 4 — Cancelled flights trend + Top 10 airlines (respond to filter) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base font-medium">Cancelled Flights Trend — {RANGE_LABEL[kpiRange]}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cancellationSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, "Flights"]}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base font-medium">Top 10 Airlines — {RANGE_LABEL[kpiRange]}</CardTitle>
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

      {/* Row 5 — Vendor performance */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Vendor Performance — {RANGE_LABEL[kpiRange]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vendorStats.map((vendor) => (
              <div key={vendor.name} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{vendor.name}</p>
                  <Badge variant="secondary" className="rounded-full text-xs">
                    {vendor.shareOfEarnings.toFixed(1)}% of earnings
                  </Badge>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total bookings</p>
                    <p className="text-lg font-semibold tabular-nums">
                      {vendor.bookings.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Commission earned</p>
                    <p className="text-lg font-semibold tabular-nums text-success">
                      {formatCurrency(vendor.commission)}
                    </p>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${vendor.shareOfEarnings}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
