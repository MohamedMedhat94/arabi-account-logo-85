import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Invoice from "./pages/Invoice";
import Reports from "./pages/Reports";
import MonthlyReports from "./pages/MonthlyReports";
import AnnualSummary from "./pages/AnnualSummary";
import InvoiceHistory from "./pages/InvoiceHistory";
import ClientAnalysis from "./pages/ClientAnalysis";
import TaxReports from "./pages/TaxReports";
import ExportData from "./pages/ExportData";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/monthly" element={<MonthlyReports />} />
          <Route path="/reports/annual" element={<AnnualSummary />} />
          <Route path="/reports/invoices" element={<InvoiceHistory />} />
          <Route path="/reports/clients" element={<ClientAnalysis />} />
          <Route path="/reports/taxes" element={<TaxReports />} />
          <Route path="/reports/export" element={<ExportData />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
