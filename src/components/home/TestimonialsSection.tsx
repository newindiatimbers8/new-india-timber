
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Interior Designer",
    content: "We've been sourcing our teak wood from New India Timber for over 5 years. The quality is consistent, and their Burma Teak is simply outstanding for our premium interior projects.",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Homeowner",
    content: "I renovated my home with their Century Ply Sainik MR products. The team was helpful in guiding me through the selection process, and the end result exceeded my expectations.",
    rating: 5
  },
  {
    id: 3,
    name: "Karthik Reddy",
    role: "Construction Contractor",
    content: "For bulk orders, New India Timber has been our go-to supplier. Their delivery is prompt, pricing competitive, and they understand our commercial project needs perfectly.",
    rating: 4
  },
  {
    id: 4,
    name: "Meena Nair",
    role: "Furniture Maker",
    content: "The Ghana Teak I purchased was of exceptional quality. My clients love the furniture pieces I create using their premium wood. Highly recommended!",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated Background with Multiple Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-timber-900 to-forest-800">
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-forest-600/20 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent)] animate-pulse">
          </div>
        </div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-32 h-32 bg-timber-400/10 rounded-full blur-xl animate-float [animation-delay:3s]">
        </div>
        <div className="absolute bottom-40 left-10 w-28 h-28 bg-forest-300/10 rounded-full blur-lg animate-float [animation-delay:0s]">
        </div>
        <div className="absolute top-20 left-1/2 w-36 h-36 bg-timber-500/10 rounded-full blur-2xl animate-float [animation-delay:5s]">
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="animate-fade-in [animation-delay:0.2s]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
              What Our Customers Say
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from our 
              <br className="hidden md:block" />
              satisfied customers across Bangalore.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto animate-fade-in [animation-delay:0.4s]">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4">
                    <div className={`glassmorphism p-6 md:p-8 rounded-2xl h-full flex flex-col hover:bg-white/20 transition-all duration-500 transform hover:scale-105 group animate-fade-in border-white/20`}
                         style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                      {/* Rating */}
                      <div className="flex mb-6 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={`${
                              i < testimonial.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-white/30"
                            } transition-colors duration-300`}
                          />
                        ))}
                      </div>
                      
                      {/* Content */}
                      <p className="text-white/80 italic mb-8 flex-grow leading-relaxed text-center group-hover:text-white/90 transition-colors">
                        "{testimonial.content}"
                      </p>
                      
                      {/* Author */}
                      <div className="text-center">
                        <div className="w-16 h-16 bg-timber-500/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-timber-500/40 transition-colors">
                          <span className="text-xl font-bold text-white">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <p className="font-bold text-lg text-white group-hover:text-timber-200 transition-colors">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-white/60 group-hover:text-white/70 transition-colors">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 glassmorphism border-white/20 text-white hover:bg-white/20" />
            <CarouselNext className="right-4 glassmorphism border-white/20 text-white hover:bg-white/20" />
          </Carousel>
        </div>
        
        {/* Trust Badge */}
        <div className="text-center mt-12 md:mt-16 animate-fade-in [animation-delay:1.0s]">
          <div className="glassmorphism rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join 5000+ Satisfied Customers
            </h3>
            <p className="text-white/70 mb-6">
              Experience the New India Timber difference today.
            </p>
            <div className="flex items-center justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="text-white/80 ml-2 font-semibold">4.9/5 Average Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
