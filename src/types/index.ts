export interface Airline {
  id: string;
  name: string;
  iataCode: string;
  contactEmail: string;
  country: string;
  status: "active" | "disabled" | "suspended";
  onboardingDate: string;
  cancelledFlights: number;
  passengers: number;
  totalSpend: number;
  platformRevenue: number;
  stripeStatus: "connected" | "pending" | "failed";
  allowanceBalance: number;
  avgCostPerPassenger: number;
  failedPayments: number;
  allocationFailures: number;
  totalBookings: number;
  // Wallet & Credit fields
  totalTopUps: number;
  walletBalance: number;
  creditLimit: number;
  creditUsed: number;
}

export interface CancelledFlight {
  id: string;
  flightNumber: string;
  airlineId: string;
  airlineName: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDate: string;
  passengers: number;
  totalCost: number;
  status: "pending" | "processing" | "completed" | "failed";
}

export interface Invite {
  id: string;
  airlineName: string;
  iataCode: string;
  contactEmail: string;
  country: string;
  initialAllowance: number;
  status: "pending" | "accepted" | "expired" | "revoked";
  invitedBy: string;
  invitedDate: string;
  expiryDate: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}

export interface SystemSettings {
  platformFeePercent: number;
  defaultAllowanceLimit: number;
  maxAllowanceLimit: number;
  defaultCurrency: string;
  defaultHotelRules: {
    maxStarRating: number;
    maxDistanceKm: number;
    maxPricePerNight: number;
  };
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: "platform_admin" | "operations_admin" | "finance_admin" | "support_admin";
  avatarUrl?: string;
  createdAt: string;
  lastLogin: string;
  notificationPreferences: {
    emailAlerts: boolean;
    systemAlerts: boolean;
    weeklyReports: boolean;
  };
}

export interface DashboardStats {
  totalAirlines: number;
  activeAirlines: number;
  cancelledFlightsThisMonth: number;
  platformRevenue: number;
  totalHotelSpend: number;
  revenueToSpendRatio: number;
  avgRevenuePerAirline: number;
  topAirlineByRevenue: string;
  monthlyCancellations: { month: string; count: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  // Trend indicators
  airlineGrowthPercent: number;
  flightChangePercent: number;
  revenueChangePercent: number;
}

export interface RevenueByAirline {
  airlineId: string;
  airlineName: string;
  iataCode: string;
  country: string;
  revenue: number;
  percentage: number;
  totalBookings: number;
}

export interface RevenueByCountry {
  country: string;
  airlinesCount: number;
  revenue: number;
  percentage: number;
}

export type DateRangeFilter = "this_month" | "last_month" | "last_7_days" | "last_30_days" | "last_90_days" | "custom";

// Wallet Transaction Types (NO payouts)
export type WalletTransactionType = "top_up" | "booking_charge" | "refund" | "adjustment" | "credit_change" | "platform_fee";

export interface WalletTransaction {
  id: string;
  airlineId: string;
  airlineName: string;
  country: string;
  airport?: string;
  amount: number;
  type: WalletTransactionType;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
  reference: string;
}

// Platform Financial Snapshot
export interface PlatformFinancialSnapshot {
  totalTopUpBalance: number;
  totalAdminCreditIssued: number;
  totalCreditUsed: number;
  netPlatformExposure: number;
  totalPlatformRevenue: number;
  revenueChangePercent: number;
}

// Credit Risk Overview
export interface CreditRiskOverview {
  totalCreditAllowed: number;
  totalCreditUsed: number;
  creditUtilizationPercent: number;
  airlinesUsingCredit: number;
  totalAirlines: number;
}

// Airline Financial Health Status
export type AirlineFinancialStatus = "healthy" | "using_credit" | "critical" | "topup_required";

export interface AirlineFinancialHealth {
  airlineId: string;
  airlineName: string;
  iataCode: string;
  country: string;
  totalTopUps: number;
  totalBookingSpend: number;
  platformRevenue: number;
  walletBalance: number;
  creditLimit: number;
  creditUsed: number;
  remainingCredit: number;
  status: AirlineFinancialStatus;
}

// Airline Detail for drill-down
export interface AirlineTransactionHistory {
  topUps: WalletTransaction[];
  bookingCharges: WalletTransaction[];
  refunds: WalletTransaction[];
  platformFees: WalletTransaction[];
}

// Filters for Payments page
export interface PaymentFilters {
  country: string;
  airline: string;
  airport: string;
  search: string;
  dateRange: DateRangeFilter;
}

// Airports list
export interface Airport {
  code: string;
  name: string;
  country: string;
}

// Legacy types kept for compatibility
export interface Payment {
  id: string;
  airlineId: string;
  airlineName: string;
  country: string;
  amount: number;
  type: WalletTransactionType;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
  reference: string;
  failureReason?: string;
}

export interface PaymentStats {
  totalRevenue: number;
  pendingPayouts: number;
  pendingAirlinesCount: number;
  failedPayouts: number;
  activeAirlines: number;
  totalOnboarded: number;
  revenueChange: number;
}

export interface AllowanceOverview {
  totalTopUp: number;
  usedTopUp: number;
  remainingTopUp: number;
  totalAdminCredit: number;
  usedAdminCredit: number;
  remainingAdminCredit: number;
  totalRemaining: number;
}
