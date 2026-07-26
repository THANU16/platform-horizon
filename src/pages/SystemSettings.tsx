import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { LoadingState } from "@/components/ui/Spinner";
import { getSystemSettings, updateSystemSettings } from "@/services/api";
import { SystemSettings as SystemSettingsType } from "@/types";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSystemSettings();
        setSettings(data);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSystemSettings(settings);
      toast({
        title: "Settings saved",
        description: "System settings have been updated successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading settings..." />
      </MainLayout>
    );
  }

  if (!settings) return null;

  return (
    <MainLayout>
      <Header title="System Settings" subtitle="Configure platform-wide settings and defaults">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Fees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className="icon-container-sm">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              Platform Fees
            </CardTitle>
            <CardDescription>Configure platform commission rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformFee">Service Fee (%)</Label>
              <Input
                id="platformFee"
                type="number"
                value={settings.serviceFeePercent}
                onChange={(e) =>
                  setSettings({ ...settings, serviceFeePercent: parseFloat(e.target.value) || 0 })
                }
                min={0}
                max={100}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground">
                Service fee charged per disruption booking
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Allowance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Credit Limits</CardTitle>
            <CardDescription>Set default and maximum outstanding service fee credit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultAllowance">Default Credit Limit (USD)</Label>
              <Input
                id="defaultAllowance"
                type="number"
                value={settings.defaultCreditLimit}
                onChange={(e) =>
                  setSettings({ ...settings, defaultCreditLimit: parseInt(e.target.value) || 0 })
                }
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAllowance">Maximum Credit Limit (USD)</Label>
              <Input
                id="maxAllowance"
                type="number"
                value={settings.maxCreditLimit}
                onChange={(e) =>
                  setSettings({ ...settings, maxCreditLimit: parseInt(e.target.value) || 0 })
                }
                min={0}
              />
            </div>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Currency Settings</CardTitle>
            <CardDescription>Set default currency for the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(value) => setSettings({ ...settings, defaultCurrency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Hotel Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Default Hotel Rules</CardTitle>
            <CardDescription>Set default hotel allocation parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxStars">Maximum Star Rating</Label>
              <Select
                value={String(settings.defaultHotelRules.maxStarRating)}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    defaultHotelRules: {
                      ...settings.defaultHotelRules,
                      maxStarRating: parseInt(value),
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDistance">Max Distance from Airport (km)</Label>
              <Input
                id="maxDistance"
                type="number"
                value={settings.defaultHotelRules.maxDistanceKm}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultHotelRules: {
                      ...settings.defaultHotelRules,
                      maxDistanceKm: parseInt(e.target.value) || 0,
                    },
                  })
                }
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Max Price per Night (USD)</Label>
              <Input
                id="maxPrice"
                type="number"
                value={settings.defaultHotelRules.maxPricePerNight}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultHotelRules: {
                      ...settings.defaultHotelRules,
                      maxPricePerNight: parseInt(e.target.value) || 0,
                    },
                  })
                }
                min={0}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
