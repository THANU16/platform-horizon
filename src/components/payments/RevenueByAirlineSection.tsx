import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RevenueByAirline } from "@/types";

interface RevenueByAirlineSectionProps {
  data: RevenueByAirline[];
  showTop?: number;
}

export function RevenueByAirlineSection({ data, showTop }: RevenueByAirlineSectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const displayData = showTop ? data.slice(0, showTop) : data;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Revenue by Airline</CardTitle>
        {showTop && data.length > showTop && (
          <Badge variant="outline" className="text-xs">
            Top {showTop} of {data.length}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {displayData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No airlines match the current filters.
          </p>
        ) : (
          displayData.map((airline) => (
            <Tooltip key={airline.airlineId}>
              <TooltipTrigger asChild>
                <div className="space-y-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{airline.airlineName}</span>
                      <Badge variant="secondary" className="text-xs font-mono">
                        {airline.iataCode}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {airline.country}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-sm">
                        {formatCurrency(airline.revenue)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({airline.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <Progress value={airline.percentage} className="h-2" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="p-3">
                <div className="space-y-1 text-sm">
                  <p><strong>Total Bookings:</strong> {airline.totalBookings.toLocaleString()}</p>
                  <p><strong>Country:</strong> {airline.country}</p>
                  <p><strong>Revenue Share:</strong> {airline.percentage.toFixed(1)}%</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))
        )}
      </CardContent>
    </Card>
  );
}
