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
  totalPayouts: number;
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

export interface Payment {
  id: string;
  airlineId: string;
  airlineName: string;
  country: string;
  amount: number;
  type: TransactionType;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
  reference: string;
  failureReason?: string;
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
}

export interface RevenueByAirline {
  airlineId: string;
  airlineName: string;
  iataCode: string;
  country: string;
  revenue: number;
  percentage: number;
  totalBookings: number;
  totalPayouts: number;
  topUpBalance: number;
  adminCreditBalance: number;
  remainingAllowance: number;
}

export interface RevenueByCountry {
  country: string;
  airlinesCount: number;
  revenue: number;
  percentage: number;
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

export type DateRangeFilter = "this_month" | "last_month" | "custom";

export type TransactionType = "payout" | "adjustment" | "refund" | "top_up" | "revenue_fee" | "admin_credit";

export interface AllowanceOverview {
  totalTopUp: number;
  usedTopUp: number;
  remainingTopUp: number;
  totalAdminCredit: number;
  usedAdminCredit: number;
  remainingAdminCredit: number;
  totalRemaining: number;
}

export interface AirlineAllowance {
  airlineId: string;
  airlineName: string;
  topUpBalance: number;
  adminCreditBalance: number;
  totalAllowance: number;
  usedAllowance: number;
  remainingAllowance: number;
}

export interface PaymentFilters {
  country: string;
  airline: string;
  search: string;
  dateRange: DateRangeFilter;
}
