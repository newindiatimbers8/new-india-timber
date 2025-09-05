import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  // Calculator, // COMMENTED OUT 
  Palette, 
  Truck, 
  BarChart3, 
  Home,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Consult Our Expert",
      subtitle: "Connect with specialists",
      description: "Meet with our timber experts to discuss your project requirements, budget, and timeline.",
      icon: MessageCircle,
      color: "bg-blue-500"
    },
    // ESTIMATOR STEP COMMENTED OUT
    // {
    //   number: 2,
    //   title: "Get Estimate",
    //   subtitle: "Transparent pricing",
    //   description: "Receive detailed estimates for materials, with options for premium and budget solutions.",
    //   icon: Calculator,
    //   color: "bg-green-500"
    // },
    {
      number: 2,
      title: "Planning & Selection",
      subtitle: "Choose materials",
      description: "Select from our premium collection of teak, plywood, and hardwood with expert guidance.",
      icon: Palette,
      color: "bg-purple-500"
    },
    {
      number: 3,
      title: "Quality Check",
      subtitle: "Ensure excellence",
      description: "Every piece of timber undergoes rigorous quality checks before delivery to your project site.",
      icon: CheckCircle,
      color: "bg-amber-500"
    },
    {
      number: 4,
      title: "Delivery & Installation",
      subtitle: "Professional service",
      description: "Timely delivery with optional installation services to ensure perfect execution of your project.",
      icon: Truck,
      color: "bg-red-500"
    },
    {
      number: 6,
      title: "Project Complete",
      subtitle: "Your dream realized",
      description: "Enjoy your beautiful timber project with ongoing support and maintenance guidance.",
      icon: Home,
      color: "bg-timber-600"
    }
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated Background with Multiple Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-timber-900 via-forest-800 to-timber-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-timber-600/20 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.1),transparent)] animate-pulse">
          </div>
        </div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-32 h-32 bg-timber-400/10 rounded-full blur-xl animate-float [animation-delay:1s]">
        </div>
        <div className="absolute top-80 left-20 w-28 h-28 bg-forest-300/10 rounded-full blur-lg animate-float [animation-delay:4s]">
        </div>
        <div className="absolute bottom-40 right-1/3 w-40 h-40 bg-timber-500/10 rounded-full blur-2xl animate-float [animation-delay:2s]">
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="animate-fade-in [animation-delay:0.2s]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              We have a streamlined, systematic approach to turn your
              <br className="hidden md:block" />
              construction dreams into reality.
            </p>
          </div>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Desktop Connection Lines */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-white/20 rounded-full z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-green-400 via-purple-400 via-amber-400 via-red-400 to-timber-400 opacity-60 rounded-full animate-glow"></div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 lg:gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  {/* Mobile Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden absolute left-8 top-20 w-1 h-16 bg-white/20 rounded-full z-0">
                      <div className={`absolute inset-0 ${step.color} opacity-60 rounded-full`}></div>
                    </div>
                  )}

                  <Card className={`relative glassmorphism hover:bg-white/20 border-white/20 transition-all duration-500 transform hover:scale-105 group animate-fade-in`}
                       style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                    <CardContent className="p-6 text-center">
                      {/* Step Number & Icon */}
                      <div className="relative mb-4">
                        <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <span className="text-white font-bold text-lg">{step.number}</span>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-12 h-12 glassmorphism-dark border-2 border-white/30 rounded-full flex items-center justify-center group-hover:border-timber-300 transition-colors">
                            <Icon className="h-5 w-5 text-white/80 group-hover:text-timber-200 transition-colors" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-6">
                        <h3 className="font-bold text-lg text-white mb-1 group-hover:text-timber-200 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm font-medium text-white/60 mb-3">
                          {step.subtitle}
                        </p>
                        <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">
                          {step.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 md:mt-20 animate-fade-in [animation-delay:1.0s]">
          <div className="glassmorphism rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready To Start Your Project?
            </h3>
            <p className="text-white/70 mb-8 md:mb-10">
              Get a free consultation and estimate for your timber project today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* ESTIMATOR LINK COMMENTED OUT
              <Link to="/estimator">
                <Button 
                  size="lg" 
                  className="bg-timber-600 hover:bg-timber-700 text-white px-8 py-4 rounded-full shadow-2xl hover:shadow-timber-500/25 transition-all duration-300 transform hover:scale-105 group"
                >
                  Start Your Project Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              */}
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="glassmorphism-dark border-2 border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Get Free Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 md:mt-20 animate-fade-in [animation-delay:1.2s]">
          <div className="text-center">
            <div className="w-16 h-16 glassmorphism-dark rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
              <CheckCircle className="h-8 w-8 text-timber-200" />
            </div>
            <h4 className="font-bold text-lg text-white mb-2">Quality Guaranteed</h4>
            <p className="text-white/60">Premium timber with certification</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 glassmorphism-dark rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
              <Truck className="h-8 w-8 text-timber-200" />
            </div>
            <h4 className="font-bold text-lg text-white mb-2">Timely Delivery</h4>
            <p className="text-white/60">On-time delivery across Bangalore</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 glassmorphism-dark rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
              <BarChart3 className="h-8 w-8 text-timber-200" />
            </div>
            <h4 className="font-bold text-lg text-white mb-2">18+ Years Experience</h4>
            <p className="text-white/60">Trusted by customers since 2005</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;