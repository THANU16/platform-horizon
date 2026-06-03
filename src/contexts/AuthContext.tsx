import { createContext, useContext, useState, ReactNode } from "react";

export type TwoFactorMethod = "email" | "totp";

export interface TwoFactorSettings {
  enabled: boolean;
  method: TwoFactorMethod;
  secret: string; // base32 secret for authenticator app
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  twoFactor: TwoFactorSettings;
  updateTwoFactor: (settings: Partial<TwoFactorSettings>) => void;
  // Demo OTP code accepted for all simulated 2FA / password reset flows
  DEMO_OTP: string;
}

const STORAGE_AUTH = "flyvoid_auth";
const STORAGE_2FA = "flyvoid_2fa";

// Demo-only static secret (base32). Real apps would generate per user.
const DEFAULT_TOTP_SECRET = "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP";

const defaultTwoFactor: TwoFactorSettings = {
  enabled: false,
  method: "email",
  secret: DEFAULT_TOTP_SECRET,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem(STORAGE_AUTH) === "true"
  );

  const [twoFactor, setTwoFactor] = useState<TwoFactorSettings>(() => {
    const raw = localStorage.getItem(STORAGE_2FA);
    if (!raw) return defaultTwoFactor;
    try {
      return { ...defaultTwoFactor, ...JSON.parse(raw) };
    } catch {
      return defaultTwoFactor;
    }
  });

  const login = () => {
    localStorage.setItem(STORAGE_AUTH, "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_AUTH);
    setIsAuthenticated(false);
  };

  const updateTwoFactor = (settings: Partial<TwoFactorSettings>) => {
    setTwoFactor((prev) => {
      const next = { ...prev, ...settings };
      localStorage.setItem(STORAGE_2FA, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        twoFactor,
        updateTwoFactor,
        DEMO_OTP: "123456",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
