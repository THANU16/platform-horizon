import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PlaneTakeoff, Mail, Lock, Eye, EyeOff, Shield, KeyRound, ArrowLeft } from "lucide-react";
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

type Step = "credentials" | "otp" | "recovery";

export default function Auth() {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, login, twoFactor, DEMO_OTP, consumeRecoveryCode } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Validation Error", description: "Please enter your email address", variant: "destructive" });
      return;
    }
    if (!password.trim()) {
      toast({ title: "Validation Error", description: "Please enter your password", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (twoFactor.enabled) {
        setStep("otp");
        if (twoFactor.method === "email") {
          toast({
            title: "Verification code sent",
            description: `A 6-digit code was sent to ${email}. (Demo: use ${DEMO_OTP})`,
          });
        } else {
          toast({
            title: "Enter authenticator code",
            description: `Open your authenticator app and enter the 6-digit code. (Demo: use ${DEMO_OTP})`,
          });
        }
      } else {
        login();
        toast({ title: "Login Successful", description: "Welcome to FlyVoid Admin Portal" });
        navigate("/");
      }
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
      login();
      toast({ title: "Login Successful", description: "Two-factor verification passed" });
      navigate("/");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-4">
          <PlaneTakeoff className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">FlyVoid Admin</h1>
        <p className="text-muted-foreground text-sm">Disruption Hotel Allocation Platform</p>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8 shadow-soft">
          {step === "credentials" && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">Welcome back</h2>
                <p className="text-muted-foreground text-sm mt-1">Sign in to your account to continue</p>
              </div>
              <form onSubmit={handleCredentialSubmit} className="space-y-5">
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

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-3">
                  <KeyRound className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-card-foreground">Two-factor authentication</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {twoFactor.method === "email"
                    ? `Enter the 6-digit code sent to ${email}`
                    : "Enter the 6-digit code from your authenticator app"}
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
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                  }}
                  className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground w-full"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to login
                </button>
              </form>
            </>
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
