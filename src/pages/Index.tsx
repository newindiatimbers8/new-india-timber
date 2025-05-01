
import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import CustomerSegment from "../components/home/CustomerSegment";
import FeaturesSection from "../components/home/FeaturesSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";
import PriceEstimatorQuiz from "../components/home/PriceEstimatorQuiz";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <Hero />
      <CategorySection />
      <CustomerSegment />
      <PriceEstimatorQuiz />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
