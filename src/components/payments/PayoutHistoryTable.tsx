 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
 } from "@/components/ui/tooltip";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
 import { EmptyState } from "@/components/ui/EmptyState";
 import { DollarSign, Eye, AlertCircle } from "lucide-react";
 import { Payment, Airline, TransactionType } from "@/types";
 
 interface PayoutHistoryTableProps {
   payments: Payment[];
   airlines: Airline[];
   countries: string[];
   tableStatusFilter: string;
   tableCountryFilter: string;
   tableAirlineFilter: string;
   onStatusFilterChange: (value: string) => void;
   onCountryFilterChange: (value: string) => void;
   onAirlineFilterChange: (value: string) => void;
 }
 
 const transactionTypeLabels: Record<TransactionType, string> = {
   payout: "Payout",
   adjustment: "Adjustment",
   refund: "Refund",
   top_up: "Top-up",
   revenue_fee: "Revenue Fee",
   admin_credit: "Admin Credit",
 };
 
 export function PayoutHistoryTable({
   payments,
   airlines,
   countries,
   tableStatusFilter,
   tableCountryFilter,
   tableAirlineFilter,
   onStatusFilterChange,
   onCountryFilterChange,
   onAirlineFilterChange,
 }: PayoutHistoryTableProps) {
   const formatCurrency = (value: number) => {
     return new Intl.NumberFormat("en-US", {
       style: "currency",
       currency: "USD",
       maximumFractionDigits: 0,
     }).format(value);
   };
 
   const filteredPayments = payments.filter((payment) => {
     const matchesStatus =
       tableStatusFilter === "all" || payment.status === tableStatusFilter;
     const matchesCountry =
       tableCountryFilter === "all" || payment.country === tableCountryFilter;
     const matchesAirline =
       tableAirlineFilter === "all" || payment.airlineId === tableAirlineFilter;
     return matchesStatus && matchesCountry && matchesAirline;
   });
 
   return (
     <Card>
       <CardHeader>
         <CardTitle className="text-base font-medium">Payout & Transaction History</CardTitle>
       </CardHeader>
       <CardContent>
         {/* Table Filters */}
         <div className="flex flex-wrap gap-3 mb-4">
           <Select value={tableStatusFilter} onValueChange={onStatusFilterChange}>
             <SelectTrigger className="w-[150px]">
               <SelectValue placeholder="Status" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Status</SelectItem>
               <SelectItem value="completed">Completed</SelectItem>
               <SelectItem value="pending">Pending</SelectItem>
               <SelectItem value="failed">Failed</SelectItem>
             </SelectContent>
           </Select>
           <Select value={tableAirlineFilter} onValueChange={onAirlineFilterChange}>
             <SelectTrigger className="w-[180px]">
               <SelectValue placeholder="Airline" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Airlines</SelectItem>
               {airlines.map((a) => (
                 <SelectItem key={a.id} value={a.id}>
                   {a.name}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
           <Select value={tableCountryFilter} onValueChange={onCountryFilterChange}>
             <SelectTrigger className="w-[150px]">
               <SelectValue placeholder="Country" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Countries</SelectItem>
               {countries.map((c) => (
                 <SelectItem key={c} value={c}>
                   {c}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
 
         {filteredPayments.length === 0 ? (
           <EmptyState
             icon={DollarSign}
             title="No transactions found"
             description="No transactions match your current filters."
           />
         ) : (
           <>
             {/* Desktop Table */}
             <div className="hidden lg:block border rounded-lg overflow-hidden">
               <Table>
                 <TableHeader>
                   <TableRow className="table-header">
                     <TableHead>Date</TableHead>
                     <TableHead>Airline</TableHead>
                     <TableHead>Country</TableHead>
                     <TableHead>Type</TableHead>
                     <TableHead>Description</TableHead>
                     <TableHead className="text-right">Amount</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredPayments.map((payment) => (
                     <TableRow key={payment.id} className="table-row-hover">
                       <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                       <TableCell className="font-medium">{payment.airlineName}</TableCell>
                       <TableCell>
                         <Badge variant="outline" className="text-xs">
                           {payment.country}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <Badge 
                           variant={payment.type === "top_up" || payment.type === "admin_credit" ? "secondary" : "outline"}
                           className="text-xs"
                         >
                           {transactionTypeLabels[payment.type]}
                         </Badge>
                       </TableCell>
                       <TableCell className="text-muted-foreground max-w-[200px] truncate">
                         {payment.description}
                       </TableCell>
                       <TableCell className="text-right font-medium">
                         <span className={payment.type === "refund" ? "text-destructive" : ""}>
                           {payment.type === "refund" ? "-" : ""}{formatCurrency(payment.amount)}
                         </span>
                       </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-1">
                           <StatusBadge status={payment.status as StatusType} />
                           {payment.status === "failed" && payment.failureReason && (
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <AlertCircle className="w-4 h-4 text-destructive cursor-help" />
                               </TooltipTrigger>
                               <TooltipContent className="max-w-xs">
                                 <p className="text-xs">{payment.failureReason}</p>
                               </TooltipContent>
                             </Tooltip>
                           )}
                         </div>
                       </TableCell>
                       <TableCell>
                         <Button variant="ghost" size="icon">
                           <Eye className="w-4 h-4" />
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
 
             {/* Mobile Cards */}
             <div className="lg:hidden space-y-4">
               {filteredPayments.map((payment) => (
                 <Card key={payment.id} className="animate-fade-in">
                   <CardContent className="p-4">
                     <div className="flex items-start justify-between mb-3">
                       <div>
                         <h3 className="font-medium">{payment.airlineName}</h3>
                         <Badge 
                           variant={payment.type === "top_up" || payment.type === "admin_credit" ? "secondary" : "outline"}
                           className="text-xs mt-1"
                         >
                           {transactionTypeLabels[payment.type]}
                         </Badge>
                       </div>
                       <div className="flex items-center gap-1">
                         <StatusBadge status={payment.status as StatusType} />
                         {payment.status === "failed" && payment.failureReason && (
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <AlertCircle className="w-4 h-4 text-destructive" />
                             </TooltipTrigger>
                             <TooltipContent className="max-w-xs">
                               <p className="text-xs">{payment.failureReason}</p>
                             </TooltipContent>
                           </Tooltip>
                         )}
                       </div>
                     </div>
                     <div className="space-y-2 text-sm">
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">Date</span>
                         <span>{new Date(payment.date).toLocaleDateString()}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">Country</span>
                         <Badge variant="outline" className="text-xs">
                           {payment.country}
                         </Badge>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">Amount</span>
                         <span className={`font-semibold ${payment.type === "refund" ? "text-destructive" : ""}`}>
                           {payment.type === "refund" ? "-" : ""}{formatCurrency(payment.amount)}
                         </span>
                       </div>
                     </div>
                     <p className="text-sm text-muted-foreground mt-2">{payment.description}</p>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </>
         )}
       </CardContent>
     </Card>
   );
 }