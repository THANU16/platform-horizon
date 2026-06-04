import { useEffect, useState, useMemo, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { LoadingState } from "@/components/ui/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import {
  getCountries,
  getAirlines,
  getAirports,
  getFilteredPaymentData,
  getPlatformTreasurySummary,
  getPlatformReserveTransactions,
  addPlatformReserveTransaction,
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
  DateRangeFilter,
  PaymentsTabType,
  PlatformTreasurySummary,
  PlatformReserveTransaction,
} from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentsTabNav } from "@/components/payments/PaymentsTabNav";
import { PlatformOverviewSection } from "@/components/payments/PlatformOverviewSection";
import { PlatformReserveModal } from "@/components/payments/PlatformReserveModal";
import { RevenueByAirlineSection } from "@/components/payments/RevenueByAirlineSection";
import { RevenueByCountrySection } from "@/components/payments/RevenueByCountrySection";
import { CreditRiskCards } from "@/components/payments/CreditRiskCards";
import { DetailedAnalysisSummary } from "@/components/payments/DetailedAnalysisSummary";
import { DetailedAnalysisFilterBar } from "@/components/payments/DetailedAnalysisFilterBar";
import { ExpandableAirlineHealthTable } from "@/components/payments/ExpandableAirlineHealthTable";
import { TransactionsAuditTable } from "@/components/payments/TransactionsAuditTable";
import { PlatformTreasuryTab } from "@/components/payments/PlatformTreasuryTab";

const dateRangeLabels: Record<DateRangeFilter, string> = {
  this_month: "This Month",
  last_month: "Last Month",
  last_7_days: "Last 7 Days",
  last_30_days: "Last 30 Days",
  last_90_days: "Last 90 Days",
  custom: "Custom",
};

export default function Payments() {
  // Tab state
  const [activeTab, setActiveTab] = useState<PaymentsTabType>("overview");

  // Data states
  const [snapshot, setSnapshot] = useState<PlatformFinancialSnapshot | null>(null);
  const [creditRisk, setCreditRisk] = useState<CreditRiskOverview | null>(null);
  const [revenueByAirline, setRevenueByAirline] = useState<RevenueByAirline[]>([]);
  const [revenueByCountry, setRevenueByCountry] = useState<RevenueByCountry[]>([]);
  const [airlineHealth, setAirlineHealth] = useState<AirlineFinancialHealth[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  
  // Treasury data
  const [treasurySummary, setTreasurySummary] = useState<PlatformTreasurySummary | null>(null);
  const [reserveTransactions, setReserveTransactions] = useState<PlatformReserveTransaction[]>([]);
  
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

  // Global filter (header)
  const [globalDateRange, setGlobalDateRange] = useState<DateRangeFilter>("this_month");
  const [appliedGlobalDateRange, setAppliedGlobalDateRange] = useState<DateRangeFilter>("this_month");

  // Detailed Analysis filters (auto-apply)
  const [detailStartDate, setDetailStartDate] = useState("");
  const [detailEndDate, setDetailEndDate] = useState("");
  const [detailAirlineFilter, setDetailAirlineFilter] = useState("all");
  const [detailAirportFilter, setDetailAirportFilter] = useState("all");
  const [detailCountryFilter, setDetailCountryFilter] = useState("all");

  // Treasury date range filter
  const [treasuryDateRange, setTreasuryDateRange] = useState<DateRangeFilter>("this_month");

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

  const fetchTreasuryData = useCallback(async () => {
    const [summary, transactions] = await Promise.all([
      getPlatformTreasurySummary(),
      getPlatformReserveTransactions(treasuryDateRange),
    ]);
    setTreasurySummary(summary);
    setReserveTransactions(transactions);
    setPlatformReserve(summary.currentBalance);
  }, [treasuryDateRange]);

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
        await Promise.all([
          fetchPaymentData({
            country: "all",
            airline: "all",
            airport: "all",
            search: "",
            dateRange: "this_month",
          }),
          fetchTreasuryData(),
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchPaymentData, fetchTreasuryData]);

  // Auto-apply detail filters (date range here only affects client filtering of transactions)
  const applyDetailFilters = useCallback(
    (overrides?: Partial<{ airline: string; airport: string; country: string }>) => {
      const newFilters: PaymentFilters = {
        search: "",
        country: overrides?.country ?? detailCountryFilter,
        airline: overrides?.airline ?? detailAirlineFilter,
        airport: overrides?.airport ?? detailAirportFilter,
        dateRange: "this_month",
      };
      void fetchPaymentData(newFilters);
    },
    [detailAirlineFilter, detailAirportFilter, detailCountryFilter, fetchPaymentData]
  );

  const handleDetailAirlineChange = (value: string) => {
    setDetailAirlineFilter(value);
    applyDetailFilters({ airline: value });
  };
  const handleDetailAirportChange = (value: string) => {
    setDetailAirportFilter(value);
    applyDetailFilters({ airport: value });
  };
  const handleDetailCountryChange = (value: string) => {
    setDetailCountryFilter(value);
    applyDetailFilters({ country: value });
  };

  const handleResetDetailFilters = () => {
    setDetailStartDate("");
    setDetailEndDate("");
    setDetailAirlineFilter("all");
    setDetailAirportFilter("all");
    setDetailCountryFilter("all");
    void fetchPaymentData({
      search: "",
      country: "all",
      airline: "all",
      airport: "all",
      dateRange: "this_month",
    });
  };


  // Handle global date range change (auto-apply)
  const handleGlobalDateRangeChange = async (value: DateRangeFilter) => {
    setGlobalDateRange(value);
    setAppliedGlobalDateRange(value);
    // detail date filters are independent client-side; clear them when changing global preset
    setDetailStartDate("");
    setDetailEndDate("");
    await fetchPaymentData({
      search: "",
      country: detailCountryFilter,
      airline: detailAirlineFilter,
      airport: detailAirportFilter,
      dateRange: value,
    });
  };

  // Handle platform reserve transaction
  const handleReserveTransaction = async (type: "deposit" | "withdraw", amount: number, note: string) => {
    const txType = type === "deposit" ? "PLATFORM_RESERVE_DEPOSIT" : "PLATFORM_RESERVE_WITHDRAWAL";
    await addPlatformReserveTransaction(txType, amount, note);
    await fetchTreasuryData();
  };

  // Date-filter transactions for detailed analysis (client-side)
  const detailedTransactions = useMemo(() => {
    const s = detailStartDate ? new Date(detailStartDate).getTime() : null;
    const e = detailEndDate ? new Date(detailEndDate).getTime() + 24 * 60 * 60 * 1000 - 1 : null;
    return transactions.filter((t) => {
      const ts = new Date(t.date).getTime();
      if (s !== null && ts < s) return false;
      if (e !== null && ts > e) return false;
      return true;
    });
  }, [transactions, detailStartDate, detailEndDate]);

  // Calculate summary stats for detailed analysis
  const summaryStats = useMemo(() => {
    const bookingTransactions = detailedTransactions.filter(t => t.type === "booking_charge");
    const topUpTransactions = detailedTransactions.filter(t => t.type === "top_up");
    const totalBookingAmount = Math.abs(bookingTransactions.reduce((sum, t) => sum + t.amount, 0));
    const totalTopUpAmount = topUpTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalRevenue = airlineHealth.reduce((sum, a) => sum + a.platformRevenue, 0);

    return {
      totalBookingAmount,
      totalBookingCount: bookingTransactions.length,
      totalTopUpAmount,
      totalTopUpCount: topUpTransactions.length,
      totalRevenue,
    };
  }, [airlineHealth, detailedTransactions]);

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

      {/* Fixed Tab Navigation */}
      <div className="mb-6">
        <PaymentsTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Loading overlay for filtering */}
      {isFiltering && (
        <div className="fixed inset-0 bg-background/50 z-50 flex items-center justify-center">
          <LoadingState message="Applying filters..." />
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Platform Overview Section - KPI Cards */}
          {snapshot && (
            <PlatformOverviewSection
              snapshot={snapshot}
              platformReserve={platformReserve}
              dateRangeLabel={dateRangeLabels[appliedGlobalDateRange]}
              onManageReserve={() => setReserveModalOpen(true)}
            />
          )}

          {/* Revenue Analytics - Side by Side Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueByAirlineSection data={revenueByAirline} showTop={5} />
            <RevenueByCountrySection data={revenueByCountry} />
          </div>

          {/* Credit Risk Overview */}
          {creditRisk && <CreditRiskCards data={creditRisk} />}
        </div>
      )}

      {activeTab === "detailed" && (
        <div className="space-y-6">
          {/* Detailed Analysis Section */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <CardTitle className="text-base font-medium">Detailed Analysis</CardTitle>
                {(detailAirlineFilter !== "all" ||
                  detailAirportFilter !== "all" ||
                  detailCountryFilter !== "all") && (
                  <Badge variant="secondary" className="text-xs">Filtered</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Detail Filter Bar */}
              <DetailedAnalysisFilterBar
                startDate={detailStartDate}
                endDate={detailEndDate}
                airlineFilter={detailAirlineFilter}
                airportFilter={detailAirportFilter}
                countryFilter={detailCountryFilter}
                airlines={airlines}
                airports={airports}
                countries={countries}
                onStartDateChange={setDetailStartDate}
                onEndDateChange={setDetailEndDate}
                onAirlineFilterChange={handleDetailAirlineChange}
                onAirportFilterChange={handleDetailAirportChange}
                onCountryFilterChange={handleDetailCountryChange}
                onReset={handleResetDetailFilters}
              />

              {/* Summary Cards */}
              <DetailedAnalysisSummary
                totalBookingAmount={summaryStats.totalBookingAmount}
                totalBookingCount={summaryStats.totalBookingCount}
                totalTopUpAmount={summaryStats.totalTopUpAmount}
                totalTopUpCount={summaryStats.totalTopUpCount}
                totalRevenue={summaryStats.totalRevenue}
              />
            </CardContent>
          </Card>

          {/* Airline Financial Health Table - Expandable */}
          <ExpandableAirlineHealthTable
            data={airlineHealth}
            transactions={transactions}
          />

          {/* Transactions & Audit Trail */}
          <TransactionsAuditTable
            transactions={transactions}
            typeFilter={transactionTypeFilter}
            onTypeFilterChange={setTransactionTypeFilter}
          />
        </div>
      )}

      {activeTab === "treasury" && treasurySummary && (
        <PlatformTreasuryTab
          treasurySummary={treasurySummary}
          reserveTransactions={reserveTransactions}
          dateRange={treasuryDateRange}
          onDateRangeChange={setTreasuryDateRange}
          onManageReserve={() => setReserveModalOpen(true)}
        />
      )}

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
