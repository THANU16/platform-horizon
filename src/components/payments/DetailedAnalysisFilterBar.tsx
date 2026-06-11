import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plane, MapPin, Globe, X } from "lucide-react";
import { Airline, Airport } from "@/types";

interface DetailedAnalysisFilterBarProps {
  startDate: string;
  endDate: string;
  airlineFilter: string;
  airportFilter: string;
  countryFilter: string;
  airlines: Airline[];
  airports: Airport[];
  countries: string[];
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onAirlineFilterChange: (value: string) => void;
  onAirportFilterChange: (value: string) => void;
  onCountryFilterChange: (value: string) => void;
  onReset: () => void;
}

export function DetailedAnalysisFilterBar({
  startDate,
  endDate,
  airlineFilter,
  airportFilter,
  countryFilter,
  airlines,
  airports,
  countries,
  onStartDateChange,
  onEndDateChange,
  onAirlineFilterChange,
  onAirportFilterChange,
  onCountryFilterChange,
  onReset,
}: DetailedAnalysisFilterBarProps) {
  const hasActiveFilters =
    airlineFilter !== "all" ||
    airportFilter !== "all" ||
    countryFilter !== "all" ||
    !!startDate ||
    !!endDate;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Start date</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="h-10 w-[150px]"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">End date</Label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="h-10 w-[150px]"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Airline</Label>
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
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Airport</Label>
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
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Country</Label>
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
      </div>

      <div className="flex-1" />

      {hasActiveFilters && (
        <Button variant="ghost" onClick={onReset} size="sm">
          <X className="w-4 h-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}
