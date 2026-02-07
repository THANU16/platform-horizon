import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export function RevenueByAirlineSection({ data, showTop = 5 }: RevenueByAirlineSectionProps) {
  const [showAll, setShowAll] = useState(false);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const displayData = showAll ? data : data.slice(0, showTop);
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Revenue by Airline ({showAll ? "All" : `Top ${showTop}`})
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant={!showAll ? "default" : "outline"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setShowAll(false)}
            >
              Top {showTop}
            </Button>
            <Button
              variant={showAll ? "default" : "outline"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setShowAll(true)}
            >
              All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No airlines match the current filters.
          </p>
        ) : (
          displayData.map((airline) => {
            const barWidth = (airline.revenue / maxRevenue) * 100;
            
            return (
              <Tooltip key={airline.airlineId}>
                <TooltipTrigger asChild>
                  <div className="space-y-2 cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-lg transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{airline.airlineName}</span>
                        <Badge variant="secondary" className="text-xs font-mono h-5">
                          {airline.iataCode}
                        </Badge>
                        <Badge variant="outline" className="text-xs h-5">
                          {airline.country}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{formatCurrency(airline.revenue)}</span>
                        <span className="text-xs text-muted-foreground">({airline.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
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
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
