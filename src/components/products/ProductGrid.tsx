
import { useState, useEffect } from "react";
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
  ListFilter,
  Grid3X3,
  List,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPlaceholderImage, handleImageError } from "@/utils/imageUtils";
// import { Product } from "@/types/product"; // Not used in this component

// Define WoodProduct interface for type safety
interface WoodProduct {
  id: string;
  name: string;
  category: string;
  grade: string;
  overview: {
    description: string;
    keyBenefits: string[];
  };
  pricing: {
    pricePerSqFt: number | null;
  };
  specifications: {
    density?: string;
    grainPattern?: string;
  };
}

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
  usage: "own_premium" | "own_budget";
  purpose: "commercial" | "residential" | "both";
}

// Helper function to convert database WoodProduct to ProductType
export const convertWoodProductToProductType = (woodProduct: WoodProduct): ProductType => {
  return {
    id: woodProduct.id,
    title: woodProduct.name,
    category: woodProduct.category as "teak" | "plywood" | "hardwood",
    subcategory: woodProduct.grade,
    description: woodProduct.overview.description,
    price: woodProduct.pricing.pricePerSqFt,
    thickness: woodProduct.specifications.density ? `${woodProduct.specifications.density}kg/m³` : undefined,
    color: woodProduct.specifications.grainPattern,
    features: woodProduct.overview.keyBenefits,
    dimensions: undefined, // Not available in current structure
    image: getPlaceholderImage(woodProduct.category),
    stockStatus: "In Stock", // Default status
    usage: woodProduct.grade === 'premium' ? "own_premium" : "own_budget",
    purpose: "both" // Default purpose
  };
};

interface ProductGridProps {
  products: ProductType[] | WoodProduct[];
  title?: string;
  description?: string;
  loading?: boolean;
  error?: string | null;
}

const ProductGrid = ({ products, title, description, loading, error }: ProductGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Convert WoodProduct to ProductType if needed
  const normalizedProducts: ProductType[] = products.map(product => {
    // Check if it's a WoodProduct (has overview property)
    if ('overview' in product) {
      return convertWoodProductToProductType(product as WoodProduct);
    }
    return product as ProductType;
  });
  
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
  
  // Loading state
  if (loading) {
    return (
      <div className="w-full">
        {(title || description) && (
          <div className="mb-6 md:mb-8 text-center md:text-left">
            {title && <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>}
            {description && <p className="text-gray-600 text-sm md:text-base">{description}</p>}
          </div>
        )}
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-timber-600"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        {(title || description) && (
          <div className="mb-6 md:mb-8 text-center md:text-left">
            {title && <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>}
            {description && <p className="text-gray-600 text-sm md:text-base">{description}</p>}
          </div>
        )}
        <div className="text-center py-12">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

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
            <span className="font-medium">{normalizedProducts.length}</span> products found
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
      {normalizedProducts.length === 0 ? (
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
          // Mobile-first: horizontal cards on mobile, responsive grid on desktop
          isMobile 
            ? "grid-cols-1 space-y-3" 
            : "grid-cols-1 sm:grid-cols-2",
          !isMobile && viewMode === "grid" 
            ? "lg:grid-cols-3 xl:grid-cols-4" 
            : "lg:grid-cols-1 xl:grid-cols-1"
        )}>
          {normalizedProducts.map((product) => (
            <Link 
              key={product.id} 
              to={`/products/${product.id}`} 
              className="block no-underline group"
            >
              <Card className={cn(
                "overflow-hidden transition-all duration-300 hover:shadow-lg border-gray-200 hover:border-timber-300 active:scale-[0.98]",
                // Mobile: horizontal layout, Desktop: vertical or list layout
                isMobile 
                  ? "flex flex-row h-32" 
                  : "h-full",
                !isMobile && viewMode === "list" && "lg:flex lg:flex-row"
              )}>
                <div className={cn(
                  "relative overflow-hidden bg-gray-50 flex-shrink-0",
                  isMobile 
                    ? "w-32 h-full" 
                    : viewMode === "grid" 
                      ? "aspect-square" 
                      : "aspect-square lg:w-1/3 lg:aspect-auto"
                )}>
                  <img
                    src={product.image || getPlaceholderImage(product.category)}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => handleImageError(e, product.category)}
                  />
                  <Badge 
                    className={cn(
                      "absolute text-xs",
                      isMobile ? "top-1 right-1 text-xs" : "top-2 right-2",
                      getStockStatusColor(product.stockStatus)
                    )}
                  >
                    {isMobile ? (product.stockStatus === "In Stock" ? "✓" : "!") : product.stockStatus}
                  </Badge>
                  
                  {/* Usage Badge */}
                  <Badge 
                    className={cn(
                      "absolute bg-white/90 text-gray-800 text-xs",
                      isMobile ? "top-1 left-1 px-1 py-0" : "top-2 left-2"
                    )}
                    variant="secondary"
                  >
                    {isMobile 
                      ? (product.usage === 'own_premium' ? 'P' : 'B')
                      : (product.usage === 'own_premium' ? 'Premium' : 
                         product.usage === 'own_budget' ? 'Budget' : 'Standard')
                    }
                  </Badge>
                </div>
                
                <div className={cn(
                  "flex flex-col min-w-0",
                  isMobile ? "flex-1 p-3" : "flex-col",
                  !isMobile && viewMode === "list" && "lg:w-2/3"
                )}>
                  <CardContent className={cn(
                    "flex-1",
                    isMobile ? "p-0" : "p-4"
                  )}>
                    <div className={cn(
                      "flex items-start justify-between",
                      isMobile ? "mb-1" : "mb-2"
                    )}>
                      <CardTitle className={cn(
                        "line-clamp-2 group-hover:text-timber-700 transition-colors pr-2",
                        isMobile ? "text-sm font-medium" : "text-lg md:text-xl"
                      )}>
                        {product.title}
                      </CardTitle>
                    </div>
                    
                    <CardDescription className={cn(
                      "text-gray-600 line-clamp-2",
                      isMobile ? "text-xs mb-1" : "text-sm mb-3"
                    )}>
                      {product.description}
                    </CardDescription>
                    
                    {/* Product Details - Compact for mobile */}
                    {!isMobile && (
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
                    )}
                    
                    {/* Compact info for mobile */}
                    {isMobile && (
                      <div className="flex items-center justify-between">
                        <div>
                          <Link 
                            to="/contact" 
                            className="text-timber-700 font-medium text-xs bg-timber-50 px-2 py-1 rounded hover:text-timber-800 hover:bg-timber-100 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Pre-fill contact form with product info
                              const productInfo = `Product: ${product.title}\nCategory: ${product.category}\nSubcategory: ${product.subcategory}`;
                              window.location.href = `/contact?product=${encodeURIComponent(productInfo)}`;
                            }}
                          >
                            Contact for Price
                          </Link>
                        </div>
                        
                      </div>
                    )}
                    
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
                  
                  {/* Desktop Footer - Hidden on mobile since mobile has inline footer */}
                  {!isMobile && (
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div>
                        <Link 
                          to="/contact" 
                          className="text-timber-700 font-medium text-sm hover:text-timber-800 hover:underline transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Pre-fill contact form with product info
                            const productInfo = `Product: ${product.title}\nCategory: ${product.category}\nSubcategory: ${product.subcategory}`;
                            window.location.href = `/contact?product=${encodeURIComponent(productInfo)}`;
                          }}
                        >
                          Contact for Price
                        </Link>
                      </div>
                      
                    </CardFooter>
                  )}
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
