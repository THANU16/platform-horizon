 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Progress } from "@/components/ui/progress";
 import { RevenueByCountry } from "@/types";
 
 interface RevenueByCountrySectionProps {
   data: RevenueByCountry[];
 }
 
 export function RevenueByCountrySection({ data }: RevenueByCountrySectionProps) {
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
         <CardTitle className="text-base font-medium">Revenue by Country</CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
         {data.length === 0 ? (
           <p className="text-sm text-muted-foreground text-center py-8">
             No countries match the current filters.
           </p>
         ) : (
           data.map((country) => (
             <div key={country.country} className="space-y-2">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <span className="font-medium text-sm">{country.country}</span>
                   <Badge variant="secondary" className="text-xs">
                     {country.airlinesCount} airline{country.airlinesCount !== 1 ? "s" : ""}
                   </Badge>
                 </div>
                 <div className="text-right">
                   <span className="font-semibold text-sm">
                     {formatCurrency(country.revenue)}
                   </span>
                   <span className="text-xs text-muted-foreground ml-2">
                     ({country.percentage.toFixed(1)}%)
                   </span>
                 </div>
               </div>
               <Progress value={country.percentage} className="h-2" />
             </div>
           ))
         )}
       </CardContent>
     </Card>
   );
 }