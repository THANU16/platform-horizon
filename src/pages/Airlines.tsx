import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { LoadingState } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAirlines, updateAirlineStatus } from "@/services/api";
import { Airline } from "@/types";
import { Eye, AlertTriangle, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function Airlines() {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Draft filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Applied filter states
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "all",
  });

  const [suspendDialog, setSuspendDialog] = useState<Airline | null>(null);

  useEffect(() => {
    const loadAirlines = async () => {
      try {
        const data = await getAirlines();
        setAirlines(data);
      } finally {
        setLoading(false);
      }
    };
    loadAirlines();
  }, []);

  const hasFilterChanges = useMemo(() => {
    return search !== appliedFilters.search || statusFilter !== appliedFilters.status;
  }, [search, statusFilter, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      search,
      status: statusFilter,
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setAppliedFilters({
      search: "",
      status: "all",
    });
  };

  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.search) count++;
    if (appliedFilters.status !== "all") count++;
    return count;
  }, [appliedFilters]);

  const filteredAirlines = useMemo(() => {
    return airlines.filter((airline) => {
      const matchesSearch =
        !appliedFilters.search ||
        airline.name.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        airline.iataCode.toLowerCase().includes(appliedFilters.search.toLowerCase());
      const matchesStatus = appliedFilters.status === "all" || airline.status === appliedFilters.status;
      return matchesSearch && matchesStatus;
    });
  }, [airlines, appliedFilters]);

  const handleToggleStatus = async (airline: Airline) => {
    const newStatus = airline.status === "active" ? "disabled" : "active";
    try {
      await updateAirlineStatus(airline.id, newStatus);
      setAirlines((prev) =>
        prev.map((a) => (a.id === airline.id ? { ...a, status: newStatus } : a))
      );
      toast({
        title: `Airline ${newStatus === "active" ? "enabled" : "disabled"}`,
        description: `${airline.name} has been ${newStatus === "active" ? "enabled" : "disabled"}.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update airline status.",
        variant: "destructive",
      });
    }
  };

  const handleSuspend = async () => {
    if (!suspendDialog) return;
    try {
      await updateAirlineStatus(suspendDialog.id, "suspended");
      setAirlines((prev) =>
        prev.map((a) => (a.id === suspendDialog.id ? { ...a, status: "suspended" } : a))
      );
      toast({
        title: "Airline suspended",
        description: `${suspendDialog.name} has been suspended.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to suspend airline.",
        variant: "destructive",
      });
    } finally {
      setSuspendDialog(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const getStripeStatusType = (status: string): StatusType => {
    switch (status) {
      case "connected":
        return "connected";
      case "pending":
        return "pending";
      case "failed":
        return "failed";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading airlines..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header title="Airlines" subtitle="Manage all registered airlines" />

      <FilterBar
        searchPlaceholder="Search airlines..."
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
              { value: "active", label: "Active" },
              { value: "disabled", label: "Disabled" },
              { value: "suspended", label: "Suspended" },
            ],
          },
        ]}
        showApplyButton
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        hasChanges={hasFilterChanges}
        appliedFiltersCount={appliedFiltersCount}
      />

      {filteredAirlines.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="No airlines found"
          description="No airlines match your current filters. Try adjusting your search criteria."
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Airline</TableHead>
                  <TableHead>IATA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Flights</TableHead>
                  <TableHead className="text-right">Passengers</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Stripe</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAirlines.map((airline) => (
                  <TableRow key={airline.id} className="table-row-hover">
                    <TableCell className="font-medium">{airline.name}</TableCell>
                    <TableCell className="font-mono text-sm">{airline.iataCode}</TableCell>
                    <TableCell>
                      <StatusBadge status={airline.status} />
                    </TableCell>
                    <TableCell className="text-right">{airline.cancelledFlights}</TableCell>
                    <TableCell className="text-right">{airline.passengers.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(airline.totalSpend)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(airline.platformRevenue)}</TableCell>
                    <TableCell>
                      <StatusBadge status={getStripeStatusType(airline.stripeStatus)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <ToggleSwitch
                          checked={airline.status === "active"}
                          onCheckedChange={() => handleToggleStatus(airline)}
                          disabled={airline.status === "suspended"}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/airlines/${airline.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSuspendDialog(airline)}
                          disabled={airline.status === "suspended"}
                          className="text-destructive hover:text-destructive"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredAirlines.map((airline) => (
              <Card key={airline.id} className="animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{airline.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{airline.iataCode}</p>
                    </div>
                    <StatusBadge status={airline.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Flights</p>
                      <p className="font-medium">{airline.cancelledFlights}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Passengers</p>
                      <p className="font-medium">{airline.passengers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spend</p>
                      <p className="font-medium">{formatCurrency(airline.totalSpend)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-medium">{formatCurrency(airline.platformRevenue)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Stripe:</span>
                      <StatusBadge status={getStripeStatusType(airline.stripeStatus)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <ToggleSwitch
                        checked={airline.status === "active"}
                        onCheckedChange={() => handleToggleStatus(airline)}
                        disabled={airline.status === "suspended"}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/airlines/${airline.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <AlertDialog open={!!suspendDialog} onOpenChange={() => setSuspendDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Airline?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend {suspendDialog?.name}? This will disable all their
              operations and require manual review to reactivate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspend} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
