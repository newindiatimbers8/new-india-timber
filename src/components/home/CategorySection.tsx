
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Package, Layers } from "lucide-react";
import { getPlaceholderImage, handleImageError } from "@/utils/imageUtils";
import { cn } from "@/utils";

const categories = [
  {
    id: "teak",
    title: "Premium Teak Wood",
    description: "Explore our collection of Burma, Ghana, Brazilian, and Indian Sal teak wood options.",
    image: "/images/teak-wood.jpg",
    link: "/products?category=teak",
    features: ["Premium Quality", "Certified", "Durable"],
    badge: "Most Popular"
  },
  {
    id: "plywood",
    title: "Quality Plywood",
    description: "Century Ply Sainik MR, Marine, Laminated, and Waterproof plywood solutions.",
    image: "/images/plywood.jpg",
    link: "/products?category=plywood",
    features: ["Water Resistant", "Strong", "Versatile"],
    badge: "Best Seller"
  },
  {
    id: "hardwood",
    title: "Hardwood Logs",
    description: "Various hardwood logs perfect for custom projects and specialized needs.",
    image: "/images/hardwood-logs.jpg",
    link: "/products?category=hardwood",
    features: ["Natural", "Customizable", "Premium"],
    badge: "Premium"
  }
];

const CategorySection = () => {
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
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-2xl transform rotate-45 animate-float opacity-30" />
        <div className="absolute top-60 left-20 w-24 h-24 bg-accent/10 rounded-full animate-float opacity-40" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-secondary/10 rounded-3xl transform -rotate-12 animate-float opacity-20" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Badge variant="secondary" className="mb-4 bg-primary/10 border-primary/20 text-primary">
              <Package className="w-4 h-4 mr-1" />
              Product Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 md:mb-6 text-foreground">
              Find Your Perfect Wood Solution
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From premium teak wood to high-quality plywood, we offer a wide range of
              <br className="hidden md:block" />
              timber products suited for various needs and preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              className={cn(
                "h-full bg-card border border-border shadow-lg hover:shadow-xl cursor-pointer",
                "transition-all duration-300 transform hover:scale-105 hover:-translate-y-1",
                "animate-slide-up hover:border-primary/20"
              )}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              onClick={() => window.location.href = category.link}
            >

                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground text-xs">
                    {category.badge}
                  </Badge>
                </div>

                {/* Image Container */}
                <div className="h-48 md:h-56 overflow-hidden rounded-t-lg relative">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => handleImageError(e, category.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent group-hover:from-background/10 transition-all duration-300"></div>

                  {/* Feature Icons Overlay */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                    {category.features.slice(0, 2).map((feature, idx) => (
                      <div key={idx} className="bg-card/80 backdrop-blur-sm rounded-full p-1.5">
                        <div className="w-2 h-2 bg-primary rounded-full" title={feature} />
                      </div>
                    ))}
                  </div>
                </div>

                <CardContent className="p-6">
                  <CardTitle className="text-lg md:text-xl mb-3 font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                    {category.description}
                  </CardDescription>

                  {/* Features List */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-muted/50">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button asChild variant="ghost" className="w-full justify-between text-primary hover:text-primary-foreground hover:bg-primary p-0 text-sm font-semibold transition-all duration-300">
                    <Link to={category.link}>
                      Explore Collection
                      <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 md:mt-16 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-muted-foreground mb-6">Can't find what you're looking for?</p>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/products">
              <Layers className="w-4 h-4 mr-2" />
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
