import { getAirlines, getCancelledFlights } from "@/services/api";

export type BookingStatus = "completed" | "pending" | "failed";

export interface Booking {
  id: string;
  airlineId: string;
  airlineCode: string;
  airlineName: string;
  country: string;
  vendor: string;
  departure: string;
  hotelName: string;
  passengers: number;
  rooms: number;
  hotelCost: number;
  hotelTax: number;
  platformFee: number;
  hotelCommission: number;
  discount: number;
  totalCost: number;
  earnings: number;
  status: BookingStatus;
  createdAt: string;
  flight: { id: string; flightNumber: string; departure: string; arrival: string; scheduledDate: string };
  technical: {
    requestId: string;
    vendor: string;
    vendorBookingStatus: string;
    vendorReference: string;
    transferReference: string;
    completedAt?: string;
    failedAt?: string;
    failureReason?: string;
  };
}

const VENDORS = ["Hotelbeds", "Expedia TAAP", "WebBeds", "Booking.com Affiliate"];
const HOTELS = ["Hilton Garden Inn", "Marriott Airport", "Holiday Inn Express", "Novotel", "Radisson Blu", "Ibis Styles", "Hyatt Place", "Crowne Plaza"];

const rnd = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};
const uuid = (seed: number) => {
  const h = (n: number, len: number) => Math.floor(rnd(seed * 31 + n) * 16 ** len).toString(16).padStart(len, "0");
  return `${h(1, 8)}-${h(2, 4)}-4${h(3, 3)}-a${h(4, 3)}-${h(5, 8)}${h(6, 4)}`;
};

let cache: Booking[] | null = null;

export const getBookings = async (): Promise<Booking[]> => {
  if (cache) return cache;
  const [airlines, flights] = await Promise.all([getAirlines(), getCancelledFlights()]);
  const list: Booking[] = [];
  let i = 0;
  flights.forEach((f) => {
    const count = 1 + Math.floor(rnd(i + 7) * 3);
    for (let k = 0; k < count; k++) {
      i++;
      const airline = airlines.find((a) => a.id === f.airlineId);
      const feePct = airline?.platformFeePercent ?? 5;
      const passengers = 1 + Math.floor(rnd(i) * 40);
      const rooms = Math.max(1, Math.ceil(passengers / (1 + Math.floor(rnd(i + 1) * 2))));
      const hotelCost = Math.round(rooms * (80 + rnd(i + 2) * 170));
      const hotelTax = Math.round(hotelCost * 0.12);
      const discount = rnd(i + 3) > 0.7 ? Math.round(hotelCost * 0.05) : 0;
      const platformFee = Math.round(hotelCost * (feePct / 100));
      const hotelCommission = Math.round(hotelCost * 0.08);
      const totalCost = hotelCost + hotelTax + platformFee - discount;
      const earnings = platformFee + hotelCommission;
      const r = rnd(i + 4);
      const status: BookingStatus = r > 0.85 ? "failed" : r > 0.7 ? "pending" : "completed";
      const created = new Date(new Date(f.scheduledDate).getTime() + k * 3600_000);
      const vendor = VENDORS[Math.floor(rnd(i + 5) * VENDORS.length)];
      list.push({
        id: `BK-${String(10000 + i)}`,
        airlineId: f.airlineId,
        airlineCode: airline?.iataCode ?? "",
        airlineName: f.airlineName,
        country: airline?.country ?? "",
        vendor,
        departure: f.departureAirport,
        hotelName: `${HOTELS[Math.floor(rnd(i + 6) * HOTELS.length)]} ${f.departureAirport}`,
        passengers, rooms, hotelCost, hotelTax, platformFee, hotelCommission, discount, totalCost, earnings, status,
        createdAt: created.toISOString(),
        flight: { id: f.id, flightNumber: f.flightNumber, departure: f.departureAirport, arrival: f.arrivalAirport, scheduledDate: f.scheduledDate },
        technical: {
          requestId: uuid(i),
          vendor,
          vendorBookingStatus: status === "completed" ? "CONFIRMED" : status === "pending" ? "ON_REQUEST" : "REJECTED",
          vendorReference: `${vendor.slice(0, 3).toUpperCase()}-${Math.floor(rnd(i + 8) * 9e6 + 1e6)}`,
          transferReference: uuid(i + 1000),
          completedAt: status === "completed" ? new Date(created.getTime() + 120_000).toISOString() : undefined,
          failedAt: status === "failed" ? new Date(created.getTime() + 60_000).toISOString() : undefined,
          failureReason: status === "failed" ? "Vendor rejected: no availability for requested room count" : undefined,
        },
      });
    }
  });
  cache = list;
  return list;
};
