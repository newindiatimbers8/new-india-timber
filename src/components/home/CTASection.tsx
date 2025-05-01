
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-forest-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Timber Project?</h2>
          <p className="text-xl mb-8">
            Contact us today for a free consultation or browse our extensive range of premium timber products.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button asChild size="lg" className="bg-timber-600 hover:bg-timber-700 text-white rounded-md">
              <Link to="/products" className="text-lg px-8">
                Browse Products <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 rounded-md">
              <a href="tel:+918095701235" className="text-lg px-8 flex items-center">
                <Phone className="mr-2" size={18} /> Call Us Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
