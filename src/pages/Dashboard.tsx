import { useEffect, useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { LoadingState } from "@/components/ui/Spinner";
import { getDashboardStats, getAirlines } from "@/services/api";
import { VENDORS, vendorAccent } from "@/services/vendors";
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

  // Vendor performance: one row per vendor in the shared registry
  const vendorStats = useMemo(() => {
    const totalBookings = airlines.reduce((s, a) => s + (a.totalBookings ?? 0), 0);
    const weights = VENDORS.map((_, i) => 0.6 + seeded(i, 21));
    const wSum = weights.reduce((a, b) => a + b, 0);
    return VENDORS.map((vendor, i) => {
      const share = weights[i] / wSum;
      const commission = scaledEarnings * share * 0.55; // commission portion of earnings
      return {
        id: vendor.id,
        name: vendor.name,
        accent: vendorAccent(i),
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(scaledRevenue)}
          icon={DollarSign}
        />
        <KpiCard
          title="Total Cancelled Flights"
          value={scaledFlights}
          icon={PlaneTakeoff}
        />
        <KpiCard
          title="Total Earnings"
          value={formatCurrency(scaledEarnings)}
          icon={TrendingUp}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Total Airlines"
          value={scaledTotalAirlines}
          icon={Plane}
        />
        <KpiCard
          title="Total Credit Issued"
          value={formatCurrency(stats.totalCreditIssued)}
          icon={CreditCard}
        />
        <KpiCard
          title="Total Wallet Balance"
          value={formatCurrency(totalWalletBalance)}
          icon={Wallet}
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
              <AreaChart data={revenueSeries} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} tickMargin={10} minTickGap={24} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tickCount={5}
                  domain={[0, "auto"]}
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
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#dashboardRevenueFill)"
                  dot={false}
                  activeDot={{ fill: "hsl(var(--primary))", stroke: "hsl(var(--card))", strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
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
                <BarChart data={cancellationSeries} margin={{ top: 12, right: 12, left: 0, bottom: 0 }} barCategoryGap="25%">
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} tickMargin={10} minTickGap={24} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} tickMargin={8} tickCount={5} domain={[0, "auto"]} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.35 }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, "Flights"]}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  />
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

      {/* Row 5 — Vendor performance: one row per vendor, so new vendors just stack */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Vendor Performance — {RANGE_LABEL[kpiRange]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {vendorStats.map((vendor) => (
              <div key={vendor.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: vendor.accent }}
                    />
                    <div>
                      <p className="text-sm font-semibold">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {vendor.shareOfEarnings.toFixed(1)}% of earnings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="min-w-[110px] text-right">
                      <p className="text-xs text-muted-foreground">Total bookings</p>
                      <p className="text-lg font-semibold tabular-nums">
                        {vendor.bookings.toLocaleString()}
                      </p>
                    </div>
                    <div className="min-w-[130px] text-right">
                      <p className="text-xs text-muted-foreground">Commission earned</p>
                      <p className="text-lg font-semibold tabular-nums text-success">
                        {formatCurrency(vendor.commission)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${vendor.shareOfEarnings}%`, backgroundColor: vendor.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 border-t pt-4">
            <p className="text-sm font-medium">
              All vendors ({vendorStats.length})
            </p>
            <div className="flex items-center gap-10">
              <div className="min-w-[110px] text-right">
                <p className="text-xs text-muted-foreground">Total bookings</p>
                <p className="text-lg font-semibold tabular-nums">
                  {vendorStats.reduce((s, v) => s + v.bookings, 0).toLocaleString()}
                </p>
              </div>
              <div className="min-w-[130px] text-right">
                <p className="text-xs text-muted-foreground">Commission earned</p>
                <p className="text-lg font-semibold tabular-nums text-success">
                  {formatCurrency(vendorStats.reduce((s, v) => s + v.commission, 0))}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
