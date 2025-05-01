
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
  List
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProductFilter from "./ProductFilter";

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
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(products);
  
  const handleFilterChange = (filtered: ProductType[]) => {
    setFilteredProducts(filtered);
  };
  
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
    <div>
      {(title || description) && (
        <div className="mb-8">
          {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilter products={products} onFilterChange={handleFilterChange} />
        </div>
        
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} products
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={cn(
                  viewMode === "grid" ? "bg-accent" : "bg-transparent"
                )}
              >
                <Grid3X3 size={18} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn(
                  viewMode === "list" ? "bg-accent" : "bg-transparent"
                )}
              >
                <List size={18} />
              </Button>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <ListFilter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No products found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your filters or search criteria.
              </p>
            </div>
          ) : (
            <div className={cn(
              "grid gap-6",
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.category}/${product.id}`} className="no-underline">
                  <Card className={cn(
                    "h-full overflow-hidden card-hover",
                    viewMode === "list" && "flex flex-col md:flex-row"
                  )}>
                    <div className={cn(
                      "relative overflow-hidden",
                      viewMode === "grid" ? "h-48" : "h-48 md:w-1/3 md:h-auto"
                    )}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <Badge 
                        className={cn(
                          "absolute top-2 right-2",
                          getStockStatusColor(product.stockStatus)
                        )}
                      >
                        {product.stockStatus}
                      </Badge>
                    </div>
                    
                    <div className={cn(
                      "flex flex-col",
                      viewMode === "list" && "md:w-2/3"
                    )}>
                      <CardContent className={cn("pt-6", viewMode === "list" && "md:pt-4")}>
                        <CardTitle className="text-xl mb-2">{product.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {product.description}
                        </CardDescription>
                        
                        {viewMode === "list" && (
                          <div className="mt-3 space-y-1">
                            {product.thickness && (
                              <p className="text-sm">Thickness: {product.thickness}</p>
                            )}
                            {product.dimensions && (
                              <p className="text-sm">Dimensions: {product.dimensions}</p>
                            )}
                            {product.color && (
                              <p className="text-sm">Color: {product.color}</p>
                            )}
                            {product.features && product.features.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {product.features.map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="font-normal">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="pt-0 flex justify-between items-center mt-auto">
                        <div>
                          {product.price ? (
                            <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                          ) : (
                            <span className="text-forest-700 font-medium">Request for Price</span>
                          )}
                        </div>
                        
                        {product.usage === "rental" ? (
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Clock size={16} /> Rent
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <ShoppingCart size={16} /> Buy
                          </Button>
                        )}
                      </CardFooter>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
