import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/Spinner";
import { getAirlineById } from "@/services/api";
import { Airline } from "@/types";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AirlineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [airline, setAirline] = useState<Airline | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAirline = async () => {
      if (!id) return;
      try {
        const data = await getAirlineById(id);
        setAirline(data || null);
      } finally {
        setLoading(false);
      }
    };
    loadAirline();
  }, [id]);

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
        <Header 
          title={airline.name} 
          subtitle={`IATA: ${airline.iataCode}`}
        >
          <StatusBadge status={airline.status as StatusType} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Airline Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Airline Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow label="Airline Name" value={airline.name} />
            <InfoRow label="IATA Code" value={airline.iataCode} />
            <InfoRow label="Contact Email" value={airline.contactEmail} />
            <InfoRow label="Status">
              <StatusBadge status={airline.status as StatusType} />
            </InfoRow>
            <InfoRow label="Onboarding Date" value={new Date(airline.onboardingDate).toLocaleDateString()} />
          </CardContent>
        </Card>

        {/* Operational Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Operational Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          <CardContent className="space-y-4">
            <InfoRow label="Total Spend" value={formatCurrency(airline.totalSpend)} />
            <InfoRow label="Platform Fees" value={formatCurrency(airline.platformRevenue)} />
            <InfoRow label="Allowance Balance" value={formatCurrency(airline.allowanceBalance)} />
            <InfoRow label="Stripe Connection">
              <StatusBadge 
                status={airline.stripeStatus === "connected" ? "connected" : airline.stripeStatus === "pending" ? "pending" : "failed"} 
              />
            </InfoRow>
          </CardContent>
        </Card>

        {/* Risk Indicators */}
        <Card className={hasRiskIndicators ? "border-warning" : ""}>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              Risk Indicators
              {hasRiskIndicators && <AlertTriangle className="w-4 h-4 text-warning" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow 
              label="Failed Payments" 
              value={airline.failedPayments}
              highlight={airline.failedPayments > 5}
            />
            <InfoRow 
              label="Allocation Failures" 
              value={airline.allocationFailures}
              highlight={airline.allocationFailures > 10}
            />
          </CardContent>
        </Card>
      </div>
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
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children || (
        <span className={`text-sm font-medium ${highlight ? "text-warning" : ""}`}>
          {value}
        </span>
      )}
    </div>
  );
}
