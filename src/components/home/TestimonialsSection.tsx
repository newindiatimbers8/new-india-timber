
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Users, Award } from "lucide-react";
import { cn } from "@/utils";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Interior Designer",
    content: "We've been sourcing our teak wood from New India Timber for over 5 years. The quality is consistent, and their Burma Teak is simply outstanding for our premium interior projects.",
    rating: 5,
    project: "Premium Interior Design",
    location: "Bangalore"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Homeowner",
    content: "I renovated my home with their Century Ply Sainik MR products. The team was helpful in guiding me through the selection process, and the end result exceeded my expectations.",
    rating: 5,
    project: "Home Renovation",
    location: "Whitefield, Bangalore"
  },
  {
    id: 3,
    name: "Karthik Reddy",
    role: "Construction Contractor",
    content: "For bulk orders, New India Timber has been our go-to supplier. Their delivery is prompt, pricing competitive, and they understand our commercial project needs perfectly.",
    rating: 4,
    project: "Commercial Construction",
    location: "Marathahalli, Bangalore"
  },
  {
    id: 4,
    name: "Meena Nair",
    role: "Furniture Maker",
    content: "The Ghana Teak I purchased was of exceptional quality. My clients love the furniture pieces I create using their premium wood. Highly recommended!",
    rating: 5,
    project: "Custom Furniture",
    location: "HSR Layout, Bangalore"
  }
];

const TestimonialsSection = () => {
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
        <div className="absolute top-40 right-20 w-32 h-32 bg-primary/5 rounded-2xl transform rotate-45 animate-float opacity-30" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-40 left-10 w-28 h-28 bg-accent/10 rounded-full animate-float opacity-40" style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 left-1/2 w-36 h-36 bg-secondary/10 rounded-3xl transform -rotate-12 animate-float opacity-20" style={{ animationDelay: '5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Badge variant="secondary" className="mb-4 bg-primary/10 border-primary/20 text-primary">
              <Users className="w-4 h-4 mr-1" />
              Customer Reviews
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 md:mb-6">
              What Our Customers Say
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from our
              <br className="hidden md:block" />
              satisfied customers across Bangalore.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4">
                    <Card className={cn(
                      "relative bg-card border border-border hover:border-primary/20",
                      "transition-all duration-300 transform hover:scale-105 hover:-translate-y-1",
                      "group animate-slide-up shadow-lg hover:shadow-xl h-full"
                    )} style={{ animationDelay: `${0.6 + index * 0.1}s` }}>

                      <CardContent className="p-6 md:p-8 flex flex-col h-full">
                        {/* Quote Icon */}
                        <div className="mb-6">
                          <Quote className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors" />
                        </div>

                        {/* Rating */}
                        <div className="flex mb-6 justify-start">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={cn(
                                "transition-colors duration-300",
                                i < testimonial.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>

                        {/* Content */}
                        <p className="text-muted-foreground italic mb-8 flex-grow leading-relaxed group-hover:text-foreground/80 transition-colors">
                          "{testimonial.content}"
                        </p>

                        {/* Author Info */}
                        <div className="mt-auto">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                              <span className="text-primary font-bold text-lg">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                {testimonial.name}
                              </p>
                              <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors">
                                {testimonial.role}
                              </p>
                            </div>
                          </div>

                          {/* Project & Location */}
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs bg-muted/50">
                              {testimonial.project}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-muted/50">
                              {testimonial.location}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground" />
            <CarouselNext className="right-4 bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground" />
          </Carousel>
        </div>

        {/* Enhanced Trust Badge */}
        <div className="text-center mt-12 md:mt-16 animate-slide-up" style={{ animationDelay: '1.0s' }}>
          <Card className="bg-card border border-border shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
                Join 5000+ Satisfied Customers
              </h3>
              <p className="text-muted-foreground mb-6">
                Experience the New India Timber difference today.
              </p>
              <div className="flex items-center justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
                ))}
                <span className="text-foreground/80 ml-2 font-semibold">4.9/5 Average Rating</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
