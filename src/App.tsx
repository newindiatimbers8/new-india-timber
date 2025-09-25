
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
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
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AISettingsPage from "./pages/admin/AISettingsPage";
import BlogManagementDashboard from "./pages/admin/BlogManagementDashboard";
import NewBlogPostPage from "./pages/admin/NewBlogPostPage";
import ServicesPage from "./pages/ServicesPage";
import CustomSolutionsPage from "./pages/CustomSolutionsPage";
import DeliveryPage from "./pages/DeliveryPage";
import BlogPage from "./pages/Blog";
import BlogPostDetailPage from "./pages/BlogPostDetailPage";
import BlogCategoryPage from "./pages/BlogCategoryPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import RefundPage from "./pages/RefundPage";
import ShippingPolicyPage from "./pages/ShippingPolicyPage";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/products/wood/:woodType" element={<WoodProductPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/bulk-orders" element={<BulkOrdersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/seo" element={<SEOSettingsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/ai-settings" element={<AISettingsPage />} />
            <Route path="/admin/blog" element={<BlogManagementDashboard />} />
            <Route path="/admin/blog/new" element={<NewBlogPostPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/custom" element={<CustomSolutionsPage />} />
            <Route path="/services/delivery" element={<DeliveryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
            <Route path="/blog/category/:category" element={<BlogCategoryPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            {/* <Route path="/estimator" element={<EstimatorPage />} /> COMMENTED OUT */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
