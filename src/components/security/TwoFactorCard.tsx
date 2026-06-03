import { useState } from "react";
import { useAuth, TwoFactorMethod } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Smartphone, Mail, Copy, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TwoFactorCard({ accountEmail }: { accountEmail: string }) {
  const { twoFactor, updateTwoFactor, DEMO_OTP } = useAuth();
  const { toast } = useToast();
  const [draftMethod, setDraftMethod] = useState<TwoFactorMethod>(twoFactor.method);
  const [verifyOtp, setVerifyOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // otpauth:// URI for authenticator app
  const issuer = "FlyVoid%20Admin";
  const accountLabel = encodeURIComponent(accountEmail || "admin@flyvoid.com");
  const otpauthUri = `otpauth://totp/${issuer}:${accountLabel}?secret=${twoFactor.secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUri)}`;

  const handleToggle = (enabled: boolean) => {
    if (!enabled) {
      updateTwoFactor({ enabled: false });
      toast({ title: "Two-factor disabled", description: "Your account is no longer protected by 2FA." });
      return;
    }
    // Enabling — keep disabled until they verify a code
    setDraftMethod(twoFactor.method);
    updateTwoFactor({ enabled: false });
    toast({
      title: "Verify to enable 2FA",
      description: "Choose a method and enter the 6-digit code to activate.",
    });
  };

  const handleVerifyAndEnable = () => {
    if (verifyOtp.length !== 6) {
      toast({ title: "Invalid code", description: "Enter the 6-digit code to continue", variant: "destructive" });
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (verifyOtp !== DEMO_OTP) {
        toast({ title: "Verification failed", description: "The code you entered is incorrect", variant: "destructive" });
        setVerifyOtp("");
        return;
      }
      updateTwoFactor({ enabled: true, method: draftMethod });
      setVerifyOtp("");
      toast({
        title: "Two-factor enabled",
        description: `2FA is now active via ${draftMethod === "email" ? "email OTP" : "authenticator app"}.`,
      });
    }, 600);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(twoFactor.secret);
    toast({ title: "Copied", description: "Secret key copied to clipboard" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className="icon-container-sm">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="mt-1">
              Add an extra layer of security to your account
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {twoFactor.enabled && (
              <Badge variant="secondary" className="rounded-full bg-success/10 text-success">
                Enabled
              </Badge>
            )}
            <Switch checked={twoFactor.enabled} onCheckedChange={handleToggle} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {twoFactor.enabled ? (
          <div className="flex items-start gap-3 p-3 rounded-md bg-success/5 border border-success/20">
            <ShieldCheck className="w-5 h-5 text-success mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">
                2FA is active via {twoFactor.method === "email" ? "Email OTP" : "Authenticator App"}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                You'll be asked for a 6-digit code on every sign-in.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Choose verification method</Label>
              <RadioGroup
                value={draftMethod}
                onValueChange={(v) => setDraftMethod(v as TwoFactorMethod)}
                className="space-y-2"
              >
                <label
                  htmlFor="method-email"
                  className="flex items-start gap-3 p-3 border border-border rounded-md cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <RadioGroupItem id="method-email" value="email" className="mt-1" />
                  <Mail className="w-4 h-4 text-primary mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email OTP</p>
                    <p className="text-xs text-muted-foreground">
                      Receive a 6-digit code at {accountEmail || "your email"}
                    </p>
                  </div>
                </label>

                <label
                  htmlFor="method-totp"
                  className="flex items-start gap-3 p-3 border border-border rounded-md cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <RadioGroupItem id="method-totp" value="totp" className="mt-1" />
                  <Smartphone className="w-4 h-4 text-primary mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Authenticator App</p>
                    <p className="text-xs text-muted-foreground">
                      Use Google Authenticator, Authy, or 1Password
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {draftMethod === "totp" && (
              <div className="border border-border rounded-md p-4 space-y-3 bg-muted/30">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <QrCode className="w-4 h-4 text-primary" />
                  Scan QR code with your authenticator app
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="bg-card p-2 rounded-md border border-border">
                    <img
                      src={qrSrc}
                      alt="2FA QR code"
                      width={180}
                      height={180}
                      className="rounded-sm"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div>
                      <Label className="text-xs text-muted-foreground">Issuer</Label>
                      <p className="text-sm font-medium">FlyVoid Admin</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Account</Label>
                      <p className="text-sm font-medium break-all">{accountEmail || "admin@flyvoid.com"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Secret Key</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 text-xs font-mono bg-card border border-border rounded px-2 py-1.5 break-all">
                          {twoFactor.secret}
                        </code>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={copySecret}
                          className="shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                      Can't scan? Enter the secret key manually in your authenticator app.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2 border-t border-border">
              <Label className="text-sm font-medium">
                Enter 6-digit code to activate
              </Label>
              <p className="text-xs text-muted-foreground">
                {draftMethod === "email"
                  ? `We would email a code to ${accountEmail || "your email"}.`
                  : "Open your authenticator app and enter the current 6-digit code."}
                {" "}Demo code: <span className="font-mono font-semibold">{DEMO_OTP}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <InputOTP maxLength={6} value={verifyOtp} onChange={setVerifyOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button
                  onClick={handleVerifyAndEnable}
                  disabled={isVerifying || verifyOtp.length !== 6}
                >
                  {isVerifying ? "Verifying..." : "Verify & Enable"}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
