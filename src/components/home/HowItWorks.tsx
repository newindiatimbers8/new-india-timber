import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Palette,
  Truck,
  BarChart3,
  Home,
  ArrowRight,
  CheckCircle,
  Phone,
  Users,
  Award,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Consult Our Expert",
      subtitle: "Connect with specialists",
      description: "Meet with our timber experts to discuss your project requirements, budget, and timeline.",
      icon: MessageCircle,
      color: "primary",
      benefits: ["Expert Guidance", "Project Planning", "Budget Analysis"]
    },
    {
      number: 2,
      title: "Planning & Selection",
      subtitle: "Choose materials",
      description: "Select from our premium collection of teak, plywood, and hardwood with expert guidance.",
      icon: Palette,
      color: "accent",
      benefits: ["Material Selection", "Quality Options", "Design Support"]
    },
    {
      number: 3,
      title: "Quality Check",
      subtitle: "Ensure excellence",
      description: "Every piece of timber undergoes rigorous quality checks before delivery to your project site.",
      icon: CheckCircle,
      color: "success",
      benefits: ["Quality Assurance", "Certification", "Inspection"]
    },
    {
      number: 4,
      title: "Delivery & Installation",
      subtitle: "Professional service",
      description: "Timely delivery with optional installation services to ensure perfect execution of your project.",
      icon: Truck,
      color: "info",
      benefits: ["Fast Delivery", "Installation", "Project Support"]
    },
    {
      number: 5,
      title: "Project Complete",
      subtitle: "Your dream realized",
      description: "Enjoy your beautiful timber project with ongoing support and maintenance guidance.",
      icon: Home,
      color: "primary",
      benefits: ["Project Handover", "Maintenance Guide", "Ongoing Support"]
    }
  ];

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
        <div className="absolute top-32 right-10 w-32 h-32 bg-primary/5 rounded-2xl transform rotate-45 animate-float opacity-30" style={{ animationDelay: '1s' }} />
        <div className="absolute top-80 left-20 w-28 h-28 bg-accent/10 rounded-full animate-float opacity-40" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-40 right-1/3 w-40 h-40 bg-secondary/10 rounded-3xl transform -rotate-12 animate-float opacity-20" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Badge variant="secondary" className="mb-4 bg-primary/10 border-primary/20 text-primary">
              <Users className="w-4 h-4 mr-1" />
              Our Process
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 md:mb-6">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We have a streamlined, systematic approach to turn your
              <br className="hidden md:block" />
              construction dreams into reality.
            </p>
          </div>
        </div>

        {/* Enhanced Process Steps */}
        <div className="relative">
          {/* Desktop Connection Lines */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-border rounded-full z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent via-green-500 via-blue-500 to-primary opacity-60 rounded-full animate-pulse"></div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colorClasses = {
                primary: "bg-primary text-primary-foreground border-primary/20",
                accent: "bg-accent text-accent-foreground border-accent/20",
                success: "bg-green-500 text-white border-green-500/20",
                info: "bg-blue-500 text-white border-blue-500/20"
              };

              return (
                <div key={step.number} className="relative">
                  {/* Mobile Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden absolute left-8 top-20 w-1 h-16 bg-border rounded-full z-0">
                      <div className={`absolute inset-0 ${colorClasses[step.color as keyof typeof colorClasses]} opacity-60 rounded-full`}></div>
                    </div>
                  )}

                  <Card className={cn(
                    "relative bg-card border border-border hover:border-primary/20",
                    "transition-all duration-300 transform hover:scale-105 hover:-translate-y-1",
                    "group animate-slide-up shadow-lg hover:shadow-xl"
                  )} style={{ animationDelay: `${0.4 + index * 0.1}s` }}>

                    <CardContent className="p-6 text-center">
                      {/* Step Number & Icon */}
                      <div className="relative mb-4">
                        <div className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                          "group-hover:scale-110 transition-transform duration-300 shadow-lg",
                          colorClasses[step.color as keyof typeof colorClasses]
                        )}>
                          <span className="font-bold text-lg">{step.number}</span>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-12 h-12 bg-card border-2 border-border rounded-full flex items-center justify-center group-hover:border-primary/30 transition-colors">
                            <Icon className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-6">
                        <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground mb-3">
                          {step.subtitle}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                          {step.description}
                        </p>

                        {/* Benefits */}
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                          {step.benefits.map((benefit, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-muted/50">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center mt-16 md:mt-20 animate-slide-up" style={{ animationDelay: '1.0s' }}>
          <Card className="bg-card border border-border shadow-lg max-w-3xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
                Ready To Start Your Project?
              </h3>
              <p className="text-muted-foreground mb-8 md:mb-10">
                Get a free consultation and estimate for your timber project today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    "px-8 py-4 rounded-xl shadow-lg hover:shadow-xl",
                    "transition-all duration-300 transform hover:scale-105 group"
                  )}
                >
                  <a href="https://wa.me/919886033342?text=Hello%20I%20am%20interested%20in%20your%20services" target="_blank" rel="noopener noreferrer">
                    Start Your Project Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={cn(
                    "border-border text-foreground hover:bg-accent hover:text-accent-foreground",
                    "px-8 py-4 rounded-xl transition-all duration-300"
                  )}
                >
                  <Link to="/contact">
                    Get Free Consultation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 md:mt-20 animate-slide-up" style={{ animationDelay: '1.2s' }}>
          <div className="text-center group">
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold text-lg text-foreground mb-2">Quality Guaranteed</h4>
            <p className="text-muted-foreground">Premium timber with certification</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/15 transition-colors">
              <Clock className="h-8 w-8 text-accent" />
            </div>
            <h4 className="font-semibold text-lg text-foreground mb-2">Timely Delivery</h4>
            <p className="text-muted-foreground">On-time delivery across Bangalore</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-info/10 border border-info/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-info/15 transition-colors">
              <BarChart3 className="h-8 w-8 text-info" />
            </div>
            <h4 className="font-semibold text-lg text-foreground mb-2">18+ Years Experience</h4>
            <p className="text-muted-foreground">Trusted by customers since 2005</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;