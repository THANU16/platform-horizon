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
  BillingTransaction,
  PaymentFilters,
  Airport,
  AirlineFinancialStatus,
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

// Mock Airlines Data with service-fee billing model
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
    totalBookingValue: 2450000,
    platformRevenue: 122500,
    stripeStatus: "connected",
    avgCostPerPassenger: 196.79,
    failedPayments: 2,
    allocationFailures: 5,
    totalBookings: 3240,
    platformFeesBilled: 122500,
    paymentsReceived: 122500,
    outstandingBalance: 0,
    creditLimit: 100000,
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
    totalBookingValue: 1580000,
    platformRevenue: 79000,
    stripeStatus: "connected",
    avgCostPerPassenger: 218.53,
    failedPayments: 0,
    allocationFailures: 2,
    totalBookings: 1890,
    platformFeesBilled: 79000,
    paymentsReceived: 54000,
    outstandingBalance: 25000,
    creditLimit: 75000,
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
    totalBookingValue: 680000,
    platformRevenue: 34000,
    stripeStatus: "failed",
    avgCostPerPassenger: 217.95,
    failedPayments: 8,
    allocationFailures: 12,
    totalBookings: 812,
    platformFeesBilled: 34000,
    paymentsReceived: 0,
    outstandingBalance: 34000,
    creditLimit: 50000,
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
    totalBookingValue: 3890000,
    platformRevenue: 194500,
    stripeStatus: "connected",
    avgCostPerPassenger: 205.82,
    failedPayments: 1,
    allocationFailures: 3,
    totalBookings: 4920,
    platformFeesBilled: 194500,
    paymentsReceived: 194500,
    outstandingBalance: 0,
    creditLimit: 150000,
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
    totalBookingValue: 920000,
    platformRevenue: 46000,
    stripeStatus: "pending",
    avgCostPerPassenger: 201.75,
    failedPayments: 15,
    allocationFailures: 20,
    totalBookings: 1190,
    platformFeesBilled: 46000,
    paymentsReceived: 0,
    outstandingBalance: 46000,
    creditLimit: 40000,
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
    status: "pending",
    invitedBy: "Sarah Johnson",
    invitedDate: "2025-02-01",
    expiryDate: "2025-03-01",
  },
];

// Mock Billing Transactions (platform fees & settlements only)
const billingTransactionsData: BillingTransaction[] = [
  {
    id: "1",
    airlineId: "1",
    airlineName: "SkyLine Airways",
    country: "United States",
    airport: "JFK",
    amount: 1770,
    type: "platform_fee",
    status: "completed",
    date: "2025-02-01",
    description: "Service fee - Flight SKY1234 disruption (180 passengers)",
    reference: "FEE-2025-001234",
  },
  {
    id: "2",
    airlineId: "1",
    airlineName: "SkyLine Airways",
    country: "United States",
    amount: -100000,
    type: "fee_payment",
    status: "completed",
    date: "2025-02-02",
    description: "Service fee settlement via bank transfer",
    reference: "PAY-2025-001234",
  },
  {
    id: "3",
    airlineId: "2",
    airlineName: "Atlantic Express",
    country: "United Kingdom",
    airport: "LHR",
    amount: 1400,
    type: "platform_fee",
    status: "completed",
    date: "2025-02-01",
    description: "Service fee - Flight ATX567 disruption (95 passengers)",
    reference: "FEE-2025-001235",
  },
  {
    id: "4",
    airlineId: "2",
    airlineName: "Atlantic Express",
    country: "United Kingdom",
    amount: -54000,
    type: "fee_payment",
    status: "completed",
    date: "2025-01-20",
    description: "Partial settlement of outstanding platform fees",
    reference: "PAY-2025-001120",
  },
  {
    id: "5",
    airlineId: "3",
    airlineName: "Pacific Wings",
    country: "Australia",
    airport: "SYD",
    amount: 2250,
    type: "platform_fee",
    status: "pending",
    date: "2025-01-28",
    description: "Service fee - Flight PWG890 disruption",
    reference: "FEE-2025-001230",
  },
  {
    id: "6",
    airlineId: "4",
    airlineName: "Northern Star Airlines",
    country: "Canada",
    airport: "YYZ",
    amount: 3100,
    type: "platform_fee",
    status: "completed",
    date: "2025-02-02",
    description: "Service fee - Flight NSA890 disruption",
    reference: "FEE-2025-001240",
  },
  {
    id: "7",
    airlineId: "4",
    airlineName: "Northern Star Airlines",
    country: "Canada",
    amount: -150000,
    type: "fee_payment",
    status: "completed",
    date: "2025-02-03",
    description: "Service fee settlement via credit card",
    reference: "PAY-2025-001236",
  },
  {
    id: "8",
    airlineId: "5",
    airlineName: "Meridian Air",
    country: "Germany",
    airport: "FRA",
    amount: -850,
    type: "fee_adjustment",
    status: "completed",
    date: "2025-01-25",
    description: "Service fee waived - duplicate disruption record",
    reference: "ADJ-2025-000456",
  },
  {
    id: "9",
    airlineId: "2",
    airlineName: "Atlantic Express",
    country: "United Kingdom",
    amount: 75000,
    type: "credit_change",
    status: "completed",
    date: "2025-01-10",
    description: "Credit limit (max outstanding fees) increased",
    reference: "CRD-2025-000045",
  },
  {
    id: "10",
    airlineId: "5",
    airlineName: "Meridian Air",
    country: "Germany",
    amount: 40000,
    type: "credit_change",
    status: "completed",
    date: "2025-01-05",
    description: "Credit limit set to $40,000",
    reference: "CRD-2025-000050",
  },
  {
    id: "11",
    airlineId: "5",
    airlineName: "Meridian Air",
    country: "Germany",
    airport: "FRA",
    amount: 4600,
    type: "platform_fee",
    status: "failed",
    date: "2025-02-01",
    description: "Service fee billing failed - credit limit exceeded",
    reference: "FEE-2025-001260",
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
    description: "Credit limit set to $50,000",
    reference: "CRD-2025-000030",
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
    action: "Approved Payment",
    entity: "Transaction",
    entityId: "1",
    details: "Approved $100,000 bank transfer payment for SkyLine Airways",
  },
];

// Dashboard Stats
const dashboardStatsData: DashboardStats = {
  totalAirlines: 5,
  activeAirlines: 3,
  cancelledFlightsThisMonth: 47,
  platformRevenue: 476000,
  outstandingPlatformFees: 105000,
  paymentsReceived: 371000,
  outstandingReceivables: 105000,
  totalCreditIssued: 410000,
  creditUtilizationPercent: 25.6,
  feeCollectionRate: 0.78,

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
  defaultPlatformFeePercent: 5,
  defaultCreditLimit: 100000,
  maxCreditLimit: 1000000,

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

// Helper: apply shared filters to airlines
const filterAirlines = (filters?: PaymentFilters) => {
  let result = [...airlinesData];

  if (filters?.country && filters.country !== "all") {
    result = result.filter(a => a.country === filters.country);
  }
  if (filters?.airline && filters.airline !== "all") {
    result = result.filter(a => a.id === filters.airline);
  }
  if (filters?.airport && filters.airport !== "all") {
    const airport = airportsData.find(ap => ap.code === filters.airport);
    if (airport) {
      result = result.filter(a => a.country === airport.country);
    }
  }
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(a =>
      a.name.toLowerCase().includes(searchLower) ||
      a.iataCode.toLowerCase().includes(searchLower)
    );
  }
  return result;
};

// Helper: billing status based on outstanding platform fees vs credit limit
const getAirlineFinancialStatus = (airline: Airline): AirlineFinancialStatus => {
  const outstanding = airline.outstandingBalance;
  if (outstanding <= 0) return "settled";
  if (airline.creditLimit <= 0) return "credit_exceeded";

  const utilization = outstanding / airline.creditLimit;
  if (utilization >= 1) return "credit_exceeded";
  if (utilization >= 0.8) return "credit_warning";
  return "outstanding";
};

// Platform Financial Snapshot
export const getPlatformFinancialSnapshot = async (filters?: PaymentFilters): Promise<PlatformFinancialSnapshot> => {
  await delay(200);

  const filteredAirlines = filterAirlines(filters);

  const totalPlatformFeesBilled = filteredAirlines.reduce((sum, a) => sum + a.platformFeesBilled, 0);
  const totalPaymentsReceived = filteredAirlines.reduce((sum, a) => sum + a.paymentsReceived, 0);
  const totalOutstandingFees = filteredAirlines.reduce((sum, a) => sum + a.outstandingBalance, 0);
  const totalCreditIssued = filteredAirlines.reduce((sum, a) => sum + a.creditLimit, 0);
  const totalPlatformRevenue = filteredAirlines.reduce((sum, a) => sum + a.platformRevenue, 0);

  return {
    totalPlatformFeesBilled,
    totalPaymentsReceived,
    totalOutstandingFees,
    totalCreditIssued,
    creditUtilizationPercent: totalCreditIssued > 0 ? (totalOutstandingFees / totalCreditIssued) * 100 : 0,
    totalPlatformRevenue,
    revenueChangePercent: 18,
  };
};

// Credit Risk Overview
export const getCreditRiskOverview = async (filters?: PaymentFilters): Promise<CreditRiskOverview> => {
  await delay(200);

  const filteredAirlines = filterAirlines(filters);

  const totalCreditAllowed = filteredAirlines.reduce((sum, a) => sum + a.creditLimit, 0);
  const totalOutstandingFees = filteredAirlines.reduce((sum, a) => sum + a.outstandingBalance, 0);
  const airlinesWithOutstandingFees = filteredAirlines.filter(a => a.outstandingBalance > 0).length;

  return {
    totalCreditAllowed,
    totalOutstandingFees,
    creditUtilizationPercent: totalCreditAllowed > 0 ? (totalOutstandingFees / totalCreditAllowed) * 100 : 0,
    airlinesWithOutstandingFees,
    totalAirlines: filteredAirlines.length,
  };
};

// Airline Billing Health Table
export const getAirlineFinancialHealth = async (filters?: PaymentFilters): Promise<AirlineFinancialHealth[]> => {
  await delay(300);

  return filterAirlines(filters).map(airline => ({
    airlineId: airline.id,
    airlineName: airline.name,
    iataCode: airline.iataCode,
    country: airline.country,
    totalBookings: airline.totalBookings,
    totalBookingValue: airline.totalBookingValue,
    platformFeePercent: airline.platformFeePercent,
    platformFeesBilled: airline.platformFeesBilled,
    paymentsReceived: airline.paymentsReceived,
    outstandingBalance: airline.outstandingBalance,
    platformRevenue: airline.platformRevenue,
    creditLimit: airline.creditLimit,
    remainingCredit: Math.max(0, airline.creditLimit - airline.outstandingBalance),
    status: getAirlineFinancialStatus(airline),
  }));
};

// Revenue by Airline
export const getRevenueByAirline = async (filters?: PaymentFilters): Promise<RevenueByAirline[]> => {
  await delay(200);

  const filteredAirlines = filterAirlines(filters);
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

  const filteredAirlines = filterAirlines(filters);
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

// Billing Transactions (platform fees, settlements & credit changes)
export const getBillingTransactions = async (filters?: PaymentFilters): Promise<BillingTransaction[]> => {
  await delay(300);

  let filteredTransactions = [...billingTransactionsData];

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
    getBillingTransactions(filters),
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
export const getAirlineTransactionDetail = async (airlineId: string): Promise<BillingTransaction[]> => {
  await delay(200);
  return billingTransactionsData.filter(t => t.airlineId === airlineId);
};

// Record a platform fee settlement from an airline
export const recordFeePayment = async (airlineId: string, amount: number): Promise<Airline> => {
  await delay(300);
  const airline = airlinesData.find(a => a.id === airlineId);
  if (!airline) throw new Error("Airline not found");
  airline.paymentsReceived += amount;
  airline.outstandingBalance = Math.max(0, airline.platformFeesBilled - airline.paymentsReceived);
  return airline;
};


// Seed extended airline/invite profile defaults
(() => {
  airlinesData.forEach((a) => {
    a.companyRegistrationNumber = a.companyRegistrationNumber ?? `REG-${a.iataCode}-${1000 + Number(a.id)}`;
    a.website = a.website ?? `https://www.${a.iataCode.toLowerCase()}.example.com`;
    a.contactPhone = a.contactPhone ?? "+1 555 010 0000";
    a.timezone = a.timezone ?? "UTC";
    a.logo = a.logo ?? "";
    a.address = a.address ?? "1 Aviation Way, Terminal 1";
    a.currency = a.currency ?? "USD";
    a.adminFirstName = a.adminFirstName ?? "Operations";
    a.adminLastName = a.adminLastName ?? "Admin";
    a.adminEmail = a.adminEmail ?? a.contactEmail;
    a.jobTitle = a.jobTitle ?? "Operations Manager";
  });
  const feePercents = [5, 4.5, 6, 5.5, 4];
  airlinesData.forEach((a, idx) => {
    a.platformFeePercent = a.platformFeePercent ?? feePercents[idx % feePercents.length];
  });
  invitesData.forEach((i) => {
    i.companyRegistrationNumber = i.companyRegistrationNumber ?? `REG-${i.iataCode}-${2000 + Number(i.id)}`;
    i.website = i.website ?? "";
    i.contactPhone = i.contactPhone ?? "+1 555 020 0000";
    i.timezone = i.timezone ?? "UTC";
    i.logo = i.logo ?? "";
    i.address = i.address ?? "Headquarters address";
    i.currency = i.currency ?? "USD";
    i.adminFirstName = i.adminFirstName ?? "New";
    i.adminLastName = i.adminLastName ?? "Admin";
    i.adminEmail = i.adminEmail ?? i.contactEmail;
    i.jobTitle = i.jobTitle ?? "Operations Manager";
    i.creditLimit = i.creditLimit ?? 100000;
    i.platformFeePercent = i.platformFeePercent ?? 5;
  });
})();


// ==================== Payment Approvals (settlement of platform fees) ====================
const paymentApprovalsData: PaymentApproval[] = [
  {
    id: "pa-1",
    airlineId: "1",
    airlineName: "SkyLine Airways",
    country: "United States",
    amount: 45000,
    method: "bank_transfer",
    status: "pending",
    submittedAt: "2025-02-18T09:24:00Z",
    referenceNumber: "TRF-8845-2201",
    receiptUrl: "https://example.com/receipts/TRF-8845-2201.pdf",
    bankName: "First National Bank",
    notes: "Settlement for January platform fees",
  },
  {
    id: "pa-2",
    airlineId: "3",
    airlineName: "Pacific Wings",
    country: "Australia",
    amount: 18750,
    method: "bank_transfer",
    status: "pending",
    submittedAt: "2025-02-17T14:10:00Z",
    referenceNumber: "TRF-2210-9931",
    receiptUrl: "https://example.com/receipts/TRF-2210-9931.pdf",
    bankName: "Commonwealth Bank",
  },
  {
    id: "pa-3",
    airlineId: "2",
    airlineName: "EuroConnect",
    country: "Germany",
    amount: 32000,
    method: "credit_card",
    status: "approved",
    submittedAt: "2025-02-12T08:00:00Z",
    reviewedAt: "2025-02-12T08:01:00Z",
    referenceNumber: "CARD-4412-7781",
  },
  {
    id: "pa-4",
    airlineId: "4",
    airlineName: "Northern Star Airlines",
    country: "Canada",
    amount: 9500,
    method: "bank_transfer",
    status: "rejected",
    submittedAt: "2025-02-08T11:30:00Z",
    reviewedAt: "2025-02-09T10:00:00Z",
    referenceNumber: "TRF-7781-0042",
    receiptUrl: "https://example.com/receipts/TRF-7781-0042.pdf",
    bankName: "Royal Bank of Canada",
    rejectionReason: "Receipt amount did not match the reference number",
  },
];

export const getPaymentApprovals = async (): Promise<PaymentApproval[]> => {
  await delay(250);
  return [...paymentApprovalsData];
};

export const approvePayment = async (id: string): Promise<PaymentApproval | null> => {
  await delay(300);
  const approval = paymentApprovalsData.find((p) => p.id === id);
  if (!approval || approval.status !== "pending") return null;
  approval.status = "approved";
  approval.reviewedAt = new Date().toISOString();

  // Settling a payment reduces the airline outstanding balance
  const airline = airlinesData.find((a) => a.id === approval.airlineId);
  if (airline) {
    airline.paymentsReceived += approval.amount;
    airline.outstandingBalance = Math.max(0, airline.outstandingBalance - approval.amount);
  }
  return { ...approval };
};

export const rejectPayment = async (id: string, reason: string): Promise<PaymentApproval | null> => {
  await delay(300);
  const approval = paymentApprovalsData.find((p) => p.id === id);
  if (!approval || approval.status !== "pending") return null;
  approval.status = "rejected";
  approval.rejectionReason = reason;
  approval.reviewedAt = new Date().toISOString();
  return { ...approval };
};
