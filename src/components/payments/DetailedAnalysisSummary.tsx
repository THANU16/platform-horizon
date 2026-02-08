import { Card, CardContent } from "@/components/ui/card";
import { Plane, ArrowUpRight, DollarSign } from "lucide-react";

interface DetailedAnalysisSummaryProps {
  totalBookingAmount: number;
  totalBookingCount: number;
  totalTopUpAmount: number;
  totalTopUpCount: number;
  totalRevenue: number;
}

export function DetailedAnalysisSummary({ 
  totalBookingAmount,
  totalBookingCount,
  totalTopUpAmount,
  totalTopUpCount,
  totalRevenue 
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
            <p className="text-xs text-muted-foreground">Total Bookings</p>
            <Plane className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalBookingAmount)}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatNumber(totalBookingCount)} bookings</p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-success">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-muted-foreground">Total Top-ups</p>
            <ArrowUpRight className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">{formatCurrency(totalTopUpAmount)}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatNumber(totalTopUpCount)} transactions</p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-info">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <DollarSign className="w-4 h-4 text-info" />
          </div>
          <p className="text-2xl font-bold text-info">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">Platform fees</p>
        </CardContent>
      </Card>
    </div>
  );
}
