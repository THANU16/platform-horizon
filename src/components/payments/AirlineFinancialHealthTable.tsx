import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Building2, Eye, AlertCircle, CheckCircle, TrendingDown, Wallet } from "lucide-react";
import { AirlineFinancialHealth, AirlineFinancialStatus } from "@/types";

interface AirlineFinancialHealthTableProps {
  data: AirlineFinancialHealth[];
  onAirlineClick?: (airlineId: string) => void;
}

const statusConfig: Record<AirlineFinancialStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle }> = {
  healthy: { label: "Healthy", variant: "default", icon: CheckCircle },
  using_credit: { label: "Using Credit", variant: "secondary", icon: TrendingDown },
  critical: { label: "Critical", variant: "destructive", icon: AlertCircle },
  topup_required: { label: "Top-up Required", variant: "outline", icon: Wallet },
};

export function AirlineFinancialHealthTable({ data, onAirlineClick }: AirlineFinancialHealthTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Airline Financial Health</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No airlines found"
            description="No airlines match the current filters."
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Airline</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Total Top-ups</TableHead>
                    <TableHead className="text-right">Booking Spend</TableHead>
                    <TableHead className="text-right">Platform Revenue</TableHead>
                    <TableHead className="text-right">Wallet Balance</TableHead>
                    <TableHead className="text-right">Credit Limit</TableHead>
                    <TableHead className="text-right">Credit Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((airline) => {
                    const status = statusConfig[airline.status];
                    const StatusIcon = status.icon;
                    return (
                      <TableRow 
                        key={airline.airlineId} 
                        className="table-row-hover cursor-pointer"
                        onClick={() => onAirlineClick?.(airline.airlineId)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{airline.airlineName}</span>
                            <Badge variant="secondary" className="text-xs font-mono">
                              {airline.iataCode}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {airline.country}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(airline.totalTopUps)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(airline.totalBookingSpend)}</TableCell>
                        <TableCell className="text-right text-success font-medium">
                          {formatCurrency(airline.platformRevenue)}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${airline.walletBalance < 0 ? 'text-destructive' : ''}`}>
                          {formatCurrency(airline.walletBalance)}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(airline.creditLimit)}</TableCell>
                        <TableCell className={`text-right ${airline.creditUsed > 0 ? 'text-warning font-medium' : ''}`}>
                          {formatCurrency(airline.creditUsed)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="text-xs">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAirlineClick?.(airline.airlineId);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {data.map((airline) => {
                const status = statusConfig[airline.status];
                const StatusIcon = status.icon;
                return (
                  <Card 
                    key={airline.airlineId} 
                    className="animate-fade-in cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onAirlineClick?.(airline.airlineId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium">{airline.airlineName}</h3>
                            <Badge variant="secondary" className="text-xs font-mono">
                              {airline.iataCode}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {airline.country}
                          </Badge>
                        </div>
                        <Badge variant={status.variant} className="text-xs">
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Wallet Balance</span>
                          <p className={`font-semibold ${airline.walletBalance < 0 ? 'text-destructive' : ''}`}>
                            {formatCurrency(airline.walletBalance)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Credit Used</span>
                          <p className={`font-semibold ${airline.creditUsed > 0 ? 'text-warning' : ''}`}>
                            {formatCurrency(airline.creditUsed)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Platform Revenue</span>
                          <p className="font-semibold text-success">{formatCurrency(airline.platformRevenue)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Credit Limit</span>
                          <p className="font-semibold">{formatCurrency(airline.creditLimit)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
