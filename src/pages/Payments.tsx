import { useEffect, useState, useMemo, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { LoadingState } from "@/components/ui/Spinner";
import {
  getCountries,
  getAirlines,
  getFilteredPaymentData,
} from "@/services/api";
import { Payment, PaymentStats, RevenueByAirline, RevenueByCountry, Airline, AllowanceOverview, PaymentFilters } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentsKpiCards } from "@/components/payments/PaymentsKpiCards";
import { RevenueByAirlineSection } from "@/components/payments/RevenueByAirlineSection";
import { RevenueByCountrySection } from "@/components/payments/RevenueByCountrySection";
import { PayoutHistoryTable } from "@/components/payments/PayoutHistoryTable";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [allowance, setAllowance] = useState<AllowanceOverview | null>(null);
  const [revenueByAirline, setRevenueByAirline] = useState<RevenueByAirline[]>([]);
  const [revenueByCountry, setRevenueByCountry] = useState<RevenueByCountry[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

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

  const fetchPaymentData = useCallback(async (filters: PaymentFilters) => {
    setIsFiltering(true);
    try {
      const data = await getFilteredPaymentData(filters);
      setStats(data.stats);
      setAllowance(data.allowance);
      setRevenueByAirline(data.revenueByAirline);
      setRevenueByCountry(data.revenueByCountry);
      setPayments(data.payments);
    } finally {
      setIsFiltering(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [countriesData, airlinesData] = await Promise.all([
          getCountries(),
          getAirlines(),
        ]);
        setCountries(countriesData);
        setAirlines(airlinesData);
        
        // Load initial data with default filters
        await fetchPaymentData({
          country: "all",
          airline: "all",
          search: "",
          dateRange: "this_month",
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchPaymentData]);

  const hasFilterChanges = useMemo(() => {
    return (
      search !== appliedFilters.search ||
      countryFilter !== appliedFilters.country ||
      airlineFilter !== appliedFilters.airline ||
      dateRange !== appliedFilters.dateRange
    );
  }, [search, countryFilter, airlineFilter, dateRange, appliedFilters]);

  const handleApplyFilters = async () => {
    const newFilters = {
      search,
      country: countryFilter,
      airline: airlineFilter,
      dateRange,
    };
    setAppliedFilters(newFilters);
    await fetchPaymentData(newFilters as PaymentFilters);
  };

  const handleClearFilters = async () => {
    setSearch("");
    setCountryFilter("all");
    setAirlineFilter("all");
    setDateRange("this_month");
    const defaultFilters = {
      search: "",
      country: "all",
      airline: "all",
      dateRange: "this_month",
    };
    setAppliedFilters(defaultFilters);
    await fetchPaymentData(defaultFilters as PaymentFilters);
  };

  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.search) count++;
    if (appliedFilters.country !== "all") count++;
    if (appliedFilters.airline !== "all") count++;
    if (appliedFilters.dateRange !== "this_month") count++;
    return count;
  }, [appliedFilters]);

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

      {/* Loading overlay for filtering */}
      {isFiltering && (
        <div className="fixed inset-0 bg-background/50 z-50 flex items-center justify-center">
          <LoadingState message="Applying filters..." />
        </div>
      )}

      {/* KPI Cards with Allowance */}
      {stats && allowance && (
        <PaymentsKpiCards stats={stats} allowance={allowance} />
      )}

      {/* Revenue Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueByAirlineSection data={revenueByAirline} />
        <RevenueByCountrySection data={revenueByCountry} />
      </div>

      {/* Payout & Transaction History */}
      <PayoutHistoryTable
        payments={payments}
        airlines={airlines}
        countries={countries}
        tableStatusFilter={tableStatusFilter}
        tableCountryFilter={tableCountryFilter}
        tableAirlineFilter={tableAirlineFilter}
        onStatusFilterChange={setTableStatusFilter}
        onCountryFilterChange={setTableCountryFilter}
        onAirlineFilterChange={setTableAirlineFilter}
      />
    </MainLayout>
  );
}
