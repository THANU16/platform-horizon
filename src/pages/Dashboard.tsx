import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { LoadingState } from "@/components/ui/Spinner";
import { getDashboardStats } from "@/services/api";
import { DashboardStats } from "@/types";
import { Plane, Building2, PlaneTakeoff, DollarSign, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("this_month");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

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

  const adoptionPercentage = Math.round((stats.activeAirlines / stats.totalAirlines) * 100);

  return (
    <MainLayout>
      <Header title="Dashboard" subtitle="Platform health and operational overview">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_3_months">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </Header>

      {/* KPI Cards - 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Total Airlines"
          value={stats.totalAirlines}
          icon={Plane}
          trend={{ value: stats.airlineGrowthPercent, label: "vs last month" }}
          subtext="Platform growth"
        />
        <KpiCard
          title="Active Airlines"
          value={stats.activeAirlines}
          icon={Building2}
          trend={{ value: 0, label: `${adoptionPercentage}% of onboarded` }}
          subtext="Adoption & retention"
        />
        <KpiCard
          title="Cancelled Flights"
          value={stats.cancelledFlightsThisMonth}
          icon={PlaneTakeoff}
          trend={{ value: stats.flightChangePercent, label: "vs last month" }}
          subtext="This month"
        />
        <KpiCard
          title="Platform Revenue"
          value={formatCurrency(stats.platformRevenue)}
          icon={DollarSign}
          trend={{ value: stats.revenueChangePercent, label: "vs last month" }}
          subtext="Platform fees only"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base font-medium">Monthly Cancelled Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyCancellations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, "Flights"]}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base font-medium">Monthly Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
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
      </div>

      {/* Performance Indicators Strip */}
      <Card className="animate-fade-in">
        <CardContent className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Revenue to Spend Ratio
                </p>
                <p className="text-lg font-semibold">
                  {(stats.revenueToSpendRatio * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Avg Revenue per Airline
                </p>
                <p className="text-lg font-semibold">{formatCurrency(stats.avgRevenuePerAirline)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Top Airline (Revenue)
                </p>
                <p className="text-lg font-semibold truncate">{stats.topAirlineByRevenue}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
