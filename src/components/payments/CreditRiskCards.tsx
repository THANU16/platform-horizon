import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreditRiskOverview } from "@/types";
import { AlertTriangle } from "lucide-react";

interface CreditRiskCardsProps {
  data: CreditRiskOverview;
}

export function CreditRiskCards({ data }: CreditRiskCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getUtilizationColor = (percent: number) => {
    if (percent < 50) return "bg-success";
    if (percent < 80) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Credit Risk Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Credit Allowed */}
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{formatCurrency(data.totalCreditAllowed)}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Credit Allowed</p>
          </div>

          {/* Outstanding Service Fees */}
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-warning">{formatCurrency(data.totalOutstandingFees)}</p>
            <p className="text-xs text-muted-foreground mt-1">Outstanding Service Fees</p>
          </div>

          {/* Credit Utilization */}
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{data.creditUtilizationPercent.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1 mb-2">Credit Utilization</p>
            <div className="relative h-2">
              <Progress value={data.creditUtilizationPercent} className="h-2" />
              <div 
                className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getUtilizationColor(data.creditUtilizationPercent)}`}
                style={{ width: `${Math.min(data.creditUtilizationPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Airlines With Outstanding Fees */}
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{data.airlinesWithOutstandingFees}</p>
            <p className="text-xs text-muted-foreground mt-1">Airlines With Unpaid Fees</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
