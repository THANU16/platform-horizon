import { useEffect, useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { KpiCard } from "@/components/ui/KpiCard";
import { LoadingState } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  getPayments,
  getPaymentStats,
  getRevenueByAirline,
  getRevenueByCountry,
  getCountries,
  getAirlines,
} from "@/services/api";
import { Payment, PaymentStats, RevenueByAirline, RevenueByCountry, Airline } from "@/types";
import { DollarSign, Clock, AlertTriangle, Building2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [revenueByAirline, setRevenueByAirline] = useState<RevenueByAirline[]>([]);
  const [revenueByCountry, setRevenueByCountry] = useState<RevenueByCountry[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states (draft)
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [airlineFilter, setAirlineFilter] = useState("all");
  const [dateRange, setDateRange] = useState("this_month");

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    country: "all",
    airline: "all",
    dateRange: "this_month",
  });

  // Table-specific filters
  const [tableStatusFilter, setTableStatusFilter] = useState("all");
  const [tableCountryFilter, setTableCountryFilter] = useState("all");
  const [tableAirlineFilter, setTableAirlineFilter] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [paymentsData, statsData, airlineRevenue, countryRevenue, countriesData, airlinesData] =
          await Promise.all([
            getPayments(),
            getPaymentStats(),
            getRevenueByAirline(),
            getRevenueByCountry(),
            getCountries(),
            getAirlines(),
          ]);
        setPayments(paymentsData);
        setStats(statsData);
        setRevenueByAirline(airlineRevenue);
        setRevenueByCountry(countryRevenue);
        setCountries(countriesData);
        setAirlines(airlinesData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const hasFilterChanges = useMemo(() => {
    return (
      search !== appliedFilters.search ||
      countryFilter !== appliedFilters.country ||
      airlineFilter !== appliedFilters.airline ||
      dateRange !== appliedFilters.dateRange
    );
  }, [search, countryFilter, airlineFilter, dateRange, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      search,
      country: countryFilter,
      airline: airlineFilter,
      dateRange,
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setCountryFilter("all");
    setAirlineFilter("all");
    setDateRange("this_month");
    setAppliedFilters({
      search: "",
      country: "all",
      airline: "all",
      dateRange: "this_month",
    });
  };

  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.search) count++;
    if (appliedFilters.country !== "all") count++;
    if (appliedFilters.airline !== "all") count++;
    if (appliedFilters.dateRange !== "this_month") count++;
    return count;
  }, [appliedFilters]);

  // Filter data based on applied filters
  const filteredRevenueByAirline = useMemo(() => {
    return revenueByAirline.filter((item) => {
      const matchesSearch =
        !appliedFilters.search ||
        item.airlineName.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        item.iataCode.toLowerCase().includes(appliedFilters.search.toLowerCase());
      const matchesCountry =
        appliedFilters.country === "all" || item.country === appliedFilters.country;
      const matchesAirline =
        appliedFilters.airline === "all" || item.airlineId === appliedFilters.airline;
      return matchesSearch && matchesCountry && matchesAirline;
    });
  }, [revenueByAirline, appliedFilters]);

  const filteredRevenueByCountry = useMemo(() => {
    if (appliedFilters.country === "all") return revenueByCountry;
    return revenueByCountry.filter((item) => item.country === appliedFilters.country);
  }, [revenueByCountry, appliedFilters]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // Apply global filters
      const matchesGlobalSearch =
        !appliedFilters.search ||
        payment.airlineName.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        payment.reference.toLowerCase().includes(appliedFilters.search.toLowerCase());
      const matchesGlobalCountry =
        appliedFilters.country === "all" || payment.country === appliedFilters.country;
      const matchesGlobalAirline =
        appliedFilters.airline === "all" || payment.airlineId === appliedFilters.airline;

      // Apply table-specific filters
      const matchesTableStatus =
        tableStatusFilter === "all" || payment.status === tableStatusFilter;
      const matchesTableCountry =
        tableCountryFilter === "all" || payment.country === tableCountryFilter;
      const matchesTableAirline =
        tableAirlineFilter === "all" || payment.airlineId === tableAirlineFilter;

      return (
        matchesGlobalSearch &&
        matchesGlobalCountry &&
        matchesGlobalAirline &&
        matchesTableStatus &&
        matchesTableCountry &&
        matchesTableAirline
      );
    });
  }, [payments, appliedFilters, tableStatusFilter, tableCountryFilter, tableAirlineFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading payments..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header title="Payments & Revenue" subtitle="Platform financial overview and payout management">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </Header>

      {/* Global Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by airline name, IATA code, or payout reference..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            name: "Country",
            value: countryFilter,
            onChange: setCountryFilter,
            placeholder: "All Countries",
            options: [
              { value: "all", label: "All Countries" },
              ...countries.map((c) => ({ value: c, label: c })),
            ],
          },
          {
            name: "Airline",
            value: airlineFilter,
            onChange: setAirlineFilter,
            placeholder: "All Airlines",
            options: [
              { value: "all", label: "All Airlines" },
              ...airlines.map((a) => ({ value: a.id, label: `${a.name} (${a.iataCode})` })),
            ],
          },
        ]}
        showApplyButton
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        hasChanges={hasFilterChanges}
        appliedFiltersCount={appliedFiltersCount}
        helperText={appliedFiltersCount > 0 ? "Showing filtered results" : undefined}
      />

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            title="Total Platform Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={DollarSign}
            trend={{ value: stats.revenueChange, label: "vs last period" }}
          />
          <KpiCard
            title="Pending Payouts"
            value={formatCurrency(stats.pendingPayouts)}
            icon={Clock}
          />
          <KpiCard
            title="Failed Payouts"
            value={stats.failedPayouts}
            icon={AlertTriangle}
          />
          <KpiCard
            title="Active Airlines"
            value={`${stats.activeAirlines} of ${stats.totalOnboarded}`}
            icon={Building2}
          />
        </div>
      )}

      {/* Revenue Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Airline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Revenue by Airline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredRevenueByAirline.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No airlines match the current filters.
              </p>
            ) : (
              filteredRevenueByAirline.map((airline) => (
                <Tooltip key={airline.airlineId}>
                  <TooltipTrigger asChild>
                    <div className="space-y-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{airline.airlineName}</span>
                          <Badge variant="secondary" className="text-xs font-mono">
                            {airline.iataCode}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {airline.country}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-sm">
                            {formatCurrency(airline.revenue)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({airline.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <Progress value={airline.percentage} className="h-2" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="p-3">
                    <div className="space-y-1 text-sm">
                      <p><strong>Total Bookings:</strong> {airline.totalBookings.toLocaleString()}</p>
                      <p><strong>Total Payouts:</strong> {formatCurrency(airline.totalPayouts)}</p>
                      <p><strong>Country:</strong> {airline.country}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))
            )}
          </CardContent>
        </Card>

        {/* Revenue by Country */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Revenue by Country</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredRevenueByCountry.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No countries match the current filters.
              </p>
            ) : (
              filteredRevenueByCountry.map((country) => (
                <div key={country.country} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{country.country}</span>
                      <Badge variant="secondary" className="text-xs">
                        {country.airlinesCount} airline{country.airlinesCount !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-sm">
                        {formatCurrency(country.revenue)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({country.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <Progress value={country.percentage} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payout & Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Payout & Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Select value={tableStatusFilter} onValueChange={setTableStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tableAirlineFilter} onValueChange={setTableAirlineFilter}>
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
            <Select value={tableCountryFilter} onValueChange={setTableCountryFilter}>
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

          {filteredPayments.length === 0 ? (
            <EmptyState
              icon={DollarSign}
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
                      <TableHead>Country</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id} className="table-row-hover">
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{payment.airlineName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {payment.country}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{payment.type}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate">
                          {payment.description}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={payment.status as StatusType} />
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
                {filteredPayments.map((payment) => (
                  <Card key={payment.id} className="animate-fade-in">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{payment.airlineName}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{payment.type}</p>
                        </div>
                        <StatusBadge status={payment.status as StatusType} />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span>{new Date(payment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Country</span>
                          <Badge variant="outline" className="text-xs">
                            {payment.country}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{payment.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
