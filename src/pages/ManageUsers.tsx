import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SimplePagination } from "@/components/ui/SimplePagination";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Users } from "lucide-react";
import { toast } from "sonner";

type AccessLevel = "view" | "edit" | "export";
type ModuleKey =
  | "dashboard"
  | "airlines"
  | "cancelled_flights"
  | "payments.platform_overview"
  | "payments.detailed_analysis"
  | "payments.platform_treasury"
  | "invites"
  | "system_settings"
  | "audit_logs";

interface ModuleDef {
  key: ModuleKey;
  label: string;
  group?: string;
}

const MODULES: ModuleDef[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "airlines", label: "Airlines" },
  { key: "cancelled_flights", label: "Cancelled Flights" },
  { key: "payments.platform_overview", label: "Platform Overview", group: "Payments & Revenue" },
  { key: "payments.detailed_analysis", label: "Detailed Analysis", group: "Payments & Revenue" },
  { key: "payments.platform_treasury", label: "Platform Treasury", group: "Payments & Revenue" },
  { key: "invites", label: "Invites & Onboarding" },
  { key: "system_settings", label: "System Settings" },
  { key: "audit_logs", label: "Audit Logs" },
];

const ACCESS_LEVELS: { key: AccessLevel; label: string }[] = [
  { key: "view", label: "View only" },
  { key: "edit", label: "Edit" },
  { key: "export", label: "Export" },
];

type Permissions = Record<string, Record<AccessLevel, boolean>>;

interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  permissions: Permissions;
}

const emptyPermissions = (): Permissions =>
  MODULES.reduce((acc, m) => {
    acc[m.key] = { view: false, edit: false, export: false };
    return acc;
  }, {} as Permissions);

const seedUsers: User[] = [
  {
    id: "1", userId: "AID0001", name: "Sarah Johnson", email: "sarah@flyvoid.com",
    status: "active",
    permissions: MODULES.reduce((acc, m) => {
      acc[m.key] = { view: true, edit: true, export: true };
      return acc;
    }, {} as Permissions),
  },
  {
    id: "2", userId: "AID0002", name: "David Chen", email: "david@flyvoid.com",
    status: "active",
    permissions: MODULES.reduce((acc, m) => {
      acc[m.key] = { view: true, edit: false, export: false };
      return acc;
    }, {} as Permissions),
  },
  {
    id: "3", userId: "AID0003", name: "Maya Patel", email: "maya@flyvoid.com",
    status: "inactive",
    permissions: emptyPermissions(),
  },
];

interface FormState {
  name: string;
  email: string;
  status: "active" | "inactive";
  permissions: Permissions;
}

const initialForm = (): FormState => ({
  name: "", email: "", status: "active", permissions: emptyPermissions(),
});

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(initialForm());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !u.userId.toLowerCase().includes(q) &&
          !u.name.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [users, statusFilter, search]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const openAdd = () => {
    setEditingUser(null);
    setForm(initialForm());
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      status: user.status,
      permissions: JSON.parse(JSON.stringify(user.permissions)),
    });
    setErrors({});
    setDialogOpen(true);
  };

  const togglePerm = (moduleKey: string, level: AccessLevel) => {
    setForm((f) => ({
      ...f,
      permissions: {
        ...f.permissions,
        [moduleKey]: {
          ...f.permissions[moduleKey],
          [level]: !f.permissions[moduleKey][level],
        },
      },
    }));
  };

  const toggleAllForModule = (moduleKey: string, value: boolean) => {
    setForm((f) => ({
      ...f,
      permissions: {
        ...f.permissions,
        [moduleKey]: { view: value, edit: value, export: value },
      },
    }));
  };

  const allCheckedForModule = (moduleKey: string) => {
    const p = form.permissions[moduleKey];
    return p.view && p.edit && p.export;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: form.name, email: form.email, status: form.status, permissions: form.permissions }
            : u
        )
      );
      toast.success("User updated");
    } else {
      const newId = String(Date.now());
      const userId = `AID${String(users.length + 1).padStart(4, "0")}`;
      setUsers((prev) => [
        { id: newId, userId, name: form.name, email: form.email, status: form.status, permissions: form.permissions },
        ...prev,
      ]);
      toast.success("User added");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    toast.success("User removed");
    setDeleteId(null);
  };

  const applySearch = () => {
    setSearch(searchDraft);
    setPage(1);
  };

  return (
    <MainLayout>
      <Header title="Manage Users" subtitle="Create and manage admin users and their module access">
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </Header>

      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-end gap-3 md:justify-end">
          <div className="w-full md:w-48">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-80">
            <Label className="text-xs text-muted-foreground">Search</Label>
            <Input
              placeholder="Search by User ID, Name, Email"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
            />
          </div>
          <Button onClick={applySearch} variant="outline" className="gap-2">
            <Search className="w-4 h-4" /> Search
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No users found" description="Try adjusting your filters or add a new user." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.userId}</TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={u.status === "active" ? "active" : "inactive"} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(u)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(u.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {filtered.length > 0 && (
        <SimplePagination
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>User Name<span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Enter user name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label>Email<span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Enter user email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!!editingUser}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-12 gap-2 items-center pb-2 border-b border-border">
                <div className="col-span-5 text-sm font-medium">Select access level</div>
                {ACCESS_LEVELS.map((l) => (
                  <div key={l.key} className="col-span-2 text-xs text-muted-foreground text-center">
                    {l.label}
                  </div>
                ))}
                <div className="col-span-1 text-xs text-muted-foreground text-center">All</div>
              </div>

              <div className="divide-y divide-border">
                {MODULES.map((m) => (
                  <div key={m.key} className="grid grid-cols-12 gap-2 items-center py-3">
                    <div className="col-span-5">
                      {m.group && (
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{m.group}</div>
                      )}
                      <div className="text-sm font-medium">{m.label}</div>
                    </div>
                    {ACCESS_LEVELS.map((l) => (
                      <div key={l.key} className="col-span-2 flex justify-center">
                        <Checkbox
                          checked={form.permissions[m.key][l.key]}
                          onCheckedChange={() => togglePerm(m.key, l.key)}
                        />
                      </div>
                    ))}
                    <div className="col-span-1 flex justify-center">
                      <Checkbox
                        checked={allCheckedForModule(m.key)}
                        onCheckedChange={(c) => toggleAllForModule(m.key, !!c)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 p-4 bg-muted/40 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.status === "active"}
                  onCheckedChange={(c) => setForm({ ...form, status: c ? "active" : "inactive" })}
                />
                <div>
                  <div className="text-sm font-medium">Update Status</div>
                  <div className="text-xs text-muted-foreground">
                    This will affect the status of the particular user.
                  </div>
                </div>
              </div>
              <StatusBadge status={form.status === "active" ? "active" : "inactive"} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingUser ? "Update" : "Add Now"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user will lose all access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
