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
  // Hotel booking value handled directly between airline and hotels (informational only)
  totalBookingValue: number;
  // Service fee revenue billed by the platform
  platformRevenue: number;
  stripeStatus: "connected" | "pending" | "failed";
  avgCostPerPassenger: number;
  failedPayments: number;
  allocationFailures: number;
  totalBookings: number;
  // Service fee billing
  platformFeesBilled: number;
  paymentsReceived: number;
  outstandingBalance: number;
  // Max outstanding platform fees allowed before settlement is required
  creditLimit: number;
  // Extended profile (airline details)
  companyRegistrationNumber?: string;
  website?: string;
  contactPhone?: string;
  timezone?: string;
  logo?: string;
  address?: string;
  currency?: string;
  // Admin contact
  adminFirstName?: string;
  adminLastName?: string;
  adminEmail?: string;
  jobTitle?: string;
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
  status: "pending" | "accepted" | "expired" | "revoked";
  invitedBy: string;
  invitedDate: string;
  expiryDate: string;
  // Extended profile (airline details)
  companyRegistrationNumber?: string;
  website?: string;
  contactPhone?: string;
  timezone?: string;
  logo?: string;
  address?: string;
  currency?: string;
  // Admin contact
  adminFirstName?: string;
  adminLastName?: string;
  adminEmail?: string;
  jobTitle?: string;
  // Credit
  creditLimit?: number;
  platformFeePercent?: number;
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
  defaultPlatformFeePercent: number;
  defaultCreditLimit: number;
  maxCreditLimit: number;
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
  outstandingPlatformFees: number;
  paymentsReceived: number;
  outstandingReceivables: number;
  totalCreditIssued: number;
  creditUtilizationPercent: number;
  feeCollectionRate: number;
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

// STRICT Transaction Types - Only these are allowed
export type BillingTransactionType =
  | "platform_fee"
  | "fee_payment"
  | "fee_adjustment"
  | "credit_change";

export interface BillingTransaction {
  id: string;
  airlineId: string;
  airlineName: string;
  country: string;
  airport?: string;
  amount: number;
  type: BillingTransactionType;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
  reference: string;
}

// Platform Financial Snapshot
export interface PlatformFinancialSnapshot {
  totalPlatformFeesBilled: number;
  totalPaymentsReceived: number;
  totalOutstandingFees: number;
  totalCreditIssued: number;
  creditUtilizationPercent: number;
  totalPlatformRevenue: number;
  revenueChangePercent: number;
}

// Credit Risk Overview
export interface CreditRiskOverview {
  totalCreditAllowed: number;
  totalOutstandingFees: number;
  creditUtilizationPercent: number;
  airlinesWithOutstandingFees: number;
  totalAirlines: number;
}

// Airline Billing Status
export type AirlineFinancialStatus = "settled" | "outstanding" | "credit_warning" | "credit_exceeded";

export interface AirlineFinancialHealth {
  airlineId: string;
  airlineName: string;
  iataCode: string;
  country: string;
  totalBookings: number;
  totalBookingValue: number;
  platformFeePercent: number;
  platformFeesBilled: number;
  paymentsReceived: number;
  outstandingBalance: number;
  platformRevenue: number;
  creditLimit: number;
  remainingCredit: number;
  status: AirlineFinancialStatus;
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

// Tab types for Payments page
export type PaymentsTabType = "overview" | "detailed" | "approvals";

// Payment settlement methods
export type PaymentMethod = "credit_card" | "bank_transfer";

export type PaymentApprovalStatus = "pending" | "approved" | "rejected";

export interface PaymentApproval {
  id: string;
  airlineId: string;
  airlineName: string;
  country: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentApprovalStatus;
  submittedAt: string;
  referenceNumber: string;
  receiptUrl?: string;
  bankName?: string;
  notes?: string;
  rejectionReason?: string;
  reviewedAt?: string;
}
