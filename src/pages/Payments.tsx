import { useEffect, useState, useMemo, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { LoadingState } from "@/components/ui/Spinner";
import {
  getCountries,
  getAirlines,
  getAirports,
  getFilteredPaymentData,
} from "@/services/api";
import { 
  Airline, 
  Airport,
  PlatformFinancialSnapshot, 
  CreditRiskOverview, 
  RevenueByAirline, 
  RevenueByCountry, 
  AirlineFinancialHealth,
  WalletTransaction,
  PaymentFilters 
} from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformKpiCards } from "@/components/payments/PlatformKpiCards";
import { CreditRiskSection } from "@/components/payments/CreditRiskSection";
import { RevenueByAirlineSection } from "@/components/payments/RevenueByAirlineSection";
import { RevenueByCountrySection } from "@/components/payments/RevenueByCountrySection";
import { AirlineFinancialHealthTable } from "@/components/payments/AirlineFinancialHealthTable";
import { WalletTransactionsTable } from "@/components/payments/WalletTransactionsTable";

export default function Payments() {
  // Data states
  const [snapshot, setSnapshot] = useState<PlatformFinancialSnapshot | null>(null);
  const [creditRisk, setCreditRisk] = useState<CreditRiskOverview | null>(null);
  const [revenueByAirline, setRevenueByAirline] = useState<RevenueByAirline[]>([]);
  const [revenueByCountry, setRevenueByCountry] = useState<RevenueByCountry[]>([]);
  const [airlineHealth, setAirlineHealth] = useState<AirlineFinancialHealth[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  
  // Reference data
  const [countries, setCountries] = useState<string[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Global filter states (draft)
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [airlineFilter, setAirlineFilter] = useState("all");
  const [airportFilter, setAirportFilter] = useState("all");
  const [dateRange, setDateRange] = useState("this_month");

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState<PaymentFilters>({
    search: "",
    country: "all",
    airline: "all",
    airport: "all",
    dateRange: "this_month",
  });

  // Table-specific filters
  const [tableTypeFilter, setTableTypeFilter] = useState("all");
  const [tableCountryFilter, setTableCountryFilter] = useState("all");
  const [tableAirlineFilter, setTableAirlineFilter] = useState("all");

  const fetchPaymentData = useCallback(async (filters: PaymentFilters) => {
    setIsFiltering(true);
    try {
      const data = await getFilteredPaymentData(filters);
      setSnapshot(data.snapshot);
      setCreditRisk(data.creditRisk);
      setRevenueByAirline(data.revenueByAirline);
      setRevenueByCountry(data.revenueByCountry);
      setAirlineHealth(data.airlineHealth);
      setTransactions(data.transactions);
    } finally {
      setIsFiltering(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [countriesData, airlinesData, airportsData] = await Promise.all([
          getCountries(),
          getAirlines(),
          getAirports(),
        ]);
        setCountries(countriesData);
        setAirlines(airlinesData);
        setAirports(airportsData);
        
        // Load initial data with default filters
        await fetchPaymentData({
          country: "all",
          airline: "all",
          airport: "all",
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
      airportFilter !== appliedFilters.airport ||
      dateRange !== appliedFilters.dateRange
    );
  }, [search, countryFilter, airlineFilter, airportFilter, dateRange, appliedFilters]);

  const handleApplyFilters = async () => {
    const newFilters: PaymentFilters = {
      search,
      country: countryFilter,
      airline: airlineFilter,
      airport: airportFilter,
      dateRange: dateRange as PaymentFilters["dateRange"],
    };
    setAppliedFilters(newFilters);
    await fetchPaymentData(newFilters);
  };

  const handleClearFilters = async () => {
    setSearch("");
    setCountryFilter("all");
    setAirlineFilter("all");
    setAirportFilter("all");
    setDateRange("this_month");
    const defaultFilters: PaymentFilters = {
      search: "",
      country: "all",
      airline: "all",
      airport: "all",
      dateRange: "this_month",
    };
    setAppliedFilters(defaultFilters);
    await fetchPaymentData(defaultFilters);
  };

  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.search) count++;
    if (appliedFilters.country !== "all") count++;
    if (appliedFilters.airline !== "all") count++;
    if (appliedFilters.airport !== "all") count++;
    if (appliedFilters.dateRange !== "this_month") count++;
    return count;
  }, [appliedFilters]);

  const handleAirlineClick = (airlineId: string) => {
    // Navigate to airline detail or open modal
    console.log("View airline:", airlineId);
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading financial data..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header title="Payments & Revenue" subtitle="Financial control, revenue analysis, and credit risk management">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="last_7_days">Last 7 Days</SelectItem>
            <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            <SelectItem value="last_90_days">Last 90 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </Header>

      {/* Global Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by airline name, IATA code, or reference..."
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
            name: "Airport",
            value: airportFilter,
            onChange: setAirportFilter,
            placeholder: "All Airports",
            options: [
              { value: "all", label: "All Airports" },
              ...airports.map((a) => ({ value: a.code, label: `${a.code} - ${a.name}` })),
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

      {/* Platform Financial Snapshot KPIs */}
      {snapshot && creditRisk && (
        <PlatformKpiCards snapshot={snapshot} creditRisk={creditRisk} />
      )}

      {/* Revenue Analytics & Credit Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <RevenueByAirlineSection data={revenueByAirline} showTop={5} />
          <RevenueByCountrySection data={revenueByCountry} />
        </div>
        <div>
          {creditRisk && <CreditRiskSection data={creditRisk} />}
        </div>
      </div>

      {/* Airline Financial Health Table */}
      <div className="mb-8">
        <AirlineFinancialHealthTable 
          data={airlineHealth} 
          onAirlineClick={handleAirlineClick}
        />
      </div>

      {/* Transactions & Audit Trail */}
      <WalletTransactionsTable
        transactions={transactions}
        airlines={airlines}
        countries={countries}
        airports={airports}
        typeFilter={tableTypeFilter}
        countryFilter={tableCountryFilter}
        airlineFilter={tableAirlineFilter}
        onTypeFilterChange={setTableTypeFilter}
        onCountryFilterChange={setTableCountryFilter}
        onAirlineFilterChange={setTableAirlineFilter}
      />
    </MainLayout>
  );
}
