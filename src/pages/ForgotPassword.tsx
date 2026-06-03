import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PlaneTakeoff, Mail, Lock, Eye, EyeOff, Shield, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

type Step = "email" | "otp" | "password" | "done";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { DEMO_OTP } = useAuth();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      toast({
        title: "Reset code sent",
        description: `A 6-digit code was sent to ${email}. (Demo: use ${DEMO_OTP})`,
      });
    }, 800);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Invalid code", description: "Please enter the 6-digit code", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (otp !== DEMO_OTP) {
        toast({ title: "Verification failed", description: "The code you entered is incorrect", variant: "destructive" });
        setOtp("");
        return;
      }
      setStep("password");
    }, 600);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast({ title: "Weak password", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please confirm your new password", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("done");
      toast({ title: "Password updated", description: "You can now sign in with your new password" });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-4">
          <PlaneTakeoff className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">FlyVoid Admin</h1>
        <p className="text-muted-foreground text-sm">Reset your password</p>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8 shadow-soft">
          {/* Step indicator */}
          {step !== "done" && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {(["email", "otp", "password"] as Step[]).map((s, i) => {
                const stepIndex = ["email", "otp", "password"].indexOf(step);
                const isActive = i === stepIndex;
                const isComplete = i < stepIndex;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isComplete
                          ? "bg-success text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isComplete ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    {i < 2 && <div className={`w-8 h-px ${isComplete ? "bg-success" : "bg-border"}`} />}
                  </div>
                );
              })}
            </div>
          )}

          {step === "email" && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">Forgot your password?</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Enter your email and we'll send you a verification code
                </p>
              </div>
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@flyvoid.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send verification code"}
                </Button>
                <Link
                  to="/auth"
                  className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to login
                </Link>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-3">
                  <KeyRound className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-card-foreground">Enter verification code</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Demo code: <span className="font-mono font-semibold">{DEMO_OTP}</span>
                </p>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? "Verifying..." : "Verify code"}
                </Button>
                <button
                  type="button"
                  onClick={() => { setStep("email"); setOtp(""); }}
                  className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground w-full"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Use a different email
                </button>
              </form>
            </>
          )}

          {step === "password" && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-3">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-card-foreground">Set new password</h2>
                <p className="text-muted-foreground text-sm mt-1">Choose a strong password you haven't used before</p>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Reset password"}
                </Button>
              </form>
            </>
          )}

          {step === "done" && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground">Password updated</h2>
              <p className="text-muted-foreground text-sm">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <Button className="w-full" size="lg" onClick={() => navigate("/auth")}>
                Continue to login
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground text-sm">
          <Shield className="w-4 h-4" />
          <span>Protected by enterprise-grade security</span>
        </div>
      </div>
    </div>
  );
}
