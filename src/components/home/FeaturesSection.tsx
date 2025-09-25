
import { Shield, Truck, Clock, PersonStanding, Zap, Award, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";

const features = [
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "All our products go through rigorous quality checks to ensure long-lasting performance.",
    color: "primary",
    benefits: ["Certified Quality", "Long-lasting", "Premium Grade"]
  },
  {
    icon: Truck,
    title: "Prompt Delivery",
    description: "Fast and reliable delivery across Bangalore with options for scheduled installations.",
    color: "accent",
    benefits: ["Fast Delivery", "Scheduled Service", "Bangalore Wide"]
  },
  {
    icon: Clock,
    title: "18+ Years Experience",
    description: "Over 18 years of experience providing premium timber solutions in Bangalore.",
    color: "success",
    benefits: ["Expert Team", "Proven Track Record", "Trusted Service"]
  },
  {
    icon: PersonStanding,
    title: "Expert Advice",
    description: "Our consultants help you choose the right wood for your specific requirements.",
    color: "info",
    benefits: ["Personal Consultation", "Material Guidance", "Project Support"]
  },
  {
    icon: Zap,
    title: "Custom Solutions",
    description: "Tailor-made timber solutions for both residential and commercial projects.",
    color: "primary",
    benefits: ["Custom Design", "Flexible Options", "Project Specific"]
  }
];

const FeaturesSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>

      {/* Modern Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-2xl transform rotate-45 animate-float opacity-30" style={{ animationDelay: '1s' }} />
        <div className="absolute top-80 right-10 w-24 h-24 bg-accent/10 rounded-full animate-float opacity-40" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-secondary/10 rounded-3xl transform -rotate-12 animate-float opacity-20" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Badge variant="secondary" className="mb-4 bg-primary/10 border-primary/20 text-primary">
              <Award className="w-4 h-4 mr-1" />
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 md:mb-6">
              Why Choose New India Timber?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're committed to providing quality timber products
              <br className="hidden md:block" />
              with exceptional service and expertise.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = {
              primary: "bg-primary text-primary-foreground border-primary/20",
              accent: "bg-accent text-accent-foreground border-accent/20",
              success: "bg-green-500 text-white border-green-500/20",
              info: "bg-blue-500 text-white border-blue-500/20"
            };

            return (
              <Card
                key={index}
                className={cn(
                  "relative bg-card border border-border hover:border-primary/20",
                  "transition-all duration-300 transform hover:scale-105 hover:-translate-y-1",
                  "group animate-slide-up shadow-lg hover:shadow-xl"
                )}
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="flex flex-col items-center">
                    {/* Icon Container */}
                    <div className={cn(
                      "mb-6 p-4 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg",
                      "bg-muted/50 group-hover:bg-primary/10",
                      colorClasses[feature.color as keyof typeof colorClasses]
                    )}>
                      <Icon className={cn(
                        "w-10 h-10 group-hover:scale-110 transition-transform",
                        feature.color === 'primary' && "text-primary-foreground",
                        feature.color === 'accent' && "text-accent-foreground",
                        feature.color === 'success' && "text-white",
                        feature.color === 'info' && "text-white"
                      )} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl md:text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors mb-4">
                      {feature.description}
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {feature.benefits.map((benefit, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-muted/50">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="mt-16 md:mt-20 animate-slide-up" style={{ animationDelay: '1.2s' }}>
          <Card className="bg-card border border-border shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="animate-slide-up group">
                  <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-timber-600 mb-2">18+</div>
                  <div className="text-timber-700">Years Experience</div>
                </div>
                <div className="animate-slide-up group" style={{ animationDelay: '0.4s' }}>
                  <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/15 transition-colors">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-timber-600 mb-2">5000+</div>
                  <div className="text-timber-700">Happy Customers</div>
                </div>
                <div className="animate-slide-up group" style={{ animationDelay: '0.8s' }}>
                  <div className="w-16 h-16 bg-info/10 border border-info/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-info/15 transition-colors">
                    <Clock className="h-8 w-8 text-info" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-timber-600 mb-2">24/7</div>
                  <div className="text-timber-700">Support Available</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
