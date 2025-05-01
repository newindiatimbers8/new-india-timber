
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
    content: "We've been sourcing our teak wood from South Indian Timbers for over 5 years. The quality is consistent, and their Burma Teak is simply outstanding for our premium interior projects.",
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
    content: "For bulk orders, South Indian Timbers has been our go-to supplier. Their delivery is prompt, pricing competitive, and they understand our commercial project needs perfectly.",
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4">
                    <div className="bg-timber-50 p-6 rounded-xl h-full flex flex-col">
                      {/* Rating */}
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < testimonial.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* Content */}
                      <p className="text-gray-700 italic mb-6 flex-grow">"{testimonial.content}"</p>
                      
                      {/* Author */}
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 bg-white" />
            <CarouselNext className="right-0 bg-white" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
