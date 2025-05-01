
import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <div className="bg-timber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About South Indian Timbers</h1>
            <p className="text-lg text-gray-600">
              Trusted supplier of premium timber products in Bangalore since 2005
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image Placeholder */}
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Workshop Image</p>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-6">
              Founded in 2005, South Indian Timbers began as a small family business dedicated to providing quality timber products to local contractors and homeowners in Bangalore. With an unwavering commitment to quality and customer satisfaction, we've grown to become one of the most trusted timber suppliers in the region.
            </p>
            <p className="text-gray-600 mb-6">
              Our journey started with a simple mission: to source the finest timber products and make them accessible to our customers at competitive prices. Today, we continue to uphold this mission while expanding our product range to include premium teak varieties, plywood solutions, and hardwood logs for various applications.
            </p>
            <p className="text-gray-600">
              Located in the heart of HSR Layout, we take pride in serving both residential and commercial clients with personalized service and expert guidance.
            </p>
          </div>
        </div>
        
        <div className="mt-16 bg-forest-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-forest-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-forest-700">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">
                We never compromise on quality, sourcing only the finest timber products from trusted suppliers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-forest-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-forest-700">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-gray-600">
                We operate with complete transparency and honesty in all our dealings with customers and partners.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-forest-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-forest-700">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Service</h3>
              <p className="text-gray-600">
                We're dedicated to providing exceptional service and ensuring customer satisfaction at every step.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Choose South Indian Timbers?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Premium Selection</h3>
              <p className="text-gray-600">
                We offer a diverse range of high-quality timber products, including premium teak varieties like Burma Teak, Ghana Teak, and Brazilian Teak, as well as budget-friendly options like Indian Sal and various plywood solutions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
              <p className="text-gray-600">
                Our team of timber specialists provides expert advice to help you choose the right wood for your specific project requirements, whether it's for residential or commercial applications.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Customization Options</h3>
              <p className="text-gray-600">
                We offer custom sizing, finishing, and treatment services to ensure our products meet your exact specifications. Our bulk order service caters to large-scale projects with specialized needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Competitive Pricing</h3>
              <p className="text-gray-600">
                We're committed to offering fair, transparent pricing on all our products, with special discounts available for bulk orders. Our flexible rental options provide cost-effective solutions for temporary projects.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Visit Our Store</h2>
          <p className="text-lg text-gray-600 mb-8">
            Come explore our extensive showroom in HSR Layout, where you can see our products up close and consult with our timber experts.
          </p>
          
          <Button asChild className="bg-timber-600 hover:bg-timber-700 px-8 py-6 text-lg">
            <Link to="/contact">
              Contact Us Today
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
