# Project Rules

- The hotel-supplier list lives only in `src/services/vendors.ts` (`VENDORS`) and every vendor-driven screen (bookings data, filters, dashboard vendor rows) reads it from there, so adding a supplier is a single data edit with no UI changes.
