
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Clock, 
  Tag, 
  ChevronRight,
  ListFilter,
  Grid3X3,
  List,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPlaceholderImage, handleImageError } from "@/utils/imageUtils";

export interface ProductType {
  id: string;
  title: string;
  category: "teak" | "plywood" | "hardwood";
  subcategory: string;
  description: string;
  price: number | null; // null for "Request for Price"
  thickness?: string;
  color?: string;
  features?: string[];
  dimensions?: string;
  image: string;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  usage: "own_premium" | "own_budget" | "rental";
  purpose: "commercial" | "residential" | "both";
}

interface ProductGridProps {
  products: ProductType[];
  title?: string;
  description?: string;
}

const ProductGrid = ({ products, title, description }: ProductGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Low Stock":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "Out of Stock":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  return (
    <div className="w-full">
      {(title || description) && (
        <div className="mb-6 md:mb-8 text-center md:text-left">
          {title && <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>}
          {description && <p className="text-gray-600 text-sm md:text-base">{description}</p>}
        </div>
      )}
      
      {/* Mobile-First Product Controls */}
      <div className="flex justify-between items-center mb-4 md:mb-6 bg-gray-50 p-3 md:p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <p className="text-sm text-gray-600">
            <span className="font-medium">{products.length}</span> products found
          </p>
        </div>
        
        {/* View Mode Toggle - Hidden on mobile by default, shown on larger screens */}
        <div className="hidden md:flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={cn(
              "h-8 w-8 p-0",
              viewMode === "grid" ? "bg-timber-100 text-timber-700" : "text-gray-500"
            )}
          >
            <Grid3X3 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className={cn(
              "h-8 w-8 p-0",
              viewMode === "list" ? "bg-timber-100 text-timber-700" : "text-gray-500"
            )}
          >
            <List size={16} />
          </Button>
        </div>
      </div>
      
      {/* Product Grid/List */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <ListFilter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-4 md:gap-6",
          // Mobile-first: always grid on mobile, responsive on desktop
          "grid-cols-1 sm:grid-cols-2",
          viewMode === "grid" 
            ? "lg:grid-cols-3 xl:grid-cols-4" 
            : "lg:grid-cols-1 xl:grid-cols-1"
        )}>
          {products.map((product) => (
            <Link 
              key={product.id} 
              to={`/products/${product.category}/${product.id}`} 
              className="block no-underline group"
            >
              <Card className={cn(
                "h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-gray-200 hover:border-timber-300",
                viewMode === "list" && "lg:flex lg:flex-row"
              )}>
                <div className={cn(
                  "relative overflow-hidden bg-gray-50",
                  viewMode === "grid" ? "aspect-square" : "aspect-square lg:w-1/3 lg:aspect-auto"
                )}>
                  <img
                    src={product.image || getPlaceholderImage(product.category)}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => handleImageError(e, product.category)}
                  />
                  <Badge 
                    className={cn(
                      "absolute top-2 right-2 text-xs",
                      getStockStatusColor(product.stockStatus)
                    )}
                  >
                    {product.stockStatus}
                  </Badge>
                  
                  {/* Usage Badge */}
                  <Badge 
                    className="absolute top-2 left-2 bg-white/90 text-gray-800 text-xs"
                    variant="secondary"
                  >
                    {product.usage === 'own_premium' ? 'Premium' : 
                     product.usage === 'own_budget' ? 'Budget' : 'Rental'}
                  </Badge>
                </div>
                
                <div className={cn(
                  "flex flex-col",
                  viewMode === "list" && "lg:w-2/3"
                )}>
                  <CardContent className="p-4 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg md:text-xl line-clamp-2 group-hover:text-timber-700 transition-colors">
                        {product.title}
                      </CardTitle>
                    </div>
                    
                    <CardDescription className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {product.description}
                    </CardDescription>
                    
                    {/* Product Details */}
                    <div className="space-y-1 text-xs text-gray-500">
                      {product.thickness && (
                        <p>Thickness: <span className="text-gray-700">{product.thickness}</span></p>
                      )}
                      {product.dimensions && (
                        <p>Size: <span className="text-gray-700">{product.dimensions}</span></p>
                      )}
                      {product.color && (
                        <p>Color: <span className="text-gray-700">{product.color}</span></p>
                      )}
                    </div>
                    
                    {/* Features - Show on larger screens or list view */}
                    {product.features && product.features.length > 0 && (
                      <div className={cn(
                        "mt-3",
                        viewMode === "grid" ? "hidden md:block" : "block"
                      )}>
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs py-0 px-2">
                              {feature}
                            </Badge>
                          ))}
                          {product.features.length > 3 && (
                            <Badge variant="outline" className="text-xs py-0 px-2">
                              +{product.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div>
                      {product.price ? (
                        <div>
                          <span className="font-bold text-lg md:text-xl text-timber-600">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.category === 'plywood' && (
                            <span className="text-xs text-gray-500 ml-1">/sq ft</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-timber-700 font-medium text-sm">Request Price</span>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className={cn(
                        "h-8 px-3 text-xs",
                        product.usage === "rental" 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "bg-timber-600 hover:bg-timber-700"
                      )}
                    >
                      {product.usage === "rental" ? (
                        <>
                          <Clock size={14} className="mr-1" /> 
                          Rent
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} className="mr-1" /> 
                          Buy
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
