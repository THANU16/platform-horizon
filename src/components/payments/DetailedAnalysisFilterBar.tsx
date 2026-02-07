import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plane, MapPin } from "lucide-react";
import { Airline, Airport, DateRangeFilter } from "@/types";

interface DetailedAnalysisFilterBarProps {
  dateRange: DateRangeFilter;
  airlineFilter: string;
  airportFilter: string;
  airlines: Airline[];
  airports: Airport[];
  onDateRangeChange: (value: DateRangeFilter) => void;
  onAirlineFilterChange: (value: string) => void;
  onAirportFilterChange: (value: string) => void;
  onApply: () => void;
  hasChanges: boolean;
}

const dateRangeOptions: { value: DateRangeFilter; label: string }[] = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "last_90_days", label: "Last 90 Days" },
];

export function DetailedAnalysisFilterBar({
  dateRange,
  airlineFilter,
  airportFilter,
  airlines,
  airports,
  onDateRangeChange,
  onAirlineFilterChange,
  onAirportFilterChange,
  onApply,
  hasChanges,
}: DetailedAnalysisFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Range Filter */}
      <Select value={dateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-[140px]">
          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Airline Filter */}
      <Select value={airlineFilter} onValueChange={onAirlineFilterChange}>
        <SelectTrigger className="w-[160px]">
          <Plane className="w-4 h-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="All Airlines" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Airlines</SelectItem>
          {airlines.map((airline) => (
            <SelectItem key={airline.id} value={airline.id}>
              {airline.name} ({airline.iataCode})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Airport Filter */}
      <Select value={airportFilter} onValueChange={onAirportFilterChange}>
        <SelectTrigger className="w-[150px]">
          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="All Airports" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Airports</SelectItem>
          {airports.map((airport) => (
            <SelectItem key={airport.code} value={airport.code}>
              {airport.code} - {airport.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Apply Button */}
      <Button 
        onClick={onApply}
        disabled={!hasChanges}
        size="sm"
      >
        Apply
      </Button>
    </div>
  );
}
