import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreditRiskOverview } from "@/types";
import { AlertTriangle, Users, CreditCard } from "lucide-react";

interface CreditRiskSectionProps {
  data: CreditRiskOverview;
}

export function CreditRiskSection({ data }: CreditRiskSectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const getUtilizationColor = (percent: number) => {
    if (percent < 50) return "bg-success";
    if (percent < 80) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Credit Risk Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Credit Utilization Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Credit Utilization</span>
            <span className="font-semibold">{data.creditUtilizationPercent.toFixed(1)}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={data.creditUtilizationPercent} 
              className="h-3"
            />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getUtilizationColor(data.creditUtilizationPercent)}`}
              style={{ width: `${Math.min(data.creditUtilizationPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs">Total Credit Allowed</span>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(data.totalCreditAllowed)}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs">Credit Used</span>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(data.totalCreditUsed)}</p>
          </div>
        </div>

        {/* Airlines Using Credit */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Airlines Using Credit</span>
          </div>
          <div className="text-right">
            <span className="font-semibold">{data.airlinesUsingCredit}</span>
            <span className="text-muted-foreground text-sm"> / {data.totalAirlines}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
