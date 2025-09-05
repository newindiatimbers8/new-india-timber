
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import BulkOrdersPage from "./pages/BulkOrdersPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import DashboardPage from "./pages/DashboardPage";
// import EstimatorPage from "./pages/EstimatorPage"; // COMMENTED OUT
import ComparisonPage from "./pages/ComparisonPage";
import SEOSettingsPage from "./pages/SEOSettingsPage";
import WoodProductPage from "./components/products/WoodProductPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/wood/:woodType" element={<WoodProductPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/bulk-orders" element={<BulkOrdersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/seo" element={<SEOSettingsPage />} />
          {/* <Route path="/estimator" element={<EstimatorPage />} /> COMMENTED OUT */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
