import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { getInvites, createInvite } from "@/services/api";
import { Invite } from "@/types";
import { UserPlus, Send } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Invites() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [newInvite, setNewInvite] = useState({
    airlineName: "",
    iataCode: "",
    contactEmail: "",
    initialAllowance: 100000,
  });

  useEffect(() => {
    const loadInvites = async () => {
      try {
        const data = await getInvites();
        setInvites(data);
      } finally {
        setLoading(false);
      }
    };
    loadInvites();
  }, []);

  const filteredInvites = invites.filter((invite) => {
    const matchesSearch =
      invite.airlineName.toLowerCase().includes(search.toLowerCase()) ||
      invite.iataCode.toLowerCase().includes(search.toLowerCase()) ||
      invite.contactEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || invite.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                    onChange={(e) => setNewInvite({ ...newInvite, iataCode: e.target.value.toUpperCase() })}
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
                  <Label htmlFor="initialAllowance">Initial Allowance (USD)</Label>
                  <Input
                    id="initialAllowance"
                    type="number"
                    value={newInvite.initialAllowance}
                    onChange={(e) => setNewInvite({ ...newInvite, initialAllowance: parseInt(e.target.value) || 0 })}
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

      <FilterBar
        searchPlaceholder="Search invites..."
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
              { value: "sent", label: "Sent" },
              { value: "accepted", label: "Accepted" },
              { value: "expired", label: "Expired" },
              { value: "revoked", label: "Revoked" },
            ],
          },
        ]}
      />

      {filteredInvites.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No invites found"
          description="No invitations match your current filters. Click 'Invite Airline' to send a new invitation."
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
                  <TableHead>IATA</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead className="text-right">Allowance</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvites.map((invite) => (
                  <TableRow key={invite.id} className="table-row-hover">
                    <TableCell className="font-medium">{invite.airlineName}</TableCell>
                    <TableCell className="font-mono">{invite.iataCode}</TableCell>
                    <TableCell>{invite.contactEmail}</TableCell>
                    <TableCell className="text-right">{formatCurrency(invite.initialAllowance)}</TableCell>
                    <TableCell>{new Date(invite.sentDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invite.expiresAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={invite.status as StatusType} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredInvites.map((invite) => (
              <Card key={invite.id} className="animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{invite.airlineName}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{invite.iataCode}</p>
                    </div>
                    <StatusBadge status={invite.status as StatusType} />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{invite.contactEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allowance</span>
                      <span className="font-medium">{formatCurrency(invite.initialAllowance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sent</span>
                      <span>{new Date(invite.sentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires</span>
                      <span>{new Date(invite.expiresAt).toLocaleDateString()}</span>
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
