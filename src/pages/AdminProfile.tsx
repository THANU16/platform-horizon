import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { LoadingState } from "@/components/ui/Spinner";
import { getAdminProfile, updateAdminProfile } from "@/services/api";
import { AdminProfile as AdminProfileType } from "@/types";
import { User, Save, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function AdminProfile() {
  const [profile, setProfile] = useState<AdminProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getAdminProfile();
        setProfile(data);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateAdminProfile(profile);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      platform_admin: "Platform Admin",
      operations_admin: "Operations Admin",
      finance_admin: "Finance Admin",
      support_admin: "Support Admin (Read-only)",
    };
    return labels[role] || role;
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading profile..." />
      </MainLayout>
    );
  }

  if (!profile) return null;

  return (
    <MainLayout>
      <Header title="Admin Profile" subtitle="Manage your account settings and preferences">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className="icon-container-sm">
                <User className="w-4 h-4 text-primary" />
              </div>
              Personal Information
            </CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{getRoleLabel(profile.role)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Password & Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" />
            </div>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Account Information</CardTitle>
            <CardDescription>Account activity and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Account Created</span>
              <span className="text-sm font-medium">
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Login</span>
              <span className="text-sm font-medium">
                {new Date(profile.lastLogin).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Notification Preferences</CardTitle>
            <CardDescription>Choose what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Receive email notifications for important events
                </p>
              </div>
              <Switch
                checked={profile.notificationPreferences.emailAlerts}
                onCheckedChange={(checked) =>
                  setProfile({
                    ...profile,
                    notificationPreferences: {
                      ...profile.notificationPreferences,
                      emailAlerts: checked,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">System Alerts</p>
                <p className="text-xs text-muted-foreground">
                  In-app notifications for system events
                </p>
              </div>
              <Switch
                checked={profile.notificationPreferences.systemAlerts}
                onCheckedChange={(checked) =>
                  setProfile({
                    ...profile,
                    notificationPreferences: {
                      ...profile.notificationPreferences,
                      systemAlerts: checked,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Weekly Reports</p>
                <p className="text-xs text-muted-foreground">
                  Receive weekly summary reports via email
                </p>
              </div>
              <Switch
                checked={profile.notificationPreferences.weeklyReports}
                onCheckedChange={(checked) =>
                  setProfile({
                    ...profile,
                    notificationPreferences: {
                      ...profile.notificationPreferences,
                      weeklyReports: checked,
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
