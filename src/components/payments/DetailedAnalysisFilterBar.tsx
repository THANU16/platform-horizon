import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plane, MapPin, Globe, X } from "lucide-react";
import { Airline, Airport, DateRangeFilter } from "@/types";

interface DetailedAnalysisFilterBarProps {
  dateRange: DateRangeFilter;
  airlineFilter: string;
  airportFilter: string;
  countryFilter: string;
  airlines: Airline[];
  airports: Airport[];
  countries: string[];
  onDateRangeChange: (value: DateRangeFilter) => void;
  onAirlineFilterChange: (value: string) => void;
  onAirportFilterChange: (value: string) => void;
  onCountryFilterChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
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
  countryFilter,
  airlines,
  airports,
  countries,
  onDateRangeChange,
  onAirlineFilterChange,
  onAirportFilterChange,
  onCountryFilterChange,
  onApply,
  onReset,
  hasChanges,
}: DetailedAnalysisFilterBarProps) {
  const hasActiveFilters = 
    airlineFilter !== "all" || 
    airportFilter !== "all" || 
    countryFilter !== "all" ||
    dateRange !== "this_month";

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

      {/* Country Filter */}
      <Select value={countryFilter} onValueChange={onCountryFilterChange}>
        <SelectTrigger className="w-[150px]">
          <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="All Countries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button 
          variant="ghost"
          onClick={onReset}
          size="sm"
        >
          <X className="w-4 h-4 mr-1" />
          Reset
        </Button>
      )}

      {/* Apply Button */}
      <Button 
        onClick={onApply}
        disabled={!hasChanges}
        size="sm"
      >
        Apply Filters
      </Button>
    </div>
  );
}
