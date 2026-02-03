import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Plane,
  PlaneTakeoff,
  CreditCard,
  UserPlus,
  Settings,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Airlines", icon: Plane, path: "/airlines" },
  { title: "Cancelled Flights", icon: PlaneTakeoff, path: "/cancelled-flights" },
  { title: "Payments & Revenue", icon: CreditCard, path: "/payments" },
  { title: "Invites & Onboarding", icon: UserPlus, path: "/invites" },
  { title: "System Settings", icon: Settings, path: "/settings" },
  { title: "Audit Logs", icon: FileText, path: "/audit-logs" },
  { title: "Admin Profile", icon: User, path: "/profile" },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const location = useLocation();

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border",
        collapsed && !mobile ? "justify-center" : "gap-3"
      )}>
        <div className="w-8 h-8 rounded-lg bg-success flex items-center justify-center">
          <Plane className="w-5 h-5 text-success-foreground" />
        </div>
        {(!collapsed || mobile) && (
          <span className="font-semibold text-sidebar-foreground text-lg">
            FlyVoid
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-sidebar-foreground",
                collapsed && !mobile ? "justify-center" : ""
              )}
              title={collapsed && !mobile ? item.title : undefined}
            >
              <item.icon className={cn("w-5 h-5 shrink-0")} />
              {(!collapsed || mobile) && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button - Desktop Only */}
      {!mobile && (
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapsedChange(!collapsed)}
            className={cn(
              "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              collapsed ? "justify-center" : "justify-start gap-2"
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-card">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
            <NavContent mobile />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
