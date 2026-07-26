import { Card, CardContent } from "@/components/ui/card";
import { Receipt, CheckCircle2, AlertCircle } from "lucide-react";

interface DetailedAnalysisSummaryProps {
  totalServiceFees: number;
  totalFeeCount: number;
  totalPaymentsReceived: number;
  totalPaymentCount: number;
  totalOutstanding: number;
}

export function DetailedAnalysisSummary({
  totalServiceFees,
  totalFeeCount,
  totalPaymentsReceived,
  totalPaymentCount,
  totalOutstanding,
}: DetailedAnalysisSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-muted-foreground">Service Fees Billed</p>
            <Receipt className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalServiceFees)}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatNumber(totalFeeCount)} fee charges</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-success">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-muted-foreground">Payments Received</p>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">{formatCurrency(totalPaymentsReceived)}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatNumber(totalPaymentCount)} payments</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-warning">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-muted-foreground">Outstanding Fees</p>
            <AlertCircle className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-bold text-warning">{formatCurrency(totalOutstanding)}</p>
          <p className="text-xs text-muted-foreground mt-1">Unsettled service fees</p>
        </CardContent>
      </Card>
    </div>
  );
}
