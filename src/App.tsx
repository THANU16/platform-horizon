import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Airlines from "./pages/Airlines";
import AirlineDetail from "./pages/AirlineDetail";
import CancelledFlights from "./pages/CancelledFlights";
import Payments from "./pages/Payments";
import Invites from "./pages/Invites";
import SystemSettings from "./pages/SystemSettings";
import AuditLogs from "./pages/AuditLogs";
import AdminProfile from "./pages/AdminProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/airlines" element={<Airlines />} />
          <Route path="/airlines/:id" element={<AirlineDetail />} />
          <Route path="/cancelled-flights" element={<CancelledFlights />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/invites" element={<Invites />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/profile" element={<AdminProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
