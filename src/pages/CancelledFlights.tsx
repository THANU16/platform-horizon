import { useEffect, useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { KpiCard } from "@/components/ui/KpiCard";
import { getCancelledFlights, getAirlines } from "@/services/api";
import { Airline, CancelledFlight } from "@/types";
import { PlaneTakeoff, Users, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PLATFORM_FEE_RATE = 0.05;

export default function CancelledFlights() {
  const [flights, setFlights] = useState<CancelledFlight[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [airlineFilter, setAirlineFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [f, a] = await Promise.all([getCancelledFlights(), getAirlines()]);
        setFlights(f);
        setAirlines(a);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setAirlineFilter("all");
    setStartDate("");
    setEndDate("");
  };

  const filteredFlights = useMemo(() => {
    const q = search.toLowerCase();
    const startTs = startDate ? new Date(startDate).getTime() : null;
    const endTs = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1 : null;
    return flights.filter((flight) => {
      const matchesSearch =
        !q ||
        flight.flightNumber.toLowerCase().includes(q) ||
        flight.airlineName.toLowerCase().includes(q) ||
        flight.departureAirport.toLowerCase().includes(q) ||
        flight.arrivalAirport.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || flight.status === statusFilter;
      const matchesAirline = airlineFilter === "all" || flight.airlineId === airlineFilter;
      const ts = new Date(flight.scheduledDate).getTime();
      const matchesStart = startTs === null || ts >= startTs;
      const matchesEnd = endTs === null || ts <= endTs;
      return matchesSearch && matchesStatus && matchesAirline && matchesStart && matchesEnd;
    });
  }, [flights, search, statusFilter, airlineFilter, startDate, endDate]);

  const stats = useMemo(() => {
    const totalPassengers = filteredFlights.reduce((s, f) => s + f.passengers, 0);
    const totalRevenue = filteredFlights.reduce((s, f) => s + f.totalCost * PLATFORM_FEE_RATE, 0);
    return {
      totalCancellations: filteredFlights.length,
      totalPassengers,
      totalRevenue,
    };
  }, [filteredFlights]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading cancelled flights..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Cancelled Flights"
        subtitle="Read-only oversight of all cancelled flights across airlines"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Total Cancellations"
          value={stats.totalCancellations}
          icon={PlaneTakeoff}
          subtext="Matching current filters"
        />
        <KpiCard
          title="Total Passengers"
          value={stats.totalPassengers.toLocaleString()}
          icon={Users}
          subtext="Across cancelled flights"
        />
        <KpiCard
          title="Platform Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          subtext="5% of total cost"
        />
      </div>

      <FilterBar
        searchPlaceholder="Search flights, airlines, airports..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            name: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            placeholder: "All Status",
            options: [
              { value: "all", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "completed", label: "Completed" },
              { value: "failed", label: "Failed" },
            ],
          },
          {
            name: "Airline",
            value: airlineFilter,
            onChange: setAirlineFilter,
            placeholder: "All Airlines",
            options: [
              { value: "all", label: "All Airlines" },
              ...airlines.map((a) => ({ value: a.id, label: `${a.name} (${a.iataCode})` })),
            ],
          },
        ]}
        onClear={handleClearFilters}
      >
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Start date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 w-[150px]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">End date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 w-[150px]"
            />
          </div>
        </div>
      </FilterBar>

      {filteredFlights.length === 0 ? (
        <EmptyState
          icon={PlaneTakeoff}
          title="No cancelled flights found"
          description="No cancelled flights match your current filters."
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Flight</TableHead>
                  <TableHead>Airline</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Passengers</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlights.map((flight) => (
                  <TableRow key={flight.id} className="table-row-hover">
                    <TableCell className="font-mono font-medium">{flight.flightNumber}</TableCell>
                    <TableCell>{flight.airlineName}</TableCell>
                    <TableCell>
                      <span className="font-mono">{flight.departureAirport}</span>
                      <span className="text-muted-foreground mx-1">→</span>
                      <span className="font-mono">{flight.arrivalAirport}</span>
                    </TableCell>
                    <TableCell>{new Date(flight.scheduledDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{flight.passengers}</TableCell>
                    <TableCell className="text-right">{formatCurrency(flight.totalCost)}</TableCell>
                    <TableCell className="text-right text-success">
                      {formatCurrency(flight.totalCost * PLATFORM_FEE_RATE)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={flight.status as StatusType} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredFlights.map((flight) => (
              <Card key={flight.id} className="animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-mono font-medium">{flight.flightNumber}</h3>
                      <p className="text-sm text-muted-foreground">{flight.airlineName}</p>
                    </div>
                    <StatusBadge status={flight.status as StatusType} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Route</p>
                      <p className="font-mono font-medium">
                        {flight.departureAirport} → {flight.arrivalAirport}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(flight.scheduledDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Passengers</p>
                      <p className="font-medium">{flight.passengers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cost</p>
                      <p className="font-medium">{formatCurrency(flight.totalCost)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-medium text-success">
                        {formatCurrency(flight.totalCost * PLATFORM_FEE_RATE)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </MainLayout>
  );
}
