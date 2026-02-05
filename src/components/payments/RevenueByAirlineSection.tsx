 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Progress } from "@/components/ui/progress";
 import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
 } from "@/components/ui/tooltip";
 import { RevenueByAirline } from "@/types";
 
 interface RevenueByAirlineSectionProps {
   data: RevenueByAirline[];
 }
 
 export function RevenueByAirlineSection({ data }: RevenueByAirlineSectionProps) {
   const formatCurrency = (value: number) => {
     return new Intl.NumberFormat("en-US", {
       style: "currency",
       currency: "USD",
       maximumFractionDigits: 0,
     }).format(value);
   };
 
   return (
     <Card>
       <CardHeader>
         <CardTitle className="text-base font-medium">Revenue by Airline</CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
         {data.length === 0 ? (
           <p className="text-sm text-muted-foreground text-center py-8">
             No airlines match the current filters.
           </p>
         ) : (
           data.map((airline) => (
             <Tooltip key={airline.airlineId}>
               <TooltipTrigger asChild>
                 <div className="space-y-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 flex-wrap">
                       <span className="font-medium text-sm">{airline.airlineName}</span>
                       <Badge variant="secondary" className="text-xs font-mono">
                         {airline.iataCode}
                       </Badge>
                       <Badge variant="outline" className="text-xs">
                         {airline.country}
                       </Badge>
                     </div>
                     <div className="text-right">
                       <span className="font-semibold text-sm">
                         {formatCurrency(airline.revenue)}
                       </span>
                       <span className="text-xs text-muted-foreground ml-2">
                         ({airline.percentage.toFixed(1)}%)
                       </span>
                     </div>
                   </div>
                   <Progress value={airline.percentage} className="h-2" />
                   
                   {/* Allowance indicator */}
                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
                     <span>Allowance:</span>
                     <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden flex max-w-[120px]">
                       <div 
                         className="h-full bg-primary/60"
                         style={{ 
                           width: `${airline.remainingAllowance > 0 ? (airline.topUpBalance / airline.remainingAllowance) * 100 : 0}%` 
                         }}
                       />
                       <div 
                         className="h-full bg-success/60"
                         style={{ 
                           width: `${airline.remainingAllowance > 0 ? (airline.adminCreditBalance / airline.remainingAllowance) * 100 : 0}%` 
                         }}
                       />
                     </div>
                     <span>{formatCurrency(airline.remainingAllowance)}</span>
                   </div>
                 </div>
               </TooltipTrigger>
               <TooltipContent side="right" className="p-3">
                 <div className="space-y-1 text-sm">
                   <p><strong>Total Bookings:</strong> {airline.totalBookings.toLocaleString()}</p>
                   <p><strong>Total Payouts:</strong> {formatCurrency(airline.totalPayouts)}</p>
                   <p><strong>Country:</strong> {airline.country}</p>
                   <hr className="my-2 border-border" />
                   <p><strong>Top-up Balance:</strong> {formatCurrency(airline.topUpBalance)}</p>
                   <p><strong>Admin Credit:</strong> {formatCurrency(airline.adminCreditBalance)}</p>
                 </div>
               </TooltipContent>
             </Tooltip>
           ))
         )}
       </CardContent>
     </Card>
   );
 }