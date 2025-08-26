
import { Shield, Truck, Clock, PersonStanding, Zap } from "lucide-react";

const features = [
  {
    icon: <Shield className="w-10 h-10 text-timber-200" />,
    title: "Quality Assurance",
    description: "All our products go through rigorous quality checks to ensure long-lasting performance."
  },
  {
    icon: <Truck className="w-10 h-10 text-timber-200" />,
    title: "Prompt Delivery",
    description: "Fast and reliable delivery across Bangalore with options for scheduled installations."
  },
  {
    icon: <Clock className="w-10 h-10 text-timber-200" />,
    title: "Experience",
    description: "Over 15 years of experience providing premium timber solutions in Bangalore."
  },
  {
    icon: <PersonStanding className="w-10 h-10 text-timber-200" />,
    title: "Expert Advice",
    description: "Our consultants help you choose the right wood for your specific requirements."
  },
  {
    icon: <Zap className="w-10 h-10 text-timber-200" />,
    title: "Custom Solutions",
    description: "Tailor-made timber solutions for both residential and commercial projects."
  }
];

const FeaturesSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated Background with Multiple Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-timber-900 via-forest-800 to-timber-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-timber-600/20 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent)] animate-pulse">
          </div>
        </div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-timber-400/10 rounded-full blur-xl animate-float [animation-delay:1s]">
        </div>
        <div className="absolute top-80 right-10 w-24 h-24 bg-forest-300/10 rounded-full blur-lg animate-float [animation-delay:4s]">
        </div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-timber-500/10 rounded-full blur-2xl animate-float [animation-delay:2s]">
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="animate-fade-in [animation-delay:0.2s]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
              Why Choose New India Timber?
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              We're committed to providing quality timber products 
              <br className="hidden md:block" />
              with exceptional service and expertise.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`glassmorphism p-6 md:p-8 rounded-2xl hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group animate-fade-in border-white/20`}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-timber-500/20 rounded-2xl group-hover:bg-timber-500/30 transition-all duration-300 group-hover:scale-110">
                  <div className="text-timber-200 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-white group-hover:text-timber-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 md:mt-20 animate-fade-in [animation-delay:1.2s]">
          <div className="glassmorphism rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="animate-slide-in-left">
                <div className="text-3xl md:text-4xl font-bold text-timber-200 mb-2">18+</div>
                <div className="text-white/70">Years Experience</div>
              </div>
              <div className="animate-fade-in [animation-delay:0.4s]">
                <div className="text-3xl md:text-4xl font-bold text-timber-200 mb-2">5000+</div>
                <div className="text-white/70">Happy Customers</div>
              </div>
              <div className="animate-slide-in-right">
                <div className="text-3xl md:text-4xl font-bold text-timber-200 mb-2">24/7</div>
                <div className="text-white/70">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
