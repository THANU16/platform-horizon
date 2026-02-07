import { Card, CardContent } from "@/components/ui/card";

interface DetailedAnalysisSummaryProps {
  totalBookings: number;
  totalTopUps: number;
  totalRevenue: number;
}

export function DetailedAnalysisSummary({ 
  totalBookings, 
  totalTopUps, 
  totalRevenue 
}: DetailedAnalysisSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Bookings</p>
          <p className="text-2xl font-bold text-foreground">{totalBookings}</p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Top-ups</p>
          <p className="text-2xl font-bold text-foreground">{totalTopUps}</p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-success">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-success">{formatCurrency(totalRevenue)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
