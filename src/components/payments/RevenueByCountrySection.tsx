import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueByCountry } from "@/types";

interface RevenueByCountrySectionProps {
  data: RevenueByCountry[];
}

export function RevenueByCountrySection({ data }: RevenueByCountrySectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Revenue by Country</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No countries match the current filters.
          </p>
        ) : (
          data.map((country) => {
            const barWidth = (country.revenue / maxRevenue) * 100;
            
            return (
              <div key={country.country} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{country.country}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{formatCurrency(country.revenue)}</span>
                    <span className="text-xs text-muted-foreground">({country.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-success rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
