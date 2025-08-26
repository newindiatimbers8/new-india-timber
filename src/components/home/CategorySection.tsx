
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { getPlaceholderImage, handleImageError } from "@/utils/imageUtils";

const categories = [
  {
    id: "teak",
    title: "Premium Teak Wood",
    description: "Explore our collection of Burma, Ghana, Brazilian, and Indian Sal teak wood options.",
    image: getPlaceholderImage("teak"),
    link: "/products/teak"
  },
  {
    id: "plywood",
    title: "Quality Plywood",
    description: "Century Ply Sainik MR, Marine, Laminated, and Waterproof plywood solutions.",
    image: getPlaceholderImage("plywood"),
    link: "/products/plywood"
  },
  {
    id: "hardwood",
    title: "Hardwood Logs",
    description: "Various hardwood logs perfect for custom projects and specialized needs.",
    image: getPlaceholderImage("hardwood"),
    link: "/products/hardwood"
  },
  {
    id: "rental",
    title: "Rental Solutions",
    description: "Flexible rental options for temporary projects and budget-conscious customers.",
    image: getPlaceholderImage("wood"),
    link: "/products/rental"
  }
];

const CategorySection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated Background with Multiple Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-timber-900 via-forest-800 to-timber-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-timber-600/20 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent)] animate-pulse">
          </div>
        </div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-timber-400/10 rounded-full blur-xl animate-float [animation-delay:0s]">
        </div>
        <div className="absolute top-60 left-20 w-24 h-24 bg-forest-300/10 rounded-full blur-lg animate-float [animation-delay:3s]">
        </div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-timber-500/10 rounded-full blur-2xl animate-float [animation-delay:1s]">
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="animate-fade-in [animation-delay:0.2s]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
              Find Your Perfect Wood Solution
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              From premium teak wood to high-quality plywood, we offer a wide range of 
              <br className="hidden md:block" />
              timber products suited for various needs and preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Link to={category.link} key={category.id} className="no-underline group">
              <Card className={`h-full glassmorphism hover:bg-white/20 transition-all duration-500 transform hover:scale-105 border-white/20 animate-fade-in`} 
                   style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                <div className="h-32 md:h-48 overflow-hidden rounded-t-lg relative">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => handleImageError(e, category.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/10 transition-all duration-300"></div>
                </div>
                <CardContent className="p-4 md:p-6">
                  <CardTitle className="text-sm md:text-xl mb-2 md:mb-3 font-bold leading-tight text-white group-hover:text-timber-200 transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-white/70 line-clamp-2 md:line-clamp-none leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-4 md:p-6 pt-0">
                  <Button variant="ghost" className="text-timber-200 hover:text-white hover:bg-timber-600/30 p-0 text-xs md:text-sm font-semibold group transition-all duration-300">
                    Explore Collection 
                    <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
