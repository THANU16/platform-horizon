import { useEffect, useState, useMemo, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { LoadingState } from "@/components/ui/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
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
  PaymentFilters,
  DateRangeFilter
} from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformOverviewSection } from "@/components/payments/PlatformOverviewSection";
import { PlatformReserveModal } from "@/components/payments/PlatformReserveModal";
import { RevenueByAirlineSection } from "@/components/payments/RevenueByAirlineSection";
import { RevenueByCountrySection } from "@/components/payments/RevenueByCountrySection";
import { CreditRiskCards } from "@/components/payments/CreditRiskCards";
import { DetailedAnalysisSummary } from "@/components/payments/DetailedAnalysisSummary";
import { DetailedAnalysisFilterBar } from "@/components/payments/DetailedAnalysisFilterBar";
import { ExpandableAirlineHealthTable } from "@/components/payments/ExpandableAirlineHealthTable";
import { TransactionsAuditTable } from "@/components/payments/TransactionsAuditTable";

const dateRangeLabels: Record<DateRangeFilter, string> = {
  this_month: "This Month",
  last_month: "Last Month",
  last_7_days: "Last 7 Days",
  last_30_days: "Last 30 Days",
  last_90_days: "Last 90 Days",
  custom: "Custom",
};

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

  // Platform Reserve
  const [platformReserve, setPlatformReserve] = useState(250000);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);

  // Global filter states (draft) - now in header only
  const [globalDateRange, setGlobalDateRange] = useState<DateRangeFilter>("this_month");

  // Applied global filters
  const [appliedGlobalDateRange, setAppliedGlobalDateRange] = useState<DateRangeFilter>("this_month");

  // Detailed Analysis filter states (draft)
  const [detailDateRange, setDetailDateRange] = useState<DateRangeFilter>("this_month");
  const [detailAirlineFilter, setDetailAirlineFilter] = useState("all");
  const [detailAirportFilter, setDetailAirportFilter] = useState("all");

  // Applied Detailed Analysis filters
  const [appliedDetailFilters, setAppliedDetailFilters] = useState<PaymentFilters>({
    search: "",
    country: "all",
    airline: "all",
    airport: "all",
    dateRange: "this_month",
  });

  // Transaction type filter
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");

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

  // Check if detail filters have changes
  const hasDetailFilterChanges = useMemo(() => {
    return (
      detailDateRange !== appliedDetailFilters.dateRange ||
      detailAirlineFilter !== appliedDetailFilters.airline ||
      detailAirportFilter !== appliedDetailFilters.airport
    );
  }, [detailDateRange, detailAirlineFilter, detailAirportFilter, appliedDetailFilters]);

  // Apply detail filters
  const handleApplyDetailFilters = async () => {
    const newFilters: PaymentFilters = {
      search: "",
      country: "all",
      airline: detailAirlineFilter,
      airport: detailAirportFilter,
      dateRange: detailDateRange,
    };
    setAppliedDetailFilters(newFilters);
    await fetchPaymentData(newFilters);
  };

  // Handle global date range change (auto-apply for simplicity)
  const handleGlobalDateRangeChange = async (value: DateRangeFilter) => {
    setGlobalDateRange(value);
    setAppliedGlobalDateRange(value);
    // Sync detail filters if needed
    setDetailDateRange(value);
    const newFilters: PaymentFilters = {
      search: "",
      country: "all",
      airline: detailAirlineFilter,
      airport: detailAirportFilter,
      dateRange: value,
    };
    setAppliedDetailFilters(newFilters);
    await fetchPaymentData(newFilters);
  };

  // Handle platform reserve transaction
  const handleReserveTransaction = (type: "deposit" | "withdraw", amount: number, note: string) => {
    if (type === "deposit") {
      setPlatformReserve(prev => prev + amount);
    } else {
      setPlatformReserve(prev => prev - amount);
    }
    // In real app, this would call API
    console.log(`Reserve ${type}: $${amount} - ${note}`);
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalBookings = airlineHealth.reduce((sum, a) => sum + (a.totalBookingSpend / 150), 0); // Mock calc
    const topUpTransactions = transactions.filter(t => t.type === "top_up");
    const totalRevenue = airlineHealth.reduce((sum, a) => sum + a.platformRevenue, 0);
    return {
      totalBookings: Math.floor(totalBookings),
      totalTopUps: topUpTransactions.length,
      totalRevenue,
    };
  }, [airlineHealth, transactions]);

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading financial data..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header 
        title="Payments & Revenue" 
        subtitle="Financial control, revenue analysis & credit risk management"
      >
        <Select value={globalDateRange} onValueChange={handleGlobalDateRangeChange}>
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
      </Header>

      {/* Loading overlay for filtering */}
      {isFiltering && (
        <div className="fixed inset-0 bg-background/50 z-50 flex items-center justify-center">
          <LoadingState message="Applying filters..." />
        </div>
      )}

      {/* Platform Overview Section - KPI Cards */}
      {snapshot && (
        <div className="mb-8">
          <PlatformOverviewSection
            snapshot={snapshot}
            platformReserve={platformReserve}
            dateRangeLabel={dateRangeLabels[appliedGlobalDateRange]}
            onManageReserve={() => setReserveModalOpen(true)}
          />
        </div>
      )}

      {/* Revenue Analytics - Side by Side Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueByAirlineSection data={revenueByAirline} showTop={5} />
        <RevenueByCountrySection data={revenueByCountry} />
      </div>

      {/* Credit Risk Overview */}
      {creditRisk && (
        <div className="mb-8">
          <CreditRiskCards data={creditRisk} />
        </div>
      )}

      {/* Detailed Analysis Section */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-medium">Detailed Analysis</CardTitle>
            {(appliedDetailFilters.airline !== "all" || appliedDetailFilters.airport !== "all") && (
              <Badge variant="secondary" className="text-xs">Filtered</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Detail Filter Bar - NO SEARCH */}
          <DetailedAnalysisFilterBar
            dateRange={detailDateRange}
            airlineFilter={detailAirlineFilter}
            airportFilter={detailAirportFilter}
            airlines={airlines}
            airports={airports}
            onDateRangeChange={setDetailDateRange}
            onAirlineFilterChange={setDetailAirlineFilter}
            onAirportFilterChange={setDetailAirportFilter}
            onApply={handleApplyDetailFilters}
            hasChanges={hasDetailFilterChanges}
          />

          {/* Summary Cards */}
          <DetailedAnalysisSummary
            totalBookings={summaryStats.totalBookings}
            totalTopUps={summaryStats.totalTopUps}
            totalRevenue={summaryStats.totalRevenue}
          />
        </CardContent>
      </Card>

      {/* Airline Financial Health Table - Expandable */}
      <div className="mb-8">
        <ExpandableAirlineHealthTable
          data={airlineHealth}
          transactions={transactions}
        />
      </div>

      {/* Transactions & Audit Trail */}
      <TransactionsAuditTable
        transactions={transactions}
        typeFilter={transactionTypeFilter}
        onTypeFilterChange={setTransactionTypeFilter}
      />

      {/* Platform Reserve Modal */}
      <PlatformReserveModal
        open={reserveModalOpen}
        onOpenChange={setReserveModalOpen}
        currentReserve={platformReserve}
        onSubmit={handleReserveTransaction}
      />
    </MainLayout>
  );
}
