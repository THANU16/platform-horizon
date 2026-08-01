import { Card, CardContent } from "@/components/ui/card";
import { Receipt, HandCoins, AlertCircle, CreditCard, Gauge } from "lucide-react";
import { PlatformFinancialSnapshot } from "@/types";

interface PlatformOverviewSectionProps {
  snapshot: PlatformFinancialSnapshot;
  dateRangeLabel: string;
}

export function PlatformOverviewSection({
  snapshot,
  dateRangeLabel,
}: PlatformOverviewSectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const utilization = snapshot.creditUtilizationPercent;

  const kpiCards = [
    {
      title: "Platform Fees Billed",
      value: formatCurrency(snapshot.totalPlatformFeesBilled),
      subtext: "Fees charged to airlines",
      icon: Receipt,
    },
    {
      title: "Payments Received",
      value: formatCurrency(snapshot.totalPaymentsReceived),
      subtext: "Settled by airlines",
      icon: HandCoins,
      valueClass: "text-success",
    },
    {
      title: "Outstanding Fees",
      value: formatCurrency(snapshot.totalOutstandingFees),
      subtext: "Awaiting settlement",
      icon: AlertCircle,
      valueClass: snapshot.totalOutstandingFees > 0 ? "text-warning" : "",
    },
    {
      title: "Total Credit Issued",
      value: formatCurrency(snapshot.totalCreditIssued),
      subtext: "Max outstanding fees allowed",
      icon: CreditCard,
    },
    {
      title: "Credit Utilization",
      value: `${utilization.toFixed(1)}%`,
      subtext: "Outstanding vs credit limits",
      icon: Gauge,
      trend: utilization >= 80 ? "At Risk" : "Healthy",
      trendClass: utilization >= 80 ? "text-destructive" : "text-success",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="icon-container-sm">
          <Receipt className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-base font-semibold text-foreground">Platform Overview</h2>
        <span className="text-sm text-muted-foreground">({dateRangeLabel})</span>
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
