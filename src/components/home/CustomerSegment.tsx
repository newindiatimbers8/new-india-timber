
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Home, Building2, Star, Users, Target } from "lucide-react";
import { getPlaceholderImage, handleImageError } from "@/utils/imageUtils";
import { cn } from "@/utils";

interface SegmentOption {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits: string[];
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
      image: getPlaceholderImage("teak"),
      icon: Star,
      benefits: ["Premium Grade", "Long-lasting", "Investment Quality"]
    },
    {
      id: "budget",
      title: "Budget Friendly",
      description: "Quality wood products at affordable prices without compromising durability.",
      image: getPlaceholderImage("plywood"),
      icon: Target,
      benefits: ["Cost-effective", "Quality Assured", "Value for Money"]
    }
  ];

  const purposeOptions: SegmentOption[] = [
    {
      id: "residential",
      title: "Residential",
      description: "Perfect for homes, apartments, and personal living spaces.",
      image: getPlaceholderImage("wood"),
      icon: Home,
      benefits: ["Home Projects", "Personal Use", "Interior Design"]
    },
    {
      id: "commercial",
      title: "Commercial",
      description: "Designed for offices, retail spaces, and business environments.",
      image: getPlaceholderImage("wood"),
      icon: Building2,
      benefits: ["Business Use", "Professional", "High Traffic"]
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
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-muted/20 via-background to-primary/5">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>

      {/* Modern Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-10 w-28 h-28 bg-primary/5 rounded-2xl transform rotate-45 animate-float opacity-30" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 right-10 w-36 h-36 bg-accent/10 rounded-full animate-float opacity-40" style={{ animationDelay: '0s' }} />
        <div className="absolute top-60 right-20 w-20 h-20 bg-secondary/10 rounded-full animate-float opacity-25" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Badge variant="secondary" className="mb-4 bg-primary/10 border-primary/20 text-primary">
              <Users className="w-4 h-4 mr-1" />
              Customer Preferences
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 md:mb-6 text-foreground">
              Find Your Perfect Wood Solution
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tell us about your needs, and we'll help you find
              <br className="hidden md:block" />
              the perfect timber products for your project.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Step 1: Usage */}
          <div className="mb-16">
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-primary">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span className="font-semibold">What are you looking for?</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {usageOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <Card
                    key={option.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 transform hover:scale-105",
                      "bg-card border border-border hover:border-primary/20",
                      "group animate-slide-up",
                      selectedUsage === option.id
                        ? "bg-primary/5 border-primary shadow-lg ring-2 ring-primary/20"
                        : "hover:shadow-lg"
                    )}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent group-hover:from-background/20 transition-all duration-300"></div>

                      {/* Selection Indicator */}
                      {selectedUsage === option.id && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-slide-up">
                          <CheckCircle className="w-5 h-5 text-primary-foreground" />
                        </div>
                      )}

                      {/* Icon Overlay */}
                      <div className="absolute top-4 left-4 p-2 bg-card/80 backdrop-blur-sm rounded-lg">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
                        {option.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                        {option.description}
                      </CardDescription>

                      {/* Benefits */}
                      <div className="flex flex-wrap gap-2">
                        {option.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-muted/50">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Step 2: Purpose */}
          {selectedUsage && (
            <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 text-accent-foreground">
                  <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span className="font-semibold">What is your purpose?</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                {purposeOptions.map((option, index) => {
                  const IconComponent = option.icon;
                  return (
                    <Card
                      key={option.id}
                      className={cn(
                        "cursor-pointer transition-all duration-300 transform hover:scale-105",
                        "bg-card border border-border hover:border-accent/20",
                        "group animate-slide-up",
                        selectedPurpose === option.id
                          ? "bg-accent/5 border-accent shadow-lg ring-2 ring-accent/20"
                          : "hover:shadow-lg"
                      )}
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
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent group-hover:from-background/20 transition-all duration-300"></div>

                        {/* Selection Indicator */}
                        {selectedPurpose === option.id && (
                          <div className="absolute top-3 right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-slide-up">
                            <CheckCircle className="w-5 h-5 text-accent-foreground" />
                          </div>
                        )}

                        {/* Icon Overlay */}
                        <div className="absolute top-4 left-4 p-2 bg-card/80 backdrop-blur-sm rounded-lg">
                          <IconComponent className="w-6 h-6 text-accent" />
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg md:text-xl text-foreground group-hover:text-accent transition-colors">
                          {option.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                          {option.description}
                        </CardDescription>

                        {/* Benefits */}
                        <div className="flex flex-wrap gap-2">
                          {option.benefits.map((benefit, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-muted/50">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Continue Button */}
          {selectedUsage && selectedPurpose && (
            <div className="text-center mt-12 animate-slide-up" style={{ animationDelay: '1s' }}>
              <Card className="bg-card border border-border shadow-lg max-w-2xl mx-auto">
                <CardContent className="p-8 md:p-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
                    Perfect! Let's Find Your Products
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Based on your selection, we'll show you the most suitable timber options.
                  </p>
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className={cn(
                      "bg-primary hover:bg-primary/90 text-primary-foreground",
                      "px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl",
                      "transition-all duration-300 transform hover:scale-105 group"
                    )}
                  >
                    View Recommended Products
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerSegment;
