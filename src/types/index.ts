export interface Airline {
  id: string;
  name: string;
  iataCode: string;
  contactEmail: string;
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
  initialAllowance: number;
  status: "sent" | "accepted" | "expired" | "revoked";
  sentDate: string;
  expiresAt: string;
}

export interface Payment {
  id: string;
  airlineId: string;
  airlineName: string;
  amount: number;
  type: "payout" | "fee" | "refund";
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
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
  passengersImpacted: number;
  platformRevenue: number;
  totalHotelSpend: number;
  monthlyCancellations: { month: string; count: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}
