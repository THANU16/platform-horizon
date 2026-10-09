export interface Vendor {
  id: string;
  name: string;
}

/**
 * Single source of truth for the hotel suppliers the platform books through.
 * Add an entry here and every vendor-driven screen (the Bookings search/filters
 * and table, the Dashboard Vendor Performance rows) picks it up automatically —
 * no UI changes needed.
 */
export const VENDORS: Vendor[] = [
  { id: "hotelbeds", name: "Hotelbeds" },
  { id: "ratehawk", name: "RateHawk" },
  { id: "booking-com", name: "Booking.com" },
];

// Semantic accent tokens, cycled by position, so a new vendor never needs a colour decision.
const ACCENTS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--info))",
];

export const vendorAccent = (index: number) => ACCENTS[index % ACCENTS.length];
