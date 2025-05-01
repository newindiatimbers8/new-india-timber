
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-[80vh] bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/images/hero-pattern.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 z-10 animate-fade-in">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Premium Wood & Plywood Solutions
          </h1>
          <p className="text-xl mb-8">
            From premium teak to budget-friendly plywood options - building Bangalore's finest spaces since 2005.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild className="bg-timber-600 hover:bg-timber-700 text-white px-8 py-6 text-lg rounded-md">
              <Link to="/products">
                Browse Products
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-md">
              <Link to="/bulk-orders" className="inline-flex items-center">
                Bulk Orders <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
