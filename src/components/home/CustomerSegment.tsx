
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
      image: "/images/wood-texture.jpg"
    },
    {
      id: "budget",
      title: "Budget Friendly",
      description: "Quality wood products at affordable prices without compromising durability.",
      image: "/images/wood-texture.jpg"
    },
    {
      id: "rental",
      title: "Rental Options",
      description: "Temporary solutions for short-term projects with flexible rental terms.",
      image: "/images/wood-texture.jpg"
    }
  ];

  const purposeOptions: SegmentOption[] = [
    {
      id: "residential",
      title: "Residential",
      description: "Perfect for homes, apartments, and personal living spaces.",
      image: "/images/wood-texture.jpg"
    },
    {
      id: "commercial",
      title: "Commercial",
      description: "Designed for offices, retail spaces, and business environments.",
      image: "/images/wood-texture.jpg"
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Wood Solution</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tell us about your needs, and we'll help you find the perfect timber products.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Usage */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6">1. What are you looking for?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {usageOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all ${
                    selectedUsage === option.id 
                    ? "border-2 border-timber-600 shadow-md" 
                    : "hover:border-timber-300"
                  }`}
                  onClick={() => setSelectedUsage(option.id)}
                >
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={option.image} 
                      alt={option.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{option.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Step 2: Purpose */}
          {selectedUsage && (
            <div className="mb-12 animate-fade-in">
              <h3 className="text-xl font-semibold mb-6">2. What is your purpose?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purposeOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all ${
                      selectedPurpose === option.id 
                      ? "border-2 border-timber-600 shadow-md" 
                      : "hover:border-timber-300"
                    }`}
                    onClick={() => setPurpose(option.id)}
                  >
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={option.image} 
                        alt={option.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{option.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          {selectedUsage && selectedPurpose && (
            <div className="text-center mt-8 animate-fade-in">
              <Button 
                onClick={handleContinue}
                className="bg-forest-700 hover:bg-forest-800 text-white px-8 py-6 text-lg rounded-md inline-flex items-center"
              >
                View Recommended Products <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerSegment;
