
import { useEffect, Suspense, lazy } from "react";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { generateHomeStructuredData } from "@/services/seo";

// Lazy load homepage sections for better performance
const Hero = lazy(() => import("@/components/home/Hero"));
const CategorySection = lazy(() => import("@/components/home/CategorySection"));
const CustomerSegment = lazy(() => import("@/components/home/CustomerSegment"));
const HowItWorks = lazy(() => import("@/components/home/HowItWorks"));
const FeaturesSection = lazy(() => import("@/components/home/FeaturesSection"));
const WorkshopVideoSection = lazy(() => import("@/components/home/WorkshopVideoSection"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading component for sections
const SectionLoader = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-timber-100 rounded-lg mb-8"></div>
  </div>
);

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <Helmet>
        <title>New India Timber | Bangalore Timber Suppliers & Premium Wood Products</title>
        <meta
          name="description"
          content="New India Timber supplies premium teak, plywood, and hardwood solutions across Bangalore and Karnataka with custom services for builders, architects, and homeowners."
        />
        <script type="application/ld+json">
          {JSON.stringify(generateHomeStructuredData())}
        </script>
      </Helmet>
      <Suspense fallback={<SectionLoader />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <WorkshopVideoSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CategorySection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CustomerSegment />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CTASection />
      </Suspense>
    </Layout>
  );
};

export default Index;
