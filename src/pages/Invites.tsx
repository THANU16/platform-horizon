import { useEffect, useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { getInvites, createInvite, resendInvite, revokeInvite, getCountries } from "@/services/api";
import { Invite } from "@/types";
import { UserPlus, Send, RefreshCw, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Invites() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["pending", "expired"]);
  const [countryFilter, setCountryFilter] = useState("all");

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);

  const [newInvite, setNewInvite] = useState({
    airlineName: "",
    iataCode: "",
    contactEmail: "",
    country: "",
    initialAllowance: 100000,
  });

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
        invite.contactEmail.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(invite.status);
      const matchesCountry =
        countryFilter === "all" || invite.country === countryFilter;
      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [invites, search, statusFilter, countryFilter]);

  const handleStatusToggle = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await createInvite(newInvite);
      setInvites((prev) => [created, ...prev]);
      setDialogOpen(false);
      setNewInvite({
        airlineName: "",
        iataCode: "",
        contactEmail: "",
        country: "",
        initialAllowance: 100000,
      });
      toast({
        title: "Invite sent",
        description: `Onboarding invite sent to ${created.airlineName}.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to send invite.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!selectedInvite) return;
    try {
      const updated = await resendInvite(selectedInvite.id);
      setInvites((prev) =>
        prev.map((i) => (i.id === updated.id ? updated : i))
      );
      toast({
        title: "Invite resent",
        description: `A new invitation was sent to ${updated.airlineName}.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to resend invite.",
        variant: "destructive",
      });
    } finally {
      setResendDialogOpen(false);
      setSelectedInvite(null);
    }
  };

  const handleRevoke = async () => {
    if (!selectedInvite) return;
    try {
      const updated = await revokeInvite(selectedInvite.id);
      setInvites((prev) =>
        prev.map((i) => (i.id === updated.id ? updated : i))
      );
      toast({
        title: "Invite revoked",
        description: `Invitation to ${updated.airlineName} has been revoked.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to revoke invite.",
        variant: "destructive",
      });
    } finally {
      setRevokeDialogOpen(false);
      setSelectedInvite(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadgeStatus = (status: string): StatusType => {
    switch (status) {
      case "pending":
        return "info";
      case "expired":
        return "warning";
      case "accepted":
        return "active";
      case "revoked":
        return "disabled";
      default:
        return "pending";
    }
  };

  const canResend = (status: string) => status === "pending" || status === "expired";
  const canRevoke = (status: string) => status === "pending" || status === "expired";

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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              Invite Airline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Invite New Airline</DialogTitle>
                <DialogDescription>
                  Send an onboarding invitation to a new airline partner.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="airlineName">Airline Name</Label>
                  <Input
                    id="airlineName"
                    value={newInvite.airlineName}
                    onChange={(e) => setNewInvite({ ...newInvite, airlineName: e.target.value })}
                    placeholder="e.g., SkyLine Airways"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iataCode">IATA Code</Label>
                  <Input
                    id="iataCode"
                    value={newInvite.iataCode}
                    onChange={(e) =>
                      setNewInvite({ ...newInvite, iataCode: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g., SKY"
                    maxLength={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={newInvite.contactEmail}
                    onChange={(e) => setNewInvite({ ...newInvite, contactEmail: e.target.value })}
                    placeholder="e.g., ops@airline.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={newInvite.country}
                    onValueChange={(value) => setNewInvite({ ...newInvite, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialAllowance">Initial Allowance (USD)</Label>
                  <Input
                    id="initialAllowance"
                    type="number"
                    value={newInvite.initialAllowance}
                    onChange={(e) =>
                      setNewInvite({ ...newInvite, initialAllowance: parseInt(e.target.value) || 0 })
                    }
                    min={0}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Invite"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Header>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search by airline name or email..."
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
        showApplyButton
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        hasChanges={hasFilterChanges}
        appliedFiltersCount={appliedFiltersCount}
        helperText="Showing pending and expired invitations that require action."
      >
        {/* Status multi-select as buttons */}
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
          onAction={() => setDialogOpen(true)}
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvites.map((invite) => (
                  <TableRow
                    key={invite.id}
                    className={cn(
                      "table-row-hover",
                      invite.status === "revoked" && "opacity-50"
                    )}
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
                    <TableCell>
                      <StatusBadge status={getStatusBadgeStatus(invite.status)} label={invite.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {canResend(invite.status) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedInvite(invite);
                                  setResendDialogOpen(true);
                                }}
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
                                onClick={() => {
                                  setSelectedInvite(invite);
                                  setRevokeDialogOpen(true);
                                }}
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
            {filteredInvites.map((invite) => (
              <Card
                key={invite.id}
                className={cn("animate-fade-in", invite.status === "revoked" && "opacity-50")}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{invite.airlineName}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{invite.iataCode}</p>
                    </div>
                    <StatusBadge status={getStatusBadgeStatus(invite.status)} label={invite.status} />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{invite.contactEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Country</span>
                      <span>{invite.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Invited By</span>
                      <span>{invite.invitedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allowance</span>
                      <span className="font-medium">{formatCurrency(invite.initialAllowance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires</span>
                      <span>{new Date(invite.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {(canResend(invite.status) || canRevoke(invite.status)) && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      {canResend(invite.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedInvite(invite);
                            setResendDialogOpen(true);
                          }}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Resend
                        </Button>
                      )}
                      {canRevoke(invite.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedInvite(invite);
                            setRevokeDialogOpen(true);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Revoke
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
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
