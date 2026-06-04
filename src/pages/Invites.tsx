import { useEffect, useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SimplePagination } from "@/components/ui/SimplePagination";
import {
  getInvites,
  createInvite,
  resendInvite,
  revokeInvite,
  getCountries,
  updateInvite,
} from "@/services/api";
import { Invite } from "@/types";
import { UserPlus, Send, RefreshCw, XCircle, Eye, Pencil } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  AirlineDetailsForm,
  AirlineDetailsFormValues,
  emptyAirlineDetails,
} from "@/components/forms/AirlineDetailsForm";

export default function Invites() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["pending", "expired"]);
  const [countryFilter, setCountryFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvite, setEditingInvite] = useState<Invite | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);

  const [formValues, setFormValues] = useState<AirlineDetailsFormValues>(emptyAirlineDetails);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [invitesData, countriesData] = await Promise.all([
          getInvites(),
          getCountries(),
        ]);
        setInvites(invitesData);
        setCountries(countriesData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter(["pending", "expired"]);
    setCountryFilter("all");
  };

  const filteredInvites = useMemo(() => {
    const q = search.toLowerCase();
    return invites.filter((invite) => {
      const matchesSearch =
        !q ||
        invite.airlineName.toLowerCase().includes(q) ||
        invite.contactEmail.toLowerCase().includes(q) ||
        invite.iataCode.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(invite.status);
      const matchesCountry =
        countryFilter === "all" || invite.country === countryFilter;
      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [invites, search, statusFilter, countryFilter]);

  useEffect(() => { setPage(1); }, [search, statusFilter, countryFilter, pageSize]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredInvites.slice(start, start + pageSize);
  }, [filteredInvites, page, pageSize]);

  const handleStatusToggle = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const openCreate = () => {
    setEditingInvite(null);
    setFormValues(emptyAirlineDetails);
    setDialogOpen(true);
  };

  const openEdit = (invite: Invite) => {
    setEditingInvite(invite);
    setFormValues({
      airlineName: invite.airlineName,
      iataCode: invite.iataCode,
      country: invite.country,
      companyRegistrationNumber: invite.companyRegistrationNumber ?? "",
      website: invite.website ?? "",
      contactEmail: invite.contactEmail,
      contactPhone: invite.contactPhone ?? "",
      timezone: invite.timezone ?? "UTC",
      logo: invite.logo ?? "",
      address: invite.address ?? "",
      currency: invite.currency ?? "USD",
      adminFirstName: invite.adminFirstName ?? "",
      adminLastName: invite.adminLastName ?? "",
      adminEmail: invite.adminEmail ?? "",
      jobTitle: invite.jobTitle ?? "",
      creditLimit: invite.creditLimit ?? invite.initialAllowance ?? 100000,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Partial<Invite> = {
        ...formValues,
        initialAllowance: formValues.creditLimit,
      };
      if (editingInvite) {
        const updated = await updateInvite(editingInvite.id, payload);
        setInvites((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        toast({ title: "Invitation updated", description: `${updated.airlineName} updated.` });
      } else {
        const created = await createInvite(payload as Parameters<typeof createInvite>[0]);
        setInvites((prev) => [created, ...prev]);
        toast({ title: "Invite sent", description: `Onboarding invite sent to ${created.airlineName}.` });
      }
      setDialogOpen(false);
      setEditingInvite(null);
      setFormValues(emptyAirlineDetails);
    } catch {
      toast({ title: "Error", description: "Failed to save invitation.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!selectedInvite) return;
    try {
      const updated = await resendInvite(selectedInvite.id);
      setInvites((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      toast({ title: "Invite resent", description: `A new invitation was sent to ${updated.airlineName}.` });
    } catch {
      toast({ title: "Error", description: "Failed to resend invite.", variant: "destructive" });
    } finally {
      setResendDialogOpen(false);
      setSelectedInvite(null);
    }
  };

  const handleRevoke = async () => {
    if (!selectedInvite) return;
    try {
      const updated = await revokeInvite(selectedInvite.id);
      setInvites((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      toast({ title: "Invite revoked", description: `Invitation to ${updated.airlineName} has been revoked.` });
    } catch {
      toast({ title: "Error", description: "Failed to revoke invite.", variant: "destructive" });
    } finally {
      setRevokeDialogOpen(false);
      setSelectedInvite(null);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

  const getStatusBadgeStatus = (status: string): StatusType => {
    switch (status) {
      case "pending": return "info";
      case "expired": return "warning";
      case "accepted": return "active";
      case "revoked": return "disabled";
      default: return "pending";
    }
  };

  const canResend = (status: string) => status === "pending" || status === "expired";
  const canRevoke = (status: string) => status === "pending" || status === "expired";
  const canEdit = (status: string) => status === "pending" || status === "expired";

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading invites..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header title="Invites & Onboarding" subtitle="Manage airline onboarding invitations">
        <Button onClick={openCreate}>
          <Send className="w-4 h-4 mr-2" />
          Invite Airline
        </Button>
      </Header>

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditingInvite(null); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingInvite ? "Edit Invitation" : "Invite New Airline"}</DialogTitle>
              <DialogDescription>
                {editingInvite
                  ? "Update the airline & admin details for this invitation."
                  : "Send an onboarding invitation with full airline and admin details."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <AirlineDetailsForm
                values={formValues}
                countries={countries}
                onChange={setFormValues}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingInvite ? "Save Changes" : "Send Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by airline, code, or email..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            name: "Country",
            value: countryFilter,
            onChange: setCountryFilter,
            placeholder: "All Countries",
            options: [
              { value: "all", label: "All Countries" },
              ...countries.map((c) => ({ value: c, label: c })),
            ],
          },
        ]}
        onClear={handleClearFilters}
        helperText="Showing pending and expired invitations that require action."
      >
        <div className="flex items-center gap-1 border rounded-md p-1">
          {["pending", "expired", "accepted", "revoked"].map((status) => (
            <Button
              key={status}
              variant={statusFilter.includes(status) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleStatusToggle(status)}
              className="capitalize text-xs"
            >
              {status}
            </Button>
          ))}
        </div>
      </FilterBar>

      {filteredInvites.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No pending invitations"
          description="All airlines have completed onboarding. Click 'Invite Airline' to send a new invitation."
          actionLabel="Invite Airline"
          onAction={openCreate}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead>Airline</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Invited Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Credit Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((invite) => (
                  <TableRow
                    key={invite.id}
                    className={cn("table-row-hover", invite.status === "revoked" && "opacity-50")}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{invite.airlineName}</p>
                        <p className="text-xs text-muted-foreground font-mono">{invite.iataCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>{invite.contactEmail}</TableCell>
                    <TableCell>{invite.country}</TableCell>
                    <TableCell>{invite.invitedBy}</TableCell>
                    <TableCell>{new Date(invite.invitedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invite.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(invite.creditLimit ?? invite.initialAllowance)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={getStatusBadgeStatus(invite.status)} label={invite.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {canEdit(invite.status) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => openEdit(invite)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Invitation</TooltipContent>
                          </Tooltip>
                        )}
                        {canResend(invite.status) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { setSelectedInvite(invite); setResendDialogOpen(true); }}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Resend Invite</TooltipContent>
                          </Tooltip>
                        )}
                        {canRevoke(invite.status) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { setSelectedInvite(invite); setRevokeDialogOpen(true); }}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Revoke Invite</TooltipContent>
                          </Tooltip>
                        )}
                        {invite.status === "accepted" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Airline Profile</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {paginated.map((invite) => (
              <Card key={invite.id} className={cn("animate-fade-in", invite.status === "revoked" && "opacity-50")}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{invite.airlineName}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{invite.iataCode}</p>
                    </div>
                    <StatusBadge status={getStatusBadgeStatus(invite.status)} label={invite.status} />
                  </div>
                  <div className="space-y-2 text-sm">
                    <Row label="Email">{invite.contactEmail}</Row>
                    <Row label="Country">{invite.country}</Row>
                    <Row label="Invited By">{invite.invitedBy}</Row>
                    <Row label="Credit Limit">{formatCurrency(invite.creditLimit ?? invite.initialAllowance)}</Row>
                    <Row label="Expires">{new Date(invite.expiryDate).toLocaleDateString()}</Row>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    {canEdit(invite.status) && (
                      <Button variant="outline" size="sm" onClick={() => openEdit(invite)}>
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    )}
                    {canResend(invite.status) && (
                      <Button variant="outline" size="sm" onClick={() => { setSelectedInvite(invite); setResendDialogOpen(true); }}>
                        <RefreshCw className="w-4 h-4 mr-1" /> Resend
                      </Button>
                    )}
                    {canRevoke(invite.status) && (
                      <Button variant="outline" size="sm" onClick={() => { setSelectedInvite(invite); setRevokeDialogOpen(true); }}>
                        <XCircle className="w-4 h-4 mr-1" /> Revoke
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <SimplePagination
            page={page}
            pageSize={pageSize}
            total={filteredInvites.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {/* Resend Confirmation Dialog */}
      <AlertDialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resend Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will send a new onboarding invitation to {selectedInvite?.airlineName} (
              {selectedInvite?.contactEmail}). The previous invitation token will be invalidated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResend}>Resend Invite</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently revoke the invitation for {selectedInvite?.airlineName}. The
              airline will no longer be able to use this invite to onboard. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Invite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}
