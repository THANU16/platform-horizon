import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SimplePagination } from "@/components/ui/SimplePagination";
import { getBookings, Booking } from "@/services/bookings";
import { KpiCard } from "@/components/ui/KpiCard";
import { Hotel, Eye, DollarSign, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const money = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);
const dt = (v?: string) => (v ? new Date(v).toLocaleString() : "—");

function Row({ label, value, mono, className }: { label: string; value: React.ReactNode; mono?: boolean; className?: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b last:border-0 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right font-medium break-all ${mono ? "font-mono" : ""} ${className ?? ""}`}>{value}</span>
    </div>
  );
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [airline, setAirline] = useState("all");
  const [vendor, setVendor] = useState("all");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    getBookings().then(setBookings).finally(() => setLoading(false));
  }, []);

  const uniq = (arr: string[]) => Array.from(new Set(arr)).filter(Boolean).sort();
  const vendors = useMemo(() => uniq(bookings.map((b) => b.vendor)), [bookings]);
  const airlines = useMemo(() => {
    const m = new Map<string, string>();
    bookings.forEach((b) => m.set(b.airlineId, `${b.airlineName} (${b.airlineCode})`));
    return Array.from(m.entries());
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const s = startDate ? new Date(startDate).getTime() : null;
    const e = endDate ? new Date(endDate).getTime() + 86_399_999 : null;
    return bookings.filter((b) => {
      const ts = new Date(b.createdAt).getTime();
      return (
        (!q || b.id.toLowerCase().includes(q) || b.hotelName.toLowerCase().includes(q)) &&
        (airline === "all" || b.airlineId === airline) &&

        (vendor === "all" || b.vendor === vendor) &&
        (status === "all" || b.status === status) &&
        (s === null || ts >= s) &&
        (e === null || ts <= e)
      );
    });
  }, [bookings, search, airline, vendor, status, startDate, endDate]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, b) => ({
        totalCost: acc.totalCost + b.totalCost,
        hotelCost: acc.hotelCost + b.hotelCost,
        earnings: acc.earnings + b.earnings,
      }),
      { totalCost: 0, hotelCost: 0, earnings: 0 }
    );
  }, [filtered]);

  useEffect(() => setPage(1), [search, airline, vendor, status, startDate, endDate, pageSize]);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const clear = () => {
    setSearch(""); setAirline("all"); setVendor("all"); setStatus("all"); setStartDate(""); setEndDate("");
  };

  if (loading) return <MainLayout><LoadingState message="Loading bookings..." /></MainLayout>;

  return (
    <MainLayout>
      <Header title="Bookings" subtitle="Hotel bookings made for disrupted passengers across airlines" />

      <FilterBar
        searchPlaceholder="Search by booking ID or hotel name..."
        searchValue={search}
        onSearchChange={setSearch}
        onClear={clear}
        filters={[
          { name: "Airline", value: airline, onChange: setAirline, placeholder: "All Airlines",
            options: [{ value: "all", label: "All Airlines" }, ...airlines.map(([v, l]) => ({ value: v, label: l }))] },

          { name: "Vendor", value: vendor, onChange: setVendor, placeholder: "All Vendors",
            options: [{ value: "all", label: "All Vendors" }, ...vendors.map((v) => ({ value: v, label: v }))] },
          { name: "Status", value: status, onChange: setStatus, placeholder: "All Statuses",
            options: [{ value: "all", label: "All Statuses" }, { value: "completed", label: "Completed" }, { value: "pending", label: "Pending" }, { value: "failed", label: "Failed" }] },
        ]}
      >
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Start date</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10 w-[150px]" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">End date</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10 w-[150px]" />
          </div>
        </div>
      </FilterBar>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Total Payments by Airlines"
          value={money(totals.totalCost)}
          icon={DollarSign}
        />
        <KpiCard
          title="Total Paid to Hotels"
          value={money(totals.hotelCost)}
          icon={Hotel}
        />
        <KpiCard
          title="Total Earnings"
          value={money(totals.earnings)}
          icon={TrendingUp}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Hotel} title="No bookings found" description="No bookings match your current filters." />
      ) : (
        <>
          <div className="hidden lg:block border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Airline ID</TableHead>
                  <TableHead>Airline</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead className="text-right">Passengers</TableHead>
                  <TableHead className="text-right">Rooms</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((b) => (
                  <TableRow key={b.id} className="table-row-hover">
                    <TableCell className="font-mono font-medium">{b.id}</TableCell>
                    <TableCell className="font-mono">{b.airlineId}</TableCell>
                    <TableCell>{b.airlineName}</TableCell>
                    <TableCell>{b.vendor}</TableCell>
                    <TableCell className="font-mono">{b.departure}</TableCell>
                    <TableCell className="max-w-[180px] truncate" title={b.hotelName}>{b.hotelName}</TableCell>
                    <TableCell className="text-right">{b.passengers}</TableCell>
                    <TableCell className="text-right">{b.rooms}</TableCell>
                    <TableCell className="text-right">{money(b.totalCost)}</TableCell>
                    <TableCell className="text-right text-success">{money(b.earnings)}</TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(b)}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="lg:hidden space-y-4">
            {paged.map((b) => (
              <Card key={b.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-mono font-medium">{b.id}</h3>
                      <p className="text-sm text-muted-foreground">{b.airlineName} · {b.vendor}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelected(b)}><Eye className="w-4 h-4 mr-1" />View</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground">Hotel</p><p className="font-medium">{b.hotelName}</p></div>
                    <div><p className="text-muted-foreground">Departure</p><p className="font-mono font-medium">{b.departure}</p></div>
                    <div><p className="text-muted-foreground">Passengers / Rooms</p><p className="font-medium">{b.passengers} / {b.rooms}</p></div>
                    <div><p className="text-muted-foreground">Total Cost</p><p className="font-medium">{money(b.totalCost)}</p></div>
                    <div><p className="text-muted-foreground">Earnings</p><p className="font-medium text-success">{money(b.earnings)}</p></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4">
            <SimplePagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
          </div>
        </>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono">{selected.id}</span>
                  <StatusBadge status={selected.status} />
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="details">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="technical">Technical & Debug</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Booking</h4>
                    <Row label="Airline" value={`${selected.airlineName} (${selected.airlineId})`} />
                    <Row label="Vendor" value={selected.vendor} />
                    <Row label="Hotel" value={selected.hotelName} />
                    <Row label="Passengers / Rooms" value={`${selected.passengers} / ${selected.rooms}`} />
                    <Row label="Status" value={<StatusBadge status={selected.status} />} />
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Cost Breakdown</h4>
                    <Row label="Hotel Cost" value={money(selected.hotelCost)} />
                    <Row label="Hotel Tax" value={money(selected.hotelTax)} />
                    <Row label="Platform Fee" value={money(selected.platformFee)} />
                    <Row label="Hotel Commission" value={money(selected.hotelCommission)} />
                    <Row label="Discount" value={selected.discount ? `- ${money(selected.discount)}` : money(0)} className="text-destructive" />
                    <Row label="Total Cost" value={money(selected.totalCost)} className="font-semibold" />
                    <Row label="Earnings" value={money(selected.earnings)} className="text-success font-semibold" />
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Flight Detail</h4>
                    <Row label="Flight ID" value={selected.flight.id} mono />
                    <Row label="Flight Number" value={selected.flight.flightNumber} mono />
                    <Row label="Departure" value={selected.flight.departure} mono />
                    <Row label="Arrival" value={selected.flight.arrival} mono />
                    <Row label="Scheduled" value={dt(selected.flight.scheduledDate)} />
                  </div>
                </TabsContent>
                <TabsContent value="technical" className="mt-4">
                  <div className="border rounded-lg p-4">
                    <Row label="Request ID" value={selected.technical.requestId} mono />
                    <Row label="Vendor" value={selected.technical.vendor} />
                    <Row label="Vendor Booking Status" value={selected.technical.vendorBookingStatus} mono />
                    <Row label="Vendor Reference" value={selected.technical.vendorReference} mono />
                    <Row label="Transfer Reference" value={selected.technical.transferReference} mono />
                    <Row label="Completed At" value={dt(selected.technical.completedAt)} />
                    <Row label="Failed At" value={dt(selected.technical.failedAt)} />
                    <Row label="Failure Reason" value={selected.technical.failureReason ?? "—"} className={selected.technical.failureReason ? "text-destructive" : ""} />
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
