import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AirlineDetailsFormValues {
  airlineName: string;
  iataCode: string;
  country: string;
  companyRegistrationNumber: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  timezone: string;
  logo: string;
  address: string;
  currency: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  jobTitle: string;
  creditLimit: number;
}

interface Props {
  values: AirlineDetailsFormValues;
  countries: string[];
  onChange: (v: AirlineDetailsFormValues) => void;
  disabled?: boolean;
}

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
];

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "SGD", "AED"];

export function AirlineDetailsForm({ values, countries, onChange, disabled }: Props) {
  const set = <K extends keyof AirlineDetailsFormValues>(k: K, v: AirlineDetailsFormValues[K]) =>
    onChange({ ...values, [k]: v });

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-sm font-semibold mb-3">Airline details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Airline Name *">
            <Input value={values.airlineName} onChange={(e) => set("airlineName", e.target.value)} disabled={disabled} required />
          </Field>
          <Field label="Airline Code *">
            <Input value={values.iataCode} onChange={(e) => set("iataCode", e.target.value.toUpperCase())} maxLength={3} disabled={disabled} required />
          </Field>
          <Field label="Country *">
            <Select value={values.country} onValueChange={(v) => set("country", v)} disabled={disabled}>
              <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent>
                {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Company Registration Number *">
            <Input value={values.companyRegistrationNumber} onChange={(e) => set("companyRegistrationNumber", e.target.value)} disabled={disabled} required />
          </Field>
          <Field label="Website">
            <Input type="url" value={values.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" disabled={disabled} />
          </Field>
          <Field label="Contact Email *">
            <Input type="email" value={values.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} disabled={disabled} required />
          </Field>
          <Field label="Contact Phone *">
            <Input value={values.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} disabled={disabled} required />
          </Field>
          <Field label="Timezone *">
            <Select value={values.timezone} onValueChange={(v) => set("timezone", v)} disabled={disabled}>
              <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Logo URL">
            <Input value={values.logo} onChange={(e) => set("logo", e.target.value)} placeholder="https://..." disabled={disabled} />
          </Field>
          <Field label="Currency *">
            <Select value={values.currency} onValueChange={(v) => set("currency", v)} disabled={disabled}>
              <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Address *" className="md:col-span-2">
            <Input value={values.address} onChange={(e) => set("address", e.target.value)} disabled={disabled} required />
          </Field>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-3">Admin details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Admin First Name *">
            <Input value={values.adminFirstName} onChange={(e) => set("adminFirstName", e.target.value)} disabled={disabled} required />
          </Field>
          <Field label="Admin Last Name *">
            <Input value={values.adminLastName} onChange={(e) => set("adminLastName", e.target.value)} disabled={disabled} required />
          </Field>
          <Field label="Admin Email *">
            <Input type="email" value={values.adminEmail} onChange={(e) => set("adminEmail", e.target.value)} disabled={disabled} required />
          </Field>
          <Field label="Job Title *">
            <Input value={values.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} disabled={disabled} required />
          </Field>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Credit Limit (USD)">
            <Input
              type="number"
              min={0}
              value={values.creditLimit}
              onChange={(e) => set("creditLimit", parseInt(e.target.value) || 0)}
              disabled={disabled}
            />
          </Field>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-2 ${className || ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export const emptyAirlineDetails: AirlineDetailsFormValues = {
  airlineName: "",
  iataCode: "",
  country: "",
  companyRegistrationNumber: "",
  website: "",
  contactEmail: "",
  contactPhone: "",
  timezone: "UTC",
  logo: "",
  address: "",
  currency: "USD",
  adminFirstName: "",
  adminLastName: "",
  adminEmail: "",
  jobTitle: "",
  creditLimit: 100000,
};
