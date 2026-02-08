import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  LogOut,
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
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo Header */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border",
        collapsed && !mobile ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
            <PlaneTakeoff className="w-5 h-5 text-sidebar-foreground" />
          </div>
          {(!collapsed || mobile) && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground text-base leading-tight">
                FlyVoid Admin
              </span>
              <span className="text-xs text-sidebar-muted">
                FV
              </span>
            </div>
          )}
        </div>
        {(!collapsed || mobile) && !mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapsedChange(!collapsed)}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
        {collapsed && !mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapsedChange(!collapsed)}
            className="absolute -right-3 top-5 h-6 w-6 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronRight className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                  : "text-sidebar-foreground",
                collapsed && !mobile ? "justify-center px-3" : ""
              )}
              title={collapsed && !mobile ? item.title : undefined}
            >
              <item.icon className={cn("w-5 h-5 shrink-0")} />
              {(!collapsed || mobile) && (
                <span className="text-sm">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full",
            "text-destructive hover:bg-destructive/10",
            collapsed && !mobile ? "justify-center px-3" : ""
          )}
          title={collapsed && !mobile ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {(!collapsed || mobile) && (
            <span className="text-sm">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40",
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
