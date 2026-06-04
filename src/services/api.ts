import { 
  Airline, 
  CancelledFlight, 
  Invite, 
  AuditLog, 
  DashboardStats, 
  SystemSettings, 
  AdminProfile,
  RevenueByAirline,
  RevenueByCountry,
  PlatformFinancialSnapshot,
  CreditRiskOverview,
  AirlineFinancialHealth,
  WalletTransaction,
  PaymentFilters,
  Airport,
  AirlineFinancialStatus,
  PlatformReserveTransaction,
  PlatformTreasurySummary
} from "@/types";

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Countries list
export const countriesData = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "India",
  "Canada",
  "Australia",
];

// Airports list
export const airportsData: Airport[] = [
  { code: "JFK", name: "John F. Kennedy International", country: "United States" },
  { code: "LAX", name: "Los Angeles International", country: "United States" },
  { code: "ORD", name: "O'Hare International", country: "United States" },
  { code: "LHR", name: "London Heathrow", country: "United Kingdom" },
  { code: "FRA", name: "Frankfurt Airport", country: "Germany" },
  { code: "CDG", name: "Paris Charles de Gaulle", country: "France" },
  { code: "DEL", name: "Indira Gandhi International", country: "India" },
  { code: "YYZ", name: "Toronto Pearson", country: "Canada" },
  { code: "SYD", name: "Sydney Airport", country: "Australia" },
];

// Mock Airlines Data with wallet/credit model
const airlinesData: Airline[] = [
  {
    id: "1",
    name: "SkyLine Airways",
    iataCode: "SKY",
    contactEmail: "ops@skyline.com",
    country: "United States",
    status: "active",
    onboardingDate: "2024-01-15",
    cancelledFlights: 156,
    passengers: 12450,
    totalSpend: 2450000,
    platformRevenue: 122500,
    stripeStatus: "connected",
    allowanceBalance: 500000,
    avgCostPerPassenger: 196.79,
    failedPayments: 2,
    allocationFailures: 5,
    totalBookings: 3240,
    totalTopUps: 600000,
    walletBalance: 150000,
    creditLimit: 100000,
    creditUsed: 0,
  },
  {
    id: "2",
    name: "Atlantic Express",
    iataCode: "ATX",
    contactEmail: "support@atlanticexpress.com",
    country: "United Kingdom",
    status: "active",
    onboardingDate: "2024-02-20",
    cancelledFlights: 89,
    passengers: 7230,
    totalSpend: 1580000,
    platformRevenue: 79000,
    stripeStatus: "connected",
    allowanceBalance: 320000,
    avgCostPerPassenger: 218.53,
    failedPayments: 0,
    allocationFailures: 2,
    totalBookings: 1890,
    totalTopUps: 400000,
    walletBalance: 80000,
    creditLimit: 75000,
    creditUsed: 25000,
  },
  {
    id: "3",
    name: "Pacific Wings",
    iataCode: "PWG",
    contactEmail: "admin@pacificwings.com",
    country: "Australia",
    status: "disabled",
    onboardingDate: "2024-03-01",
    cancelledFlights: 45,
    passengers: 3120,
    totalSpend: 680000,
    platformRevenue: 34000,
    stripeStatus: "failed",
    allowanceBalance: 0,
    avgCostPerPassenger: 217.95,
    failedPayments: 8,
    allocationFailures: 12,
    totalBookings: 812,
    totalTopUps: 200000,
    walletBalance: -45000,
    creditLimit: 50000,
    creditUsed: 45000,
  },
  {
    id: "4",
    name: "Northern Star Airlines",
    iataCode: "NSA",
    contactEmail: "operations@northernstar.aero",
    country: "Canada",
    status: "active",
    onboardingDate: "2024-04-10",
    cancelledFlights: 234,
    passengers: 18900,
    totalSpend: 3890000,
    platformRevenue: 194500,
    stripeStatus: "connected",
    allowanceBalance: 750000,
    avgCostPerPassenger: 205.82,
    failedPayments: 1,
    allocationFailures: 3,
    totalBookings: 4920,
    totalTopUps: 850000,
    walletBalance: 250000,
    creditLimit: 150000,
    creditUsed: 0,
  },
  {
    id: "5",
    name: "Meridian Air",
    iataCode: "MDA",
    contactEmail: "support@meridianair.com",
    country: "Germany",
    status: "suspended",
    onboardingDate: "2024-05-05",
    cancelledFlights: 67,
    passengers: 4560,
    totalSpend: 920000,
    platformRevenue: 46000,
    stripeStatus: "pending",
    allowanceBalance: 50000,
    avgCostPerPassenger: 201.75,
    failedPayments: 15,
    allocationFailures: 20,
    totalBookings: 1190,
    totalTopUps: 300000,
    walletBalance: -120000,
    creditLimit: 150000,
    creditUsed: 120000,
  },
];

// Mock Cancelled Flights Data
const cancelledFlightsData: CancelledFlight[] = [
  {
    id: "1",
    flightNumber: "SKY1234",
    airlineId: "1",
    airlineName: "SkyLine Airways",
    departureAirport: "JFK",
    arrivalAirport: "LAX",
    scheduledDate: "2025-02-01",
    passengers: 180,
    totalCost: 35400,
    status: "completed",
  },
  {
    id: "2",
    flightNumber: "ATX567",
    airlineId: "2",
    airlineName: "Atlantic Express",
    departureAirport: "LHR",
    arrivalAirport: "CDG",
    scheduledDate: "2025-02-02",
    passengers: 95,
    totalCost: 18050,
    status: "processing",
  },
  {
    id: "3",
    flightNumber: "NSA890",
    airlineId: "4",
    airlineName: "Northern Star Airlines",
    departureAirport: "YYZ",
    arrivalAirport: "JFK",
    scheduledDate: "2025-02-03",
    passengers: 120,
    totalCost: 24000,
    status: "pending",
  },
  {
    id: "4",
    flightNumber: "SKY5678",
    airlineId: "1",
    airlineName: "SkyLine Airways",
    departureAirport: "ORD",
    arrivalAirport: "LAX",
    scheduledDate: "2025-02-03",
    passengers: 145,
    totalCost: 28710,
    status: "completed",
  },
  {
    id: "5",
    flightNumber: "MDA123",
    airlineId: "5",
    airlineName: "Meridian Air",
    departureAirport: "FRA",
    arrivalAirport: "LHR",
    scheduledDate: "2025-02-04",
    passengers: 88,
    totalCost: 17600,
    status: "failed",
  },
];

// Mock Invites Data
const invitesData: Invite[] = [
  {
    id: "1",
    airlineName: "EuroJet Airways",
    iataCode: "EJA",
    contactEmail: "onboarding@eurojet.com",
    country: "France",
    initialAllowance: 100000,
    status: "pending",
    invitedBy: "John Smith",
    invitedDate: "2025-01-28",
    expiryDate: "2025-02-28",
  },
  {
    id: "2",
    airlineName: "Coastal Airlines",
    iataCode: "CST",
    contactEmail: "admin@coastalairlines.com",
    country: "United States",
    initialAllowance: 150000,
    status: "accepted",
    invitedBy: "Sarah Johnson",
    invitedDate: "2025-01-15",
    expiryDate: "2025-02-15",
  },
  {
    id: "3",
    airlineName: "Summit Air",
    iataCode: "SUM",
    contactEmail: "ops@summitair.com",
    country: "India",
    initialAllowance: 75000,
    status: "expired",
    invitedBy: "John Smith",
    invitedDate: "2024-12-01",
    expiryDate: "2025-01-01",
  },
  {
    id: "4",
    airlineName: "Alpine Wings",
    iataCode: "AWG",
    contactEmail: "contact@alpinewings.ch",
    country: "Germany",
    initialAllowance: 120000,
    status: "revoked",
    invitedBy: "Mike Chen",
    invitedDate: "2024-11-15",
    expiryDate: "2024-12-15",
  },
  {
    id: "5",
    airlineName: "Pacific Horizon",
    iataCode: "PHZ",
    contactEmail: "admin@pacifichorizon.com",
    country: "Australia",
    initialAllowance: 200000,
    status: "pending",
    invitedBy: "Sarah Johnson",
    invitedDate: "2025-02-01",
    expiryDate: "2025-03-01",
  },
];

// Mock Wallet Transactions (NO payouts)
const walletTransactionsData: WalletTransaction[] = [
  {
    id: "1",
    airlineId: "1",
    airlineName: "SkyLine Airways",
    country: "United States",
    airport: "JFK",
    amount: 100000,
    type: "top_up",
    status: "completed",
    date: "2025-02-01",
    description: "Wallet top-up via bank transfer",
    reference: "TOP-2025-001234",
  },
  {
    id: "2",
    airlineId: "2",
    airlineName: "Atlantic Express",
    country: "United Kingdom",
    airport: "LHR",
    amount: -28000,
    type: "booking_charge",
    status: "completed",
    date: "2025-02-01",
    description: "Hotel booking - Flight ATX567 cancellation",
    reference: "BKG-2025-001235",
  },
  {
    id: "3",
    airlineId: "4",
    airlineName: "Northern Star Airlines",
    country: "Canada",
    airport: "YYZ",
    amount: 150000,
    type: "top_up",
    status: "completed",
    date: "2025-02-03",
    description: "Wallet top-up via credit card",
    reference: "TOP-2025-001236",
  },
  {
    id: "4",
    airlineId: "3",
    airlineName: "Pacific Wings",
    country: "Australia",
    airport: "SYD",
    amount: -45000,
    type: "booking_charge",
    status: "completed",
    date: "2025-01-28",
    description: "Hotel booking - Flight PWG890 cancellation (credit used)",
    reference: "BKG-2025-001230",
  },
  {
    id: "5",
    airlineId: "5",
    airlineName: "Meridian Air",
    country: "Germany",
    airport: "FRA",
    amount: 8500,
    type: "refund",
    status: "completed",
    date: "2025-01-25",
    description: "Booking cancellation refund - guest no-show",
    reference: "REF-2025-000456",
  },
  {
    id: "6",
    airlineId: "1",
    airlineName: "SkyLine Airways",
    country: "United States",
    airport: "LAX",
    amount: -35400,
    type: "booking_charge",
    status: "completed",
    date: "2025-02-01",
    description: "Hotel booking - Flight SKY1234 cancellation",
    reference: "BKG-2025-001237",
  },
  {
    id: "7",
    airlineId: "2",
    airlineName: "Atlantic Express",
    country: "United Kingdom",
    amount: 75000,
    type: "credit_change",
    status: "completed",
    date: "2025-01-10",
    description: "Admin credit limit increased",
    reference: "CRD-2025-000045",
  },
  {
    id: "8",
    airlineId: "1",
    airlineName: "SkyLine Airways",
    country: "United States",
    amount: -2250,
    type: "platform_fee",
    status: "completed",
    date: "2025-02-01",
    description: "Platform fee (5% of booking)",
    reference: "FEE-2025-001234",
  },
  {
    id: "9",
    airlineId: "4",
    airlineName: "Northern Star Airlines",
    country: "Canada",
    airport: "YYZ",
    amount: -62000,
    type: "booking_charge",
    status: "completed",
    date: "2025-02-02",
    description: "Hotel booking - Flight NSA890 cancellation",
    reference: "BKG-2025-001240",
  },
  {
    id: "10",
    airlineId: "5",
    airlineName: "Meridian Air",
    country: "Germany",
    amount: 150000,
    type: "credit_change",
    status: "completed",
    date: "2025-01-05",
    description: "Admin credit limit set to $150,000",
    reference: "CRD-2025-000050",
  },
  {
    id: "11",
    airlineId: "2",
    airlineName: "Atlantic Express",
    country: "United Kingdom",
    airport: "LHR",
    amount: -1400,
    type: "platform_fee",
    status: "completed",
    date: "2025-02-01",
    description: "Platform fee (5% of booking)",
    reference: "FEE-2025-001235",
  },
  {
    id: "12",
    airlineId: "3",
    airlineName: "Pacific Wings",
    country: "Australia",
    amount: 50000,
    type: "credit_change",
    status: "completed",
    date: "2024-12-15",
    description: "Admin credit limit set to $50,000",
    reference: "CRD-2025-000030",
  },
];

// Mock Platform Reserve Transactions
const platformReserveTransactionsData: PlatformReserveTransaction[] = [
  {
    id: "1",
    type: "PLATFORM_RESERVE_DEPOSIT",
    amount: 100000,
    adminUser: "John Smith",
    timestamp: "2025-02-01T10:30:00Z",
    reference: "RES-2025-001001",
    reason: "Initial platform reserve funding",
    status: "completed",
  },
  {
    id: "2",
    type: "PLATFORM_RESERVE_DEPOSIT",
    amount: 150000,
    adminUser: "Sarah Johnson",
    timestamp: "2025-01-15T14:20:00Z",
    reference: "RES-2025-000890",
    reason: "Q1 reserve top-up",
    status: "completed",
  },
  {
    id: "3",
    type: "PLATFORM_RESERVE_WITHDRAWAL",
    amount: 25000,
    adminUser: "Mike Chen",
    timestamp: "2025-01-10T09:15:00Z",
    reference: "RES-2025-000850",
    reason: "Emergency operational expense",
    status: "completed",
  },
  {
    id: "4",
    type: "PLATFORM_RESERVE_DEPOSIT",
    amount: 75000,
    adminUser: "John Smith",
    timestamp: "2024-12-20T11:00:00Z",
    reference: "RES-2024-000780",
    reason: "Year-end reserve adjustment",
    status: "completed",
  },
  {
    id: "5",
    type: "PLATFORM_RESERVE_WITHDRAWAL",
    amount: 50000,
    adminUser: "Sarah Johnson",
    timestamp: "2024-12-01T16:45:00Z",
    reference: "RES-2024-000720",
    reason: "Partner settlement payment",
    status: "completed",
  },
];

const auditLogsData: AuditLog[] = [
  {
    id: "1",
    timestamp: "2025-02-03T14:32:00Z",
    adminName: "John Smith",
    adminEmail: "john@flyvoid.com",
    action: "Disabled Airline",
    entity: "Airline",
    entityId: "3",
    details: "Disabled Pacific Wings due to credit limit exceeded",
  },
  {
    id: "2",
    timestamp: "2025-02-03T12:15:00Z",
    adminName: "Sarah Johnson",
    adminEmail: "sarah@flyvoid.com",
    action: "Updated Settings",
    entity: "SystemSettings",
    entityId: "1",
    details: "Changed platform fee from 4.5% to 5%",
  },
  {
    id: "3",
    timestamp: "2025-02-02T16:45:00Z",
    adminName: "John Smith",
    adminEmail: "john@flyvoid.com",
    action: "Sent Invite",
    entity: "Invite",
    entityId: "1",
    details: "Sent onboarding invite to EuroJet Airways",
  },
  {
    id: "4",
    timestamp: "2025-02-02T09:30:00Z",
    adminName: "Mike Chen",
    adminEmail: "mike@flyvoid.com",
    action: "Increased Credit Limit",
    entity: "Airline",
    entityId: "5",
    details: "Increased Meridian Air credit limit to $150,000",
  },
  {
    id: "5",
    timestamp: "2025-02-01T11:00:00Z",
    adminName: "Sarah Johnson",
    adminEmail: "sarah@flyvoid.com",
    action: "Processed Top-up",
    entity: "Transaction",
    entityId: "1",
    details: "Processed $100,000 top-up for SkyLine Airways",
  },
];

// Dashboard Stats
const dashboardStatsData: DashboardStats = {
  totalAirlines: 5,
  activeAirlines: 3,
  cancelledFlightsThisMonth: 47,
  platformRevenue: 476000,
  totalHotelSpend: 9520000,
  revenueToSpendRatio: 0.05,
  avgRevenuePerAirline: 95200,
  topAirlineByRevenue: "Northern Star Airlines",
  airlineGrowthPercent: 12,
  flightChangePercent: -36,
  revenueChangePercent: 18,
  monthlyCancellations: [
    { month: "Sep", count: 42 },
    { month: "Oct", count: 58 },
    { month: "Nov", count: 51 },
    { month: "Dec", count: 67 },
    { month: "Jan", count: 73 },
    { month: "Feb", count: 47 },
  ],
  monthlyRevenue: [
    { month: "Sep", revenue: 68000 },
    { month: "Oct", revenue: 82000 },
    { month: "Nov", revenue: 75000 },
    { month: "Dec", revenue: 94000 },
    { month: "Jan", revenue: 112000 },
    { month: "Feb", revenue: 45000 },
  ],
};

// System Settings
const systemSettingsData: SystemSettings = {
  platformFeePercent: 5,
  defaultAllowanceLimit: 100000,
  maxAllowanceLimit: 1000000,
  defaultCurrency: "USD",
  defaultHotelRules: {
    maxStarRating: 4,
    maxDistanceKm: 15,
    maxPricePerNight: 200,
  },
};

// Admin Profile
const adminProfileData: AdminProfile = {
  id: "1",
  name: "John Smith",
  email: "john@flyvoid.com",
  role: "platform_admin",
  createdAt: "2024-01-01",
  lastLogin: "2025-02-03T14:00:00Z",
  notificationPreferences: {
    emailAlerts: true,
    systemAlerts: true,
    weeklyReports: true,
  },
};

// Service Functions
export const getAirlines = async (): Promise<Airline[]> => {
  await delay(300);
  return airlinesData;
};

export const getAirlineById = async (id: string): Promise<Airline | undefined> => {
  await delay(200);
  return airlinesData.find(a => a.id === id);
};

export const updateAirlineStatus = async (id: string, status: Airline["status"]): Promise<Airline> => {
  await delay(300);
  const airline = airlinesData.find(a => a.id === id);
  if (!airline) throw new Error("Airline not found");
  airline.status = status;
  return airline;
};

export const getCancelledFlights = async (): Promise<CancelledFlight[]> => {
  await delay(300);
  return cancelledFlightsData;
};

export const getInvites = async (): Promise<Invite[]> => {
  await delay(300);
  return invitesData;
};

export const createInvite = async (invite: Partial<Invite> & Pick<Invite, "airlineName" | "iataCode" | "contactEmail" | "country">): Promise<Invite> => {
  await delay(300);
  const newInvite: Invite = {
    initialAllowance: 100000,
    creditLimit: invite.creditLimit ?? 100000,
    ...invite,
    id: String(invitesData.length + 1),
    status: "pending",
    invitedBy: "John Smith",
    invitedDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  } as Invite;
  invitesData.push(newInvite);
  return newInvite;
};

export const updateInvite = async (id: string, patch: Partial<Invite>): Promise<Invite> => {
  await delay(250);
  const invite = invitesData.find((i) => i.id === id);
  if (!invite) throw new Error("Invite not found");
  Object.assign(invite, patch);
  return invite;
};

export const updateAirline = async (id: string, patch: Partial<Airline>): Promise<Airline> => {
  await delay(250);
  const airline = airlinesData.find((a) => a.id === id);
  if (!airline) throw new Error("Airline not found");
  Object.assign(airline, patch);
  return airline;
};

export const resendInvite = async (id: string): Promise<Invite> => {
  await delay(300);
  const invite = invitesData.find(i => i.id === id);
  if (!invite) throw new Error("Invite not found");
  invite.status = "pending";
  invite.invitedDate = new Date().toISOString().split("T")[0];
  invite.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  return invite;
};

export const revokeInvite = async (id: string): Promise<Invite> => {
  await delay(300);
  const invite = invitesData.find(i => i.id === id);
  if (!invite) throw new Error("Invite not found");
  invite.status = "revoked";
  return invite;
};

export const getCountries = async (): Promise<string[]> => {
  await delay(100);
  return countriesData;
};

export const getAirports = async (): Promise<Airport[]> => {
  await delay(100);
  return airportsData;
};

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  await delay(300);
  return auditLogsData;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  await delay(300);
  return dashboardStatsData;
};

export const getSystemSettings = async (): Promise<SystemSettings> => {
  await delay(200);
  return systemSettingsData;
};

export const updateSystemSettings = async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
  await delay(300);
  Object.assign(systemSettingsData, settings);
  return systemSettingsData;
};

export const getAdminProfile = async (): Promise<AdminProfile> => {
  await delay(200);
  return adminProfileData;
};

export const updateAdminProfile = async (profile: Partial<AdminProfile>): Promise<AdminProfile> => {
  await delay(300);
  Object.assign(adminProfileData, profile);
  return adminProfileData;
};

// Helper function to determine airline financial status
const getAirlineFinancialStatus = (airline: Airline): AirlineFinancialStatus => {
  if (airline.walletBalance >= 0 && airline.creditUsed === 0) {
    return "healthy";
  }
  if (airline.creditUsed > 0 && airline.creditUsed < airline.creditLimit * 0.8) {
    return "using_credit";
  }
  if (airline.creditUsed >= airline.creditLimit * 0.8) {
    return "critical";
  }
  if (airline.walletBalance <= 0 && airline.creditUsed === 0) {
    return "topup_required";
  }
  return "using_credit";
};

// Platform Financial Snapshot
export const getPlatformFinancialSnapshot = async (filters?: PaymentFilters): Promise<PlatformFinancialSnapshot> => {
  await delay(200);
  
  let filteredAirlines = [...airlinesData];
  
  if (filters?.country && filters.country !== "all") {
    filteredAirlines = filteredAirlines.filter(a => a.country === filters.country);
  }
  if (filters?.airline && filters.airline !== "all") {
    filteredAirlines = filteredAirlines.filter(a => a.id === filters.airline);
  }
  if (filters?.airport && filters.airport !== "all") {
    const airport = airportsData.find(ap => ap.code === filters.airport);
    if (airport) {
      filteredAirlines = filteredAirlines.filter(a => a.country === airport.country);
    }
  }
  
  const totalTopUpBalance = filteredAirlines.reduce((sum, a) => sum + Math.max(0, a.walletBalance), 0);
  const totalAdminCreditIssued = filteredAirlines.reduce((sum, a) => sum + a.creditLimit, 0);
  const totalCreditUsed = filteredAirlines.reduce((sum, a) => sum + a.creditUsed, 0);
  const totalPlatformRevenue = filteredAirlines.reduce((sum, a) => sum + a.platformRevenue, 0);
  
  return {
    totalTopUpBalance,
    totalAdminCreditIssued,
    totalCreditUsed,
    netPlatformExposure: totalCreditUsed - totalTopUpBalance,
    totalPlatformRevenue,
    revenueChangePercent: 18,
  };
};

// Credit Risk Overview
export const getCreditRiskOverview = async (filters?: PaymentFilters): Promise<CreditRiskOverview> => {
  await delay(200);
  
  let filteredAirlines = [...airlinesData];
  
  if (filters?.country && filters.country !== "all") {
    filteredAirlines = filteredAirlines.filter(a => a.country === filters.country);
  }
  if (filters?.airline && filters.airline !== "all") {
    filteredAirlines = filteredAirlines.filter(a => a.id === filters.airline);
  }
  
  const totalCreditAllowed = filteredAirlines.reduce((sum, a) => sum + a.creditLimit, 0);
  const totalCreditUsed = filteredAirlines.reduce((sum, a) => sum + a.creditUsed, 0);
  const airlinesUsingCredit = filteredAirlines.filter(a => a.creditUsed > 0).length;
  
  return {
    totalCreditAllowed,
    totalCreditUsed,
    creditUtilizationPercent: totalCreditAllowed > 0 ? (totalCreditUsed / totalCreditAllowed) * 100 : 0,
    airlinesUsingCredit,
    totalAirlines: filteredAirlines.length,
  };
};

// Airline Financial Health Table
export const getAirlineFinancialHealth = async (filters?: PaymentFilters): Promise<AirlineFinancialHealth[]> => {
  await delay(300);
  
  let filteredAirlines = [...airlinesData];
  
  if (filters?.country && filters.country !== "all") {
    filteredAirlines = filteredAirlines.filter(a => a.country === filters.country);
  }
  if (filters?.airline && filters.airline !== "all") {
    filteredAirlines = filteredAirlines.filter(a => a.id === filters.airline);
  }
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredAirlines = filteredAirlines.filter(a => 
      a.name.toLowerCase().includes(searchLower) ||
      a.iataCode.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredAirlines.map(airline => ({
    airlineId: airline.id,
    airlineName: airline.name,
    iataCode: airline.iataCode,
    country: airline.country,
    totalTopUps: airline.totalTopUps,
    totalBookingSpend: airline.totalSpend,
    platformRevenue: airline.platformRevenue,
    walletBalance: airline.walletBalance,
    creditLimit: airline.creditLimit,
    creditUsed: airline.creditUsed,
    remainingCredit: airline.creditLimit - airline.creditUsed,
    status: getAirlineFinancialStatus(airline),
  }));
};

// Revenue by Airline
export const getRevenueByAirline = async (filters?: PaymentFilters): Promise<RevenueByAirline[]> => {
  await delay(200);
  
  let filteredAirlines = [...airlinesData];
  
  if (filters?.country && filters.country !== "all") {
    filteredAirlines = filteredAirlines.filter(a => a.country === filters.country);
  }
  if (filters?.airline && filters.airline !== "all") {
    filteredAirlines = filteredAirlines.filter(a => a.id === filters.airline);
  }
  
  const totalRevenue = filteredAirlines.reduce((sum, a) => sum + a.platformRevenue, 0);
  
  return filteredAirlines
    .map(airline => ({
      airlineId: airline.id,
      airlineName: airline.name,
      iataCode: airline.iataCode,
      country: airline.country,
      revenue: airline.platformRevenue,
      percentage: totalRevenue > 0 ? (airline.platformRevenue / totalRevenue) * 100 : 0,
      totalBookings: airline.totalBookings,
    }))
    .sort((a, b) => b.revenue - a.revenue);
};

// Revenue by Country
export const getRevenueByCountry = async (filters?: PaymentFilters): Promise<RevenueByCountry[]> => {
  await delay(200);
  
  let filteredAirlines = [...airlinesData];
  
  if (filters?.country && filters.country !== "all") {
    filteredAirlines = filteredAirlines.filter(a => a.country === filters.country);
  }
  if (filters?.airport && filters.airport !== "all") {
    const airport = airportsData.find(ap => ap.code === filters.airport);
    if (airport) {
      filteredAirlines = filteredAirlines.filter(a => a.country === airport.country);
    }
  }
  
  const countryMap = new Map<string, { airlines: Set<string>; revenue: number }>();
  
  filteredAirlines.forEach(airline => {
    const existing = countryMap.get(airline.country);
    if (existing) {
      existing.airlines.add(airline.id);
      existing.revenue += airline.platformRevenue;
    } else {
      countryMap.set(airline.country, {
        airlines: new Set([airline.id]),
        revenue: airline.platformRevenue,
      });
    }
  });

  const totalRevenue = filteredAirlines.reduce((sum, a) => sum + a.platformRevenue, 0);
  
  return Array.from(countryMap.entries())
    .map(([country, data]) => ({
      country,
      airlinesCount: data.airlines.size,
      revenue: data.revenue,
      percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
};

// Wallet Transactions
export const getWalletTransactions = async (filters?: PaymentFilters): Promise<WalletTransaction[]> => {
  await delay(300);
  
  let filteredTransactions = [...walletTransactionsData];
  
  if (filters?.country && filters.country !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.country === filters.country);
  }
  if (filters?.airline && filters.airline !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.airlineId === filters.airline);
  }
  if (filters?.airport && filters.airport !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.airport === filters.airport);
  }
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredTransactions = filteredTransactions.filter(t => 
      t.airlineName.toLowerCase().includes(searchLower) ||
      t.reference.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Combined filtered payment data for the Payments page
export const getFilteredPaymentData = async (filters: PaymentFilters) => {
  await delay(400);
  
  const [
    snapshot,
    creditRisk,
    revenueByAirline,
    revenueByCountry,
    airlineHealth,
    transactions
  ] = await Promise.all([
    getPlatformFinancialSnapshot(filters),
    getCreditRiskOverview(filters),
    getRevenueByAirline(filters),
    getRevenueByCountry(filters),
    getAirlineFinancialHealth(filters),
    getWalletTransactions(filters),
  ]);
  
  return {
    snapshot,
    creditRisk,
    revenueByAirline,
    revenueByCountry,
    airlineHealth,
    transactions,
  };
};

// Get airline transaction detail
export const getAirlineTransactionDetail = async (airlineId: string): Promise<WalletTransaction[]> => {
  await delay(200);
  return walletTransactionsData.filter(t => t.airlineId === airlineId);
};

// Platform Treasury Summary
export const getPlatformTreasurySummary = async (): Promise<PlatformTreasurySummary> => {
  await delay(200);
  
  const totalDeposited = platformReserveTransactionsData
    .filter(t => t.type === "PLATFORM_RESERVE_DEPOSIT")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawn = platformReserveTransactionsData
    .filter(t => t.type === "PLATFORM_RESERVE_WITHDRAWAL")
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    currentBalance: totalDeposited - totalWithdrawn,
    totalDeposited,
    totalWithdrawn,
  };
};

// Platform Reserve Transactions
export const getPlatformReserveTransactions = async (dateRange?: string): Promise<PlatformReserveTransaction[]> => {
  await delay(300);
  return platformReserveTransactionsData.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Add Platform Reserve Transaction
export const addPlatformReserveTransaction = async (
  type: "PLATFORM_RESERVE_DEPOSIT" | "PLATFORM_RESERVE_WITHDRAWAL",
  amount: number,
  reason: string
): Promise<PlatformReserveTransaction> => {
  await delay(300);
  
  const newTransaction: PlatformReserveTransaction = {
    id: String(platformReserveTransactionsData.length + 1),
    type,
    amount,
    adminUser: "John Smith", // Would come from auth context
    timestamp: new Date().toISOString(),
    reference: `RES-${new Date().getFullYear()}-${String(platformReserveTransactionsData.length + 1).padStart(6, "0")}`,
    reason,
    status: "completed",
  };
  
  platformReserveTransactionsData.unshift(newTransaction);
  return newTransaction;
};
