
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

const categories = [
  {
    id: "teak",
    title: "Premium Teak Wood",
    description: "Explore our collection of Burma, Ghana, Brazilian, and Indian Sal teak wood options.",
    image: "/images/wood-texture.jpg",
    link: "/products/teak"
  },
  {
    id: "plywood",
    title: "Quality Plywood",
    description: "Century Ply Sainik MR, Marine, Laminated, and Waterproof plywood solutions.",
    image: "/images/wood-texture.jpg",
    link: "/products/plywood"
  },
  {
    id: "hardwood",
    title: "Hardwood Logs",
    description: "Various hardwood logs perfect for custom projects and specialized needs.",
    image: "/images/wood-texture.jpg",
    link: "/products/hardwood"
  },
  {
    id: "rental",
    title: "Rental Solutions",
    description: "Flexible rental options for temporary projects and budget-conscious customers.",
    image: "/images/wood-texture.jpg",
    link: "/products/rental"
  }
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-timber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Product Categories</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From premium teak wood to high-quality plywood, we offer a wide range of timber products suited for various needs and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link to={category.link} key={category.id} className="no-underline">
              <Card className="h-full card-hover">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardContent className="pt-6">
                  <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-timber-600 hover:text-timber-700 hover:bg-timber-50 p-0">
                    View Products <ChevronRight size={16} className="ml-1" />
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
