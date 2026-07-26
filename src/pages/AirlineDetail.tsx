import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/Spinner";
import { getAirlineById, getCountries, updateAirline } from "@/services/api";
import { Airline } from "@/types";
import { ArrowLeft, AlertTriangle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AirlineDetailsForm,
  AirlineDetailsFormValues,
  emptyAirlineDetails,
} from "@/components/forms/AirlineDetailsForm";
import { useToast } from "@/hooks/use-toast";

export default function AirlineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [airline, setAirline] = useState<Airline | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<AirlineDetailsFormValues>(emptyAirlineDetails);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const [a, c] = await Promise.all([getAirlineById(id), getCountries()]);
        setAirline(a || null);
        setCountries(c);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

  const openEdit = () => {
    if (!airline) return;
    setForm({
      airlineName: airline.name,
      iataCode: airline.iataCode,
      country: airline.country,
      companyRegistrationNumber: airline.companyRegistrationNumber ?? "",
      website: airline.website ?? "",
      contactEmail: airline.contactEmail,
      contactPhone: airline.contactPhone ?? "",
      timezone: airline.timezone ?? "UTC",
      logo: airline.logo ?? "",
      address: airline.address ?? "",
      currency: airline.currency ?? "USD",
      adminFirstName: airline.adminFirstName ?? "",
      adminLastName: airline.adminLastName ?? "",
      adminEmail: airline.adminEmail ?? "",
      jobTitle: airline.jobTitle ?? "",
      creditLimit: airline.creditLimit ?? 0,
    });
    setEditOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!airline) return;
    setSubmitting(true);
    try {
      const patch: Partial<Airline> = {
        name: form.airlineName,
        iataCode: form.iataCode,
        country: form.country,
        contactEmail: form.contactEmail,
        companyRegistrationNumber: form.companyRegistrationNumber,
        website: form.website,
        contactPhone: form.contactPhone,
        timezone: form.timezone,
        logo: form.logo,
        address: form.address,
        currency: form.currency,
        adminFirstName: form.adminFirstName,
        adminLastName: form.adminLastName,
        adminEmail: form.adminEmail,
        jobTitle: form.jobTitle,
        creditLimit: form.creditLimit,
      };
      const updated = await updateAirline(airline.id, patch);
      setAirline({ ...airline, ...updated });
      toast({ title: "Airline updated", description: `${updated.name} details saved.` });
      setEditOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to update airline.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading airline details..." />
      </MainLayout>
    );
  }

  if (!airline) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">Airline not found</h2>
          <p className="text-muted-foreground mb-4">The airline you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/airlines")}>Back to Airlines</Button>
        </div>
      </MainLayout>
    );
  }

  const hasRiskIndicators = airline.failedPayments > 5 || airline.allocationFailures > 10;

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/airlines")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Airlines
        </Button>
        <Header title={airline.name} subtitle={`IATA: ${airline.iataCode}`}>
          <StatusBadge status={airline.status as StatusType} />
          <Button onClick={openEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit Details
          </Button>
        </Header>
      </div>

      {airline.status === "disabled" && (
        <Alert className="mb-6 border-warning bg-warning/10">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <AlertDescription className="text-warning">
            This airline is currently disabled. Operations are paused until re-enabled.
          </AlertDescription>
        </Alert>
      )}

      {airline.status === "suspended" && (
        <Alert className="mb-6 border-destructive bg-destructive/10">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <AlertDescription className="text-destructive">
            This airline is suspended. Manual review required to reactivate.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Airline Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Airline Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Airline Name" value={airline.name} />
            <InfoRow label="Airline Code" value={airline.iataCode} />
            <InfoRow label="Country" value={airline.country} />
            <InfoRow label="Company Registration" value={airline.companyRegistrationNumber || "—"} />
            <InfoRow label="Website" value={airline.website || "—"} />
            <InfoRow label="Contact Email" value={airline.contactEmail} />
            <InfoRow label="Contact Phone" value={airline.contactPhone || "—"} />
            <InfoRow label="Timezone" value={airline.timezone || "—"} />
            <InfoRow label="Currency" value={airline.currency || "—"} />
            <InfoRow label="Address" value={airline.address || "—"} />
            <InfoRow label="Onboarding Date" value={new Date(airline.onboardingDate).toLocaleDateString()} />
          </CardContent>
        </Card>

        {/* Admin Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Admin Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Admin First Name" value={airline.adminFirstName || "—"} />
            <InfoRow label="Admin Last Name" value={airline.adminLastName || "—"} />
            <InfoRow label="Admin Email" value={airline.adminEmail || "—"} />
            <InfoRow label="Job Title" value={airline.jobTitle || "—"} />
            <InfoRow label="Credit Limit" value={formatCurrency(airline.creditLimit)} />
          </CardContent>
        </Card>

        {/* Operational Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Operational Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Total Cancelled Flights" value={airline.cancelledFlights.toLocaleString()} />
            <InfoRow label="Total Passengers" value={airline.passengers.toLocaleString()} />
            <InfoRow label="Avg Cost per Passenger" value={formatCurrency(airline.avgCostPerPassenger)} />
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Total Booking Value" value={formatCurrency(airline.totalBookingValue)} />
            <InfoRow label="Service Fees Billed" value={formatCurrency(airline.serviceFeesBilled)} />
            <InfoRow label="Outstanding Balance" value={formatCurrency(airline.outstandingBalance)} />
            <InfoRow label="Stripe Connection">
              <StatusBadge
                status={airline.stripeStatus === "connected" ? "connected" : airline.stripeStatus === "pending" ? "pending" : "failed"}
              />
            </InfoRow>
          </CardContent>
        </Card>

        {/* Risk Indicators */}
        <Card className={hasRiskIndicators ? "border-warning lg:col-span-2" : "lg:col-span-2"}>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              Risk Indicators
              {hasRiskIndicators && <AlertTriangle className="w-4 h-4 text-warning" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Failed Payments" value={airline.failedPayments} highlight={airline.failedPayments > 5} />
            <InfoRow label="Allocation Failures" value={airline.allocationFailures} highlight={airline.allocationFailures > 10} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>Edit Airline Details</DialogTitle>
              <DialogDescription>Update airline & admin information.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <AirlineDetailsForm values={form} countries={countries} onChange={setForm} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

function InfoRow({
  label,
  value,
  children,
  highlight = false,
}: {
  label: string;
  value?: string | number;
  children?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children || (
        <span className={`text-sm font-medium text-right ${highlight ? "text-warning" : ""}`}>
          {value}
        </span>
      )}
    </div>
  );
}
