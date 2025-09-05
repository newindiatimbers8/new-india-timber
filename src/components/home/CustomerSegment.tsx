
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getPlaceholderImage, handleImageError } from "@/utils/imageUtils";

interface SegmentOption {
  id: string;
  title: string;
  description: string;
  image: string;
}

const CustomerSegment = () => {
  const navigate = useNavigate();
  const [selectedUsage, setSelectedUsage] = useState<string | null>(null);
  const [selectedPurpose, setPurpose] = useState<string | null>(null);

  const usageOptions: SegmentOption[] = [
    {
      id: "premium",
      title: "Premium Quality",
      description: "High-end wood products for long-term investment and premium aesthetics.",
      image: getPlaceholderImage("teak")
    },
    {
      id: "budget",
      title: "Budget Friendly",
      description: "Quality wood products at affordable prices without compromising durability.",
      image: getPlaceholderImage("plywood")
    }
  ];

  const purposeOptions: SegmentOption[] = [
    {
      id: "residential",
      title: "Residential",
      description: "Perfect for homes, apartments, and personal living spaces.",
      image: getPlaceholderImage("wood")
    },
    {
      id: "commercial",
      title: "Commercial",
      description: "Designed for offices, retail spaces, and business environments.",
      image: getPlaceholderImage("wood")
    }
  ];

  const handleContinue = () => {
    if (selectedUsage && selectedPurpose) {
      // In a real implementation, you would store these preferences
      // and use them to filter product recommendations
      navigate(`/products?usage=${selectedUsage}&purpose=${selectedPurpose}`);
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated Background with Multiple Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-timber-900 to-forest-800">
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-forest-600/20 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] animate-pulse">
          </div>
        </div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-10 w-28 h-28 bg-timber-400/10 rounded-full blur-xl animate-float [animation-delay:2s]">
        </div>
        <div className="absolute bottom-32 right-10 w-36 h-36 bg-forest-300/10 rounded-full blur-2xl animate-float [animation-delay:0s]">
        </div>
        <div className="absolute top-60 right-20 w-20 h-20 bg-timber-500/10 rounded-full blur-lg animate-float [animation-delay:4s]">
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="animate-fade-in [animation-delay:0.2s]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
              Find Your Perfect Wood Solution
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Tell us about your needs, and we'll help you find 
              <br className="hidden md:block" />
              the perfect timber products for your project.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Step 1: Usage */}
          <div className="mb-16">
            <div className="animate-fade-in [animation-delay:0.4s]">
              <h3 className="text-xl md:text-2xl font-bold mb-8 text-center text-white/90">
                1. What are you looking for?
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {usageOptions.map((option, index) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all duration-500 transform hover:scale-105 glassmorphism hover:bg-white/20 border-white/20 group animate-fade-in ${
                    selectedUsage === option.id 
                    ? "bg-white/20 border-timber-300/50 shadow-2xl animate-glow" 
                    : ""
                  }`}
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  onClick={() => setSelectedUsage(option.id)}
                >
                  <div className="h-40 md:h-48 overflow-hidden rounded-t-lg relative">
                    <img 
                      src={option.image} 
                      alt={option.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => handleImageError(e, "wood")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/20 transition-all duration-300"></div>
                    {selectedUsage === option.id && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-timber-500 rounded-full flex items-center justify-center animate-fade-in">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg md:text-xl text-white group-hover:text-timber-200 transition-colors">
                      {option.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/70 leading-relaxed">
                      {option.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Step 2: Purpose */}
          {selectedUsage && (
            <div className="mb-16 animate-slide-in-left">
              <h3 className="text-xl md:text-2xl font-bold mb-8 text-center text-white/90">
                2. What is your purpose?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                {purposeOptions.map((option, index) => (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all duration-500 transform hover:scale-105 glassmorphism hover:bg-white/20 border-white/20 group animate-fade-in ${
                      selectedPurpose === option.id 
                      ? "bg-white/20 border-timber-300/50 shadow-2xl animate-glow" 
                      : ""
                    }`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                    onClick={() => setPurpose(option.id)}
                  >
                    <div className="h-40 md:h-48 overflow-hidden rounded-t-lg relative">
                      <img 
                        src={option.image} 
                        alt={option.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => handleImageError(e, "wood")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/20 transition-all duration-300"></div>
                      {selectedPurpose === option.id && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-timber-500 rounded-full flex items-center justify-center animate-fade-in">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg md:text-xl text-white group-hover:text-timber-200 transition-colors">
                        {option.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-white/70 leading-relaxed">
                        {option.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          {selectedUsage && selectedPurpose && (
            <div className="text-center mt-12 animate-fade-in">
              <div className="glassmorphism rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Perfect! Let's Find Your Products
                </h3>
                <p className="text-white/70 mb-8">
                  Based on your selection, we'll show you the most suitable timber options.
                </p>
                <Button 
                  onClick={handleContinue}
                  className="bg-timber-600 hover:bg-timber-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-timber-500/25 transition-all duration-300 transform hover:scale-105 group"
                >
                  View Recommended Products 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerSegment;
