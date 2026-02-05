 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Wallet } from "lucide-react";
 import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
 } from "@/components/ui/tooltip";
 import { AllowanceOverview } from "@/types";
 
 interface AllowanceCardProps {
   allowance: AllowanceOverview;
 }
 
 export function AllowanceCard({ allowance }: AllowanceCardProps) {
   const formatCurrency = (value: number) => {
     return new Intl.NumberFormat("en-US", {
       style: "currency",
       currency: "USD",
       maximumFractionDigits: 0,
     }).format(value);
   };
 
   const totalAllowance = allowance.totalTopUp + allowance.totalAdminCredit;
   const totalUsed = allowance.usedTopUp + allowance.usedAdminCredit;
   const topUpPercentage = totalAllowance > 0 ? (allowance.totalTopUp / totalAllowance) * 100 : 0;
   const usedTopUpPercentage = totalAllowance > 0 ? (allowance.usedTopUp / totalAllowance) * 100 : 0;
   const usedAdminCreditPercentage = totalAllowance > 0 ? (allowance.usedAdminCredit / totalAllowance) * 100 : 0;
 
   return (
     <Card className="bg-card shadow-sm">
       <CardHeader className="pb-2">
         <div className="flex items-center justify-between">
           <CardTitle className="text-sm font-medium text-muted-foreground">
             Allowance Overview
           </CardTitle>
           <Tooltip>
             <TooltipTrigger asChild>
               <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center cursor-help">
                 <Wallet className="w-5 h-5 text-primary" />
               </div>
             </TooltipTrigger>
             <TooltipContent side="left" className="max-w-xs p-3">
               <p className="text-sm">
                 <strong>Spending Priority:</strong> Top-up balance is used first, 
                 then Admin credit is consumed for bookings.
               </p>
             </TooltipContent>
           </Tooltip>
         </div>
       </CardHeader>
       <CardContent>
         <div className="space-y-3">
           <p className="text-2xl font-bold text-foreground">
             {formatCurrency(allowance.totalRemaining)}
           </p>
           <p className="text-xs text-muted-foreground">
             Remaining of {formatCurrency(totalAllowance)} total
           </p>
           
           {/* Stacked Progress Bar */}
           <div className="space-y-2">
             <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
               {/* Top-up used portion */}
               <Tooltip>
                 <TooltipTrigger asChild>
                   <div
                     className="h-full bg-primary transition-all duration-300"
                     style={{ width: `${usedTopUpPercentage}%` }}
                   />
                 </TooltipTrigger>
                 <TooltipContent>
                   <p className="text-xs">Top-up Used: {formatCurrency(allowance.usedTopUp)}</p>
                 </TooltipContent>
               </Tooltip>
               
               {/* Top-up remaining portion */}
               <Tooltip>
                 <TooltipTrigger asChild>
                   <div
                     className="h-full bg-primary/40 transition-all duration-300"
                     style={{ width: `${topUpPercentage - usedTopUpPercentage}%` }}
                   />
                 </TooltipTrigger>
                 <TooltipContent>
                   <p className="text-xs">Top-up Remaining: {formatCurrency(allowance.remainingTopUp)}</p>
                 </TooltipContent>
               </Tooltip>
               
               {/* Admin credit used portion */}
               <Tooltip>
                 <TooltipTrigger asChild>
                   <div
                     className="h-full bg-success transition-all duration-300"
                     style={{ width: `${usedAdminCreditPercentage}%` }}
                   />
                 </TooltipTrigger>
                 <TooltipContent>
                   <p className="text-xs">Admin Credit Used: {formatCurrency(allowance.usedAdminCredit)}</p>
                 </TooltipContent>
               </Tooltip>
               
               {/* Admin credit remaining portion */}
               <Tooltip>
                 <TooltipTrigger asChild>
                   <div
                     className="h-full bg-success/40 transition-all duration-300"
                     style={{ width: `${100 - topUpPercentage - usedAdminCreditPercentage}%` }}
                   />
                 </TooltipTrigger>
                 <TooltipContent>
                   <p className="text-xs">Admin Credit Remaining: {formatCurrency(allowance.remainingAdminCredit)}</p>
                 </TooltipContent>
               </Tooltip>
             </div>
             
             {/* Legend */}
             <div className="flex flex-wrap gap-4 text-xs">
               <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-sm bg-primary" />
                 <span className="text-muted-foreground">Top-up (spent first)</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-sm bg-success" />
                 <span className="text-muted-foreground">Admin Credit</span>
               </div>
             </div>
           </div>
         </div>
       </CardContent>
     </Card>
   );
 }