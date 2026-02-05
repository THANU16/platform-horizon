 import { KpiCard } from "@/components/ui/KpiCard";
 import { AllowanceCard } from "./AllowanceCard";
 import { DollarSign, Clock, AlertTriangle, Building2 } from "lucide-react";
 import { PaymentStats, AllowanceOverview } from "@/types";
 
 interface PaymentsKpiCardsProps {
   stats: PaymentStats;
   allowance: AllowanceOverview;
 }
 
 export function PaymentsKpiCards({ stats, allowance }: PaymentsKpiCardsProps) {
   const formatCurrency = (value: number) => {
     return new Intl.NumberFormat("en-US", {
       style: "currency",
       currency: "USD",
       maximumFractionDigits: 0,
     }).format(value);
   };
 
   return (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
       <KpiCard
         title="Total Platform Revenue"
         value={formatCurrency(stats.totalRevenue)}
         icon={DollarSign}
         trend={{ value: stats.revenueChange, label: "vs last period" }}
       />
       <KpiCard
         title="Pending Payouts"
         value={formatCurrency(stats.pendingPayouts)}
         subtext={`${stats.pendingAirlinesCount} airline${stats.pendingAirlinesCount !== 1 ? 's' : ''} affected`}
         icon={Clock}
       />
       <KpiCard
         title="Failed Payouts"
         value={String(stats.failedPayouts)}
         subtext="Requires attention"
         icon={AlertTriangle}
       />
       <KpiCard
         title="Active Airlines"
         value={`${stats.activeAirlines} of ${stats.totalOnboarded}`}
         subtext="Generating revenue"
         icon={Building2}
       />
       <AllowanceCard allowance={allowance} />
     </div>
   );
 }