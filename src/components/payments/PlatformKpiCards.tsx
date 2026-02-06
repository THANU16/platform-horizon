import { KpiCard } from "@/components/ui/KpiCard";
import { DollarSign, Wallet, CreditCard, TrendingDown, Building2 } from "lucide-react";
import { PlatformFinancialSnapshot, CreditRiskOverview } from "@/types";

interface PlatformKpiCardsProps {
  snapshot: PlatformFinancialSnapshot;
  creditRisk: CreditRiskOverview;
}

export function PlatformKpiCards({ snapshot, creditRisk }: PlatformKpiCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <KpiCard
        title="Total Top-up Balance"
        value={formatCurrency(snapshot.totalTopUpBalance)}
        icon={Wallet}
        subtext="Real money available"
      />
      <KpiCard
        title="Admin Credit Issued"
        value={formatCurrency(snapshot.totalAdminCreditIssued)}
        icon={CreditCard}
        subtext={`${creditRisk.airlinesUsingCredit} airlines using credit`}
      />
      <KpiCard
        title="Credit Used"
        value={formatCurrency(snapshot.totalCreditUsed)}
        icon={TrendingDown}
        subtext={`${creditRisk.creditUtilizationPercent.toFixed(0)}% utilization`}
      />
      <KpiCard
        title="Net Exposure"
        value={formatCurrency(Math.abs(snapshot.netPlatformExposure))}
        icon={TrendingDown}
        subtext={snapshot.netPlatformExposure < 0 ? "Platform at risk" : "Healthy position"}
        trend={snapshot.netPlatformExposure >= 0 ? { value: 0, label: "" } : undefined}
      />
      <KpiCard
        title="Platform Revenue"
        value={formatCurrency(snapshot.totalPlatformRevenue)}
        icon={DollarSign}
        trend={{ value: snapshot.revenueChangePercent, label: "vs last period" }}
      />
    </div>
  );
}
