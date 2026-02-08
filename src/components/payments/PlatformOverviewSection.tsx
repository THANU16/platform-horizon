import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, CircleDollarSign, CreditCard, TrendingDown, TrendingUp, DollarSign, Settings } from "lucide-react";
import { PlatformFinancialSnapshot } from "@/types";

interface PlatformOverviewSectionProps {
  snapshot: PlatformFinancialSnapshot;
  platformReserve: number;
  dateRangeLabel: string;
  onManageReserve: () => void;
}

export function PlatformOverviewSection({ 
  snapshot, 
  platformReserve,
  dateRangeLabel,
  onManageReserve 
}: PlatformOverviewSectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Net Exposure = Platform Reserve – Total Credit Used
  const netExposure = platformReserve - snapshot.totalCreditUsed;
  const isExposureCovered = netExposure >= 0;

  const kpiCards = [
    {
      title: "Total Top-up Balance",
      value: formatCurrency(snapshot.totalTopUpBalance),
      subtext: "Real money available",
      icon: Wallet,
    },
    {
      title: "Platform Reserve",
      value: formatCurrency(platformReserve),
      subtext: "Admin-deposited funds",
      icon: CircleDollarSign,
    },
    {
      title: "Total Credit Issued",
      value: formatCurrency(snapshot.totalAdminCreditIssued),
      subtext: "Admin-defined limits",
      icon: CreditCard,
    },
    {
      title: "Total Credit Used",
      value: formatCurrency(snapshot.totalCreditUsed),
      subtext: "Negative balances",
      icon: TrendingDown,
      valueClass: snapshot.totalCreditUsed > 0 ? "text-warning" : "",
    },
    {
      title: "Net Exposure",
      value: formatCurrency(Math.abs(netExposure)),
      subtext: isExposureCovered ? "Fully covered" : "Financial risk indicator",
      icon: isExposureCovered ? TrendingUp : TrendingDown,
      trend: isExposureCovered ? "Covered" : "At Risk",
      trendClass: isExposureCovered ? "text-success" : "text-destructive",
    },
    {
      title: "Platform Revenue",
      value: formatCurrency(snapshot.totalPlatformRevenue),
      subtext: "Platform fees only",
      icon: DollarSign,
      trend: `+${snapshot.revenueChangePercent}%`,
      trendClass: "text-success",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="icon-container-sm">
            <CircleDollarSign className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Platform Overview</h2>
          <span className="text-sm text-muted-foreground">({dateRangeLabel})</span>
        </div>
        <Button variant="outline" size="sm" onClick={onManageReserve}>
          <Settings className="w-4 h-4 mr-2" />
          Manage Reserve
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="card-kpi">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium">{card.title}</span>
                  <div className="icon-container-sm">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xl font-bold ${card.valueClass || ""}`}>
                      {card.value}
                    </span>
                    {card.trend && (
                      <span className={`text-xs font-medium ${card.trendClass}`}>
                        {card.trend}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{card.subtext}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
