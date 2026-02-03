import { Airline, CancelledFlight, Invite, Payment, AuditLog, DashboardStats, SystemSettings, AdminProfile } from "@/types";

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Airlines Data
const airlinesData: Airline[] = [
  {
    id: "1",
    name: "SkyLine Airways",
    iataCode: "SKY",
    contactEmail: "ops@skyline.com",
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
  },
  {
    id: "2",
    name: "Atlantic Express",
    iataCode: "ATX",
    contactEmail: "support@atlanticexpress.com",
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
  },
  {
    id: "3",
    name: "Pacific Wings",
    iataCode: "PWG",
    contactEmail: "admin@pacificwings.com",
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
  },
  {
    id: "4",
    name: "Northern Star Airlines",
    iataCode: "NSA",
    contactEmail: "operations@northernstar.aero",
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
  },
  {
    id: "5",
    name: "Meridian Air",
    iataCode: "MDA",
    contactEmail: "support@meridianair.com",
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
    departureAirport: "SFO",
    arrivalAirport: "SEA",
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
    arrivalAirport: "DFW",
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
    departureAirport: "MIA",
    arrivalAirport: "ATL",
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
    initialAllowance: 100000,
    status: "sent",
    sentDate: "2025-01-28",
    expiresAt: "2025-02-28",
  },
  {
    id: "2",
    airlineName: "Coastal Airlines",
    iataCode: "CST",
    contactEmail: "admin@coastalairlines.com",
    initialAllowance: 150000,
    status: "accepted",
    sentDate: "2025-01-15",
    expiresAt: "2025-02-15",
  },
  {
    id: "3",
    airlineName: "Summit Air",
    iataCode: "SUM",
    contactEmail: "ops@summitair.com",
    initialAllowance: 75000,
    status: "expired",
    sentDate: "2024-12-01",
    expiresAt: "2025-01-01",
  },
];

// Mock Payments Data
const paymentsData: Payment[] = [
  {
    id: "1",
    airlineId: "1",
    airlineName: "SkyLine Airways",
    amount: 45000,
    type: "payout",
    status: "completed",
    date: "2025-02-01",
    description: "Monthly platform payout",
  },
  {
    id: "2",
    airlineId: "2",
    airlineName: "Atlantic Express",
    amount: 28000,
    type: "payout",
    status: "completed",
    date: "2025-02-01",
    description: "Monthly platform payout",
  },
  {
    id: "3",
    airlineId: "4",
    airlineName: "Northern Star Airlines",
    amount: 62000,
    type: "payout",
    status: "pending",
    date: "2025-02-03",
    description: "Pending platform payout",
  },
  {
    id: "4",
    airlineId: "3",
    airlineName: "Pacific Wings",
    amount: 15000,
    type: "payout",
    status: "failed",
    date: "2025-01-28",
    description: "Payment failed - Stripe disconnected",
  },
  {
    id: "5",
    airlineId: "5",
    airlineName: "Meridian Air",
    amount: 8500,
    type: "refund",
    status: "completed",
    date: "2025-01-25",
    description: "Booking cancellation refund",
  },
];

// Mock Audit Logs Data
const auditLogsData: AuditLog[] = [
  {
    id: "1",
    timestamp: "2025-02-03T14:32:00Z",
    adminName: "John Smith",
    adminEmail: "john@flyvoid.com",
    action: "Disabled Airline",
    entity: "Airline",
    entityId: "3",
    details: "Disabled Pacific Wings due to payment failures",
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
    action: "Suspended Airline",
    entity: "Airline",
    entityId: "5",
    details: "Suspended Meridian Air - excessive allocation failures",
  },
  {
    id: "5",
    timestamp: "2025-02-01T11:00:00Z",
    adminName: "Sarah Johnson",
    adminEmail: "sarah@flyvoid.com",
    action: "Approved Payout",
    entity: "Payment",
    entityId: "1",
    details: "Approved monthly payout for SkyLine Airways",
  },
];

// Dashboard Stats
const dashboardStatsData: DashboardStats = {
  totalAirlines: 5,
  activeAirlines: 3,
  cancelledFlightsThisMonth: 47,
  passengersImpacted: 3820,
  platformRevenue: 476000,
  totalHotelSpend: 9520000,
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

export const createInvite = async (invite: Omit<Invite, "id" | "status" | "sentDate" | "expiresAt">): Promise<Invite> => {
  await delay(300);
  const newInvite: Invite = {
    ...invite,
    id: String(invitesData.length + 1),
    status: "sent",
    sentDate: new Date().toISOString().split("T")[0],
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  };
  invitesData.push(newInvite);
  return newInvite;
};

export const getPayments = async (): Promise<Payment[]> => {
  await delay(300);
  return paymentsData;
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
