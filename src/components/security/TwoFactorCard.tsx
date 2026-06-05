import { useState } from "react";
import { useAuth, TwoFactorMethod } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Smartphone,
  Mail,
  Copy,
  QrCode,
  Download,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SetupStage = "choose" | "initiated" | "recovery";

export function TwoFactorCard({ accountEmail }: { accountEmail: string }) {
  const { twoFactor, updateTwoFactor, generateRecoveryCodes, DEMO_OTP } = useAuth();
  const { toast } = useToast();

  const [stage, setStage] = useState<SetupStage>("choose");
  const [draftMethod, setDraftMethod] = useState<TwoFactorMethod>(twoFactor.method);
  const [verifyOtp, setVerifyOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingCodes, setPendingCodes] = useState<string[]>([]);
  const [acknowledgedSaved, setAcknowledgedSaved] = useState(false);

  // otpauth:// URI for authenticator app
  const issuer = "FlyVoid%20Admin";
  const accountLabel = encodeURIComponent(accountEmail || "admin@flyvoid.com");
  const otpauthUri = `otpauth://totp/${issuer}:${accountLabel}?secret=${twoFactor.secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUri)}`;
  const qrDownloadSrc = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&format=png&data=${encodeURIComponent(otpauthUri)}`;

  const resetSetup = () => {
    setStage("choose");
    setVerifyOtp("");
    setPendingCodes([]);
    setAcknowledgedSaved(false);
    setIsVerifying(false);
  };

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

  const handleDisable = () => {
    updateTwoFactor({ enabled: false, recoveryCodes: [], enabledAt: null });
    resetSetup();
    toast({ title: "Two-factor disabled", description: "Your account is no longer protected by 2FA." });
  };

  const handleInitiate = () => {
    setStage("initiated");
    setVerifyOtp("");
    if (draftMethod === "email") {
      toast({
        title: "Verification code sent",
        description: `A 6-digit code was sent to ${accountEmail || "your email"}.`,
      });
    }
  };

  const handleVerify = () => {
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
      const codes = generateRecoveryCodes();
      setPendingCodes(codes);
      setStage("recovery");
    }, 500);
  };

  const handleCompleteSetup = () => {
    if (!acknowledgedSaved) return;
    updateTwoFactor({
      enabled: true,
      method: draftMethod,
      enabledAt: new Date().toISOString(),
    });
    toast({
      title: "Two-factor enabled",
      description: `2FA is now active via ${draftMethod === "email" ? "email OTP" : "authenticator app"}.`,
    });
    setPendingCodes([]);
    setAcknowledgedSaved(false);
    setVerifyOtp("");
    setStage("choose");
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
          {twoFactor.enabled && (
            <Badge variant="secondary" className="rounded-full bg-success/10 text-success">
              Enabled
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {twoFactor.enabled ? (
          // ===== Returning user view =====
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-md border border-border bg-muted/30">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-medium mt-0.5">Enabled</p>
              </div>
              <div className="p-3 rounded-md border border-border bg-muted/30">
                <p className="text-xs text-muted-foreground">Method</p>
                <p className="text-sm font-medium mt-0.5">
                  {twoFactor.method === "email" ? "Email OTP" : "Authenticator App"}
                </p>
              </div>
              <div className="p-3 rounded-md border border-border bg-muted/30">
                <p className="text-xs text-muted-foreground">Enabled on</p>
                <p className="text-sm font-medium mt-0.5">
                  {twoFactor.enabledAt
                    ? new Date(twoFactor.enabledAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
            <Button type="button" variant="destructive" onClick={handleDisable}>
              Disable 2FA
            </Button>
          </div>
        ) : stage === "recovery" ? (
          // ===== Recovery codes (shown once) =====
          <div className="space-y-4">
            <div className="flex items-start gap-2 p-3 rounded-md bg-warning/5 border border-warning/30">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium">Save your recovery codes</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Store these in a secure location. They will only be shown once and cannot be
                  retrieved or regenerated later.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {pendingCodes.map((c) => (
                <code
                  key={c}
                  className="bg-card border border-border rounded px-2 py-1.5 text-center tracking-wider"
                >
                  {c}
                </code>
              ))}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => copyCodes(pendingCodes)}>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => downloadCodes(pendingCodes)}>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download
              </Button>
            </div>

            <label
              htmlFor="ack-saved"
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <Checkbox
                id="ack-saved"
                checked={acknowledgedSaved}
                onCheckedChange={(v) => setAcknowledgedSaved(!!v)}
              />
              I have saved these recovery codes
            </label>

            <Button onClick={handleCompleteSetup} disabled={!acknowledgedSaved}>
              Complete Setup
            </Button>
          </div>
        ) : (
          // ===== Setup flow: choose method, then initiate =====
          <>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Choose verification method</Label>
              <RadioGroup
                value={draftMethod}
                onValueChange={(v) => {
                  setDraftMethod(v as TwoFactorMethod);
                  setStage("choose");
                  setVerifyOtp("");
                }}
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
                      Use Google Authenticator, Authy, Microsoft Authenticator, or 1Password
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {stage === "choose" && (
              <div className="pt-2 border-t border-border">
                <Button type="button" onClick={handleInitiate}>
                  {draftMethod === "email" ? "Send OTP" : "Generate Setup"}
                </Button>
              </div>
            )}

            {stage === "initiated" && draftMethod === "totp" && (
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
                      <p className="text-sm font-medium break-all">
                        {accountEmail || "admin@flyvoid.com"}
                      </p>
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

            {stage === "initiated" && (
              <div className="space-y-3 pt-2 border-t border-border">
                <Label className="text-sm font-medium">Enter verification code</Label>
                <p className="text-xs text-muted-foreground">
                  {draftMethod === "email"
                    ? `Enter the 6-digit code sent to ${accountEmail || "your email"}.`
                    : "Open your authenticator app and enter the current 6-digit code."}{" "}
                  Demo code: <span className="font-mono font-semibold">{DEMO_OTP}</span>
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
                  <div className="flex gap-2">
                    <Button onClick={handleVerify} disabled={isVerifying || verifyOtp.length !== 6}>
                      {isVerifying ? "Verifying..." : "Verify & Enable"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={resetSetup}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
