import { cn } from "@/lib/utils";
import { PaymentsTabType } from "@/types";
import { BarChart3, LineChart, Landmark } from "lucide-react";

interface PaymentsTabNavProps {
  activeTab: PaymentsTabType;
  onTabChange: (tab: PaymentsTabType) => void;
}

const tabs: { id: PaymentsTabType; label: string; icon: typeof BarChart3 }[] = [
  { id: "overview", label: "Platform Overview", icon: BarChart3 },
  { id: "detailed", label: "Detailed Analysis", icon: LineChart },
  { id: "treasury", label: "Platform Treasury", icon: Landmark },
];

export function PaymentsTabNav({ activeTab, onTabChange }: PaymentsTabNavProps) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="flex items-center gap-1 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
