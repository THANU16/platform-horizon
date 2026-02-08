import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlaneTakeoff, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, login } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!password.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate login (UI only - no actual auth)
    setTimeout(() => {
      setIsLoading(false);
      login();
      toast({
        title: "Login Successful",
        description: "Welcome to FlyVoid Admin Portal",
      });
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        {/* Logo Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-4">
          <PlaneTakeoff className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-1">
          FlyVoid Admin
        </h1>
        <p className="text-muted-foreground text-sm">
          Disruption Hotel Allocation Platform
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8 shadow-soft">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-card-foreground">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
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

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
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
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground text-sm">
          <Shield className="w-4 h-4" />
          <span>Protected by enterprise-grade security</span>
        </div>
      </div>
    </div>
  );
}
