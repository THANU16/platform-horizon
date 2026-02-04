import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background">
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          "pt-16 lg:pt-0",
          // Add left margin to account for fixed sidebar
          collapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
