import { useEffect, useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCancelledFlights } from "@/services/api";
import { CancelledFlight } from "@/types";
import { PlaneTakeoff } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function CancelledFlights() {
  const [flights, setFlights] = useState<CancelledFlight[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadFlights = async () => {
      try {
        const data = await getCancelledFlights();
        setFlights(data);
      } finally {
        setLoading(false);
      }
    };
    loadFlights();
  }, []);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const filteredFlights = useMemo(() => {
    const q = search.toLowerCase();
    return flights.filter((flight) => {
      const matchesSearch =
        !q ||
        flight.flightNumber.toLowerCase().includes(q) ||
        flight.airlineName.toLowerCase().includes(q) ||
        flight.departureAirport.toLowerCase().includes(q) ||
        flight.arrivalAirport.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || flight.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [flights, search, statusFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

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
        ]}
        onClear={handleClearFilters}
      />

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
