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
import {
  ShieldCheck,
  Smartphone,
  Mail,
  Copy,
  QrCode,
  Download,
  KeyRound,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TwoFactorCard({ accountEmail }: { accountEmail: string }) {
  const { twoFactor, updateTwoFactor, generateRecoveryCodes, DEMO_OTP } = useAuth();
  const { toast } = useToast();
  const [draftMethod, setDraftMethod] = useState<TwoFactorMethod>(twoFactor.method);
  const [verifyOtp, setVerifyOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [justGeneratedCodes, setJustGeneratedCodes] = useState<string[] | null>(null);

  // otpauth:// URI for authenticator app
  const issuer = "FlyVoid%20Admin";
  const accountLabel = encodeURIComponent(accountEmail || "admin@flyvoid.com");
  const otpauthUri = `otpauth://totp/${issuer}:${accountLabel}?secret=${twoFactor.secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUri)}`;
  const qrDownloadSrc = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&format=png&data=${encodeURIComponent(otpauthUri)}`;

  const downloadFile = (filename: string, content: string, mime = "text/plain") => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadQr = async () => {
    try {
      const res = await fetch(qrDownloadSrc);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "flyvoid-2fa-qr.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "QR code downloaded", description: "Saved as flyvoid-2fa-qr.png" });
    } catch {
      toast({ title: "Download failed", description: "Could not download QR code", variant: "destructive" });
    }
  };

  const handleToggle = (enabled: boolean) => {
    if (!enabled) {
      updateTwoFactor({ enabled: false, recoveryCodes: [] });
      setJustGeneratedCodes(null);
      toast({ title: "Two-factor disabled", description: "Your account is no longer protected by 2FA." });
      return;
    }
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
      const codes = generateRecoveryCodes();
      setJustGeneratedCodes(codes);
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

  const copyCodes = (codes: string[]) => {
    navigator.clipboard.writeText(codes.join("\n"));
    toast({ title: "Copied", description: "Recovery codes copied to clipboard" });
  };

  const downloadCodes = (codes: string[]) => {
    const content = [
      "FlyVoid Admin — Two-Factor Recovery Codes",
      `Account: ${accountEmail || "admin@flyvoid.com"}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "Keep these codes in a safe place. Each code can be used once to sign in",
      "if you lose access to your authenticator app or email.",
      "",
      ...codes,
    ].join("\n");
    downloadFile("flyvoid-recovery-codes.txt", content);
    toast({ title: "Downloaded", description: "Recovery codes saved to your device" });
  };

  const handleRegenerate = () => {
    const codes = generateRecoveryCodes();
    setJustGeneratedCodes(codes);
    toast({
      title: "Recovery codes regenerated",
      description: "Old codes are now invalid. Save the new ones.",
    });
  };

  const RecoveryPanel = ({ codes, title }: { codes: string[]; title: string }) => (
    <div className="border border-warning/30 rounded-md p-4 space-y-3 bg-warning/5">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Save these codes somewhere safe. Each one works once if you lose access to your{" "}
            {twoFactor.method === "email" ? "email" : "authenticator app"}.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        {codes.map((c) => (
          <code
            key={c}
            className="bg-card border border-border rounded px-2 py-1.5 text-center tracking-wider"
          >
            {c}
          </code>
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => copyCodes(codes)}>
          <Copy className="w-3.5 h-3.5 mr-1.5" />
          Copy
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => downloadCodes(codes)}>
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Download
        </Button>
      </div>
    </div>
  );

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
          <>
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

            {justGeneratedCodes && (
              <RecoveryPanel
                codes={justGeneratedCodes}
                title="Your new recovery codes"
              />
            )}

            <div className="border border-border rounded-md p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <KeyRound className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Recovery codes</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {twoFactor.recoveryCodes.length} unused{" "}
                      {twoFactor.recoveryCodes.length === 1 ? "code" : "codes"} remaining. Use one if you
                      lose access to your {twoFactor.method === "email" ? "email" : "authenticator app"}.
                    </p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleRegenerate}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Regenerate
                </Button>
              </div>
              {!justGeneratedCodes && twoFactor.recoveryCodes.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyCodes(twoFactor.recoveryCodes)}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy codes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => downloadCodes(twoFactor.recoveryCodes)}
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </>
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
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-card p-2 rounded-md border border-border">
                      <img
                        src={qrSrc}
                        alt="2FA QR code"
                        width={180}
                        height={180}
                        className="rounded-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={downloadQr}
                      className="w-full"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download QR
                    </Button>
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
