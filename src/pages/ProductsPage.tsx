
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProductGrid, { ProductType } from "../components/products/ProductGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, SlidersHorizontal, X, Search } from "lucide-react";
import { getPlaceholderImage } from "../utils/imageUtils";
import { cn } from "@/lib/utils";

// Sample product data
const sampleProducts: ProductType[] = [
  {
    id: "burma-teak-door",
    title: "Burma Teak Door",
    category: "teak",
    subcategory: "Burma Teak",
    description: "Premium quality Burma teak door with rich grain pattern and exceptional durability. Perfect for main entrances.",
    price: 50000,
    dimensions: "7ft x 3.5ft",
    color: "Dark Brown",
    features: ["Water Resistant", "Termite Proof", "Long Lasting"],
    image: getPlaceholderImage("teak"),
    stockStatus: "In Stock",
    usage: "own_premium",
    purpose: "both"
  },
  {
    id: "ghana-teak-frame",
    title: "Ghana Teak Window Frame",
    category: "teak",
    subcategory: "Ghana Teak",
    description: "Durable Ghana teak window frame with smooth finish and natural resistance to decay.",
    price: 18000,
    dimensions: "4ft x 3ft",
    color: "Medium Brown",
    features: ["Weather Resistant", "Low Maintenance"],
    image: getPlaceholderImage("teak"),
    stockStatus: "In Stock",
    usage: "own_premium",
    purpose: "both"
  },
  {
    id: "brazilian-teak-table",
    title: "Brazilian Teak Dining Table",
    category: "teak",
    subcategory: "Brazilian Teak",
    description: "Elegant dining table made from premium Brazilian teak. Features natural wood grain and high durability.",
    price: 75000,
    dimensions: "6ft x 4ft",
    color: "Golden Brown",
    features: ["Scratch Resistant", "Heat Resistant", "Polished Finish"],
    image: getPlaceholderImage("teak"),
    stockStatus: "Low Stock",
    usage: "own_premium",
    purpose: "both"
  },
  {
    id: "indian-sal-door",
    title: "Indian Sal Door",
    category: "teak",
    subcategory: "Indian Sal",
    description: "Budget-friendly Indian Sal door suitable for interior use with decent durability.",
    price: 22000,
    dimensions: "7ft x 3.5ft",
    color: "Light Brown",
    features: ["Cost Effective", "Good Strength"],
    image: getPlaceholderImage("teak"),
    stockStatus: "In Stock",
    usage: "rental",
    purpose: "both"
  },
  {
    id: "sainik-mr-12mm",
    title: "Century Ply Sainik MR 12mm",
    category: "plywood",
    subcategory: "Century Ply Sainik MR",
    description: "High-quality moisture-resistant plywood suitable for kitchen cabinets and interior furniture.",
    price: 1100,
    thickness: "12mm",
    features: ["Moisture Resistant", "Uniform Thickness", "No Hollow Spaces"],
    image: getPlaceholderImage("teak"),
    stockStatus: "In Stock",
    usage: "own_premium",
    purpose: "both"
  },
  {
    id: "sainik-mr-18mm",
    title: "Century Ply Sainik MR 18mm",
    category: "plywood",
    subcategory: "Century Ply Sainik MR",
    description: "Durable 18mm thick moisture-resistant plywood for heavy-duty applications.",
    price: 2300,
    thickness: "18mm",
    features: ["Heavy Duty", "Moisture Resistant", "High Strength"],
    image: getPlaceholderImage("teak"),
    stockStatus: "In Stock",
    usage: "own_premium",
    purpose: "both"
  },
  {
    id: "marine-plywood-19mm",
    title: "Marine Plywood 19mm",
    category: "plywood",
    subcategory: "Marine Plywood",
    description: "Water-resistant plywood suitable for outdoor furniture and high-moisture areas.",
    price: 3200,
    thickness: "19mm",
    features: ["Waterproof", "Weather Resistant", "Durable"],
    image: getPlaceholderImage("teak"),
    stockStatus: "Low Stock",
    usage: "own_premium",
    purpose: "commercial"
  },
  {
    id: "kitlam-eg-particle-board",
    title: "Kitlam EG Prelam Particle Board",
    category: "plywood",
    subcategory: "Laminated Plywood",
    description: "Pre-laminated particle board with smooth finish, ideal for furniture and cabinets.",
    price: 2800,
    thickness: "18mm",
    features: ["Pre-finished", "Easy to Clean", "Scratch Resistant"],
    image: getPlaceholderImage("teak"),
    stockStatus: "In Stock",
    usage: "own_budget",
    purpose: "both"
  },
  {
    id: "waterproof-plywood-18mm",
    title: "Waterproof Plywood 18mm",
    category: "plywood",
    subcategory: "Waterproof Plywood",
    description: "High-grade waterproof plywood suitable for bathrooms, kitchens, and outdoor applications.",
    price: 2800,
    thickness: "18mm",
    features: ["100% Waterproof", "Fungus Resistant", "Termite Free"],
    image: getPlaceholderImage("teak"),
    stockStatus: "In Stock",
    usage: "own_budget",
    purpose: "both"
  },
  {
    id: "hardwood-log-teak",
    title: "Teak Hardwood Log",
    category: "hardwood",
    subcategory: "Teak Log",
    description: "Natural teak hardwood log suitable for custom furniture making and woodworking projects.",
    price: null,
    dimensions: "Varies",
    color: "Golden Brown",
    image: getPlaceholderImage("teak"),
    stockStatus: "In Stock",
    usage: "own_premium",
    purpose: "both"
  }
];

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductType[]>(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(sampleProducts);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeFilters, setActiveFilters] = useState<{
    usage: string[];
    purpose: string[];
    stockStatus: string[];
    priceRange: string | null;
  }>({
    usage: [],
    purpose: [],
    stockStatus: [],
    priceRange: null
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  const usageParam = searchParams.get('usage');
  const purposeParam = searchParams.get('purpose');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Filter products based on URL parameters
    if (usageParam || purposeParam) {
      let filtered = [...sampleProducts];
      
      if (usageParam) {
        filtered = filtered.filter(p => p.usage === usageParam);
      }
      
      if (purposeParam) {
        filtered = filtered.filter(p => 
          p.purpose === purposeParam || p.purpose === "both"
        );
      }
      
      setProducts(filtered);
    } else {
      setProducts(sampleProducts);
    }
  }, [usageParam, purposeParam]);
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    
    let categoryFiltered: ProductType[];
    if (category === "all") {
      categoryFiltered = sampleProducts;
    } else {
      categoryFiltered = sampleProducts.filter(p => p.category === category);
    }
    
    setProducts(categoryFiltered);
    applyFilters(categoryFiltered);
  };
  
  const applyFilters = (baseProducts: ProductType[] = products) => {
    let filtered = [...baseProducts];
    
    // Apply usage filter
    if (activeFilters.usage.length > 0) {
      filtered = filtered.filter(p => activeFilters.usage.includes(p.usage));
    }
    
    // Apply purpose filter
    if (activeFilters.purpose.length > 0) {
      filtered = filtered.filter(p => 
        activeFilters.purpose.includes(p.purpose) || p.purpose === "both"
      );
    }
    
    // Apply stock status filter
    if (activeFilters.stockStatus.length > 0) {
      filtered = filtered.filter(p => activeFilters.stockStatus.includes(p.stockStatus));
    }
    
    // Apply price range filter
    if (activeFilters.priceRange) {
      filtered = filtered.filter(p => {
        if (p.price === null) return true; // Include "Request for Price" items
        
        switch (activeFilters.priceRange) {
          case 'under-25k':
            return p.price < 25000;
          case '25k-50k':
            return p.price >= 25000 && p.price <= 50000;
          case '50k-75k':
            return p.price > 50000 && p.price <= 75000;
          case 'above-75k':
            return p.price > 75000;
          default:
            return true;
        }
      });
    }
    
    setFilteredProducts(filtered);
  };
  
  const toggleFilter = (type: keyof typeof activeFilters, value: string) => {
    if (type === 'priceRange') {
      setActiveFilters(prev => ({
        ...prev,
        [type]: prev[type] === value ? null : value
      }));
    } else {
      setActiveFilters(prev => {
        const currentValues = prev[type] as string[];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        
        return { ...prev, [type]: newValues };
      });
    }
  };
  
  const clearAllFilters = () => {
    setActiveFilters({
      usage: [],
      purpose: [],
      stockStatus: [],
      priceRange: null
    });
  };
  
  const getActiveFilterCount = () => {
    return activeFilters.usage.length + 
           activeFilters.purpose.length + 
           activeFilters.stockStatus.length + 
           (activeFilters.priceRange ? 1 : 0);
  };
  
  const formatUsageLabel = (usage: string) => {
    switch (usage) {
      case "own_premium": return "Premium";
      case "own_budget": return "Budget";
      case "rental": return "Rental";
      default: return usage;
    }
  };
  
  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFilters();
  }, [activeFilters]);
  
  return (
    <Layout>
      <div className="container mx-auto py-6 md:py-12 px-4">
        {/* Mobile-First Header */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Our Products</h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Browse our extensive collection of premium timber products
            {usageParam && purposeParam && (
              <span> tailored for {purposeParam === "commercial" ? "commercial" : "residential"} {
                usageParam === "own_premium" 
                  ? "premium use" 
                  : usageParam === "own_budget" 
                    ? "budget-friendly use" 
                    : "rental"
              }</span>
            )}
          </p>
        </div>
        
        {/* Mobile Filter Controls */}
        <div className="mb-4 md:mb-6">
          {/* Filter Button & Active Filters Row */}
          <div className="flex items-center gap-2 mb-3">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 px-4 border-2 hover:border-timber-600"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge className="ml-2 bg-timber-600 text-white text-xs">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                <SheetHeader className="pb-4">
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                
                {/* Mobile Filter Content */}
                <div className="space-y-6">
                  {/* Usage Filter */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-600">Usage Type</h4>
                    <div className="flex flex-wrap gap-2">
                      {['own_premium', 'own_budget', 'rental'].map((usage) => (
                        <Button
                          key={usage}
                          variant={activeFilters.usage.includes(usage) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter('usage', usage)}
                          className={cn(
                            "h-10 px-4 rounded-full",
                            activeFilters.usage.includes(usage) 
                              ? "bg-timber-600 text-white border-timber-600" 
                              : "border-gray-300 hover:border-timber-600"
                          )}
                        >
                          {formatUsageLabel(usage)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Purpose Filter */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-600">Purpose</h4>
                    <div className="flex flex-wrap gap-2">
                      {['residential', 'commercial'].map((purpose) => (
                        <Button
                          key={purpose}
                          variant={activeFilters.purpose.includes(purpose) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter('purpose', purpose)}
                          className={cn(
                            "h-10 px-4 rounded-full capitalize",
                            activeFilters.purpose.includes(purpose) 
                              ? "bg-timber-600 text-white border-timber-600" 
                              : "border-gray-300 hover:border-timber-600"
                          )}
                        >
                          {purpose}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Stock Status Filter */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-600">Availability</h4>
                    <div className="flex flex-wrap gap-2">
                      {['In Stock', 'Low Stock'].map((status) => (
                        <Button
                          key={status}
                          variant={activeFilters.stockStatus.includes(status) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter('stockStatus', status)}
                          className={cn(
                            "h-10 px-4 rounded-full",
                            activeFilters.stockStatus.includes(status) 
                              ? "bg-timber-600 text-white border-timber-600" 
                              : "border-gray-300 hover:border-timber-600"
                          )}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range Quick Filters */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-600">Price Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Under ₹25K', value: 'under-25k' },
                        { label: '₹25K - ₹50K', value: '25k-50k' },
                        { label: '₹50K - ₹75K', value: '50k-75k' },
                        { label: 'Above ₹75K', value: 'above-75k' }
                      ].map((range) => (
                        <Button
                          key={range.value}
                          variant={activeFilters.priceRange === range.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter('priceRange', range.value)}
                          className={cn(
                            "h-10 px-3 rounded-lg text-sm",
                            activeFilters.priceRange === range.value 
                              ? "bg-timber-600 text-white border-timber-600" 
                              : "border-gray-300 hover:border-timber-600"
                          )}
                        >
                          {range.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Filter Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={clearAllFilters}
                      className="flex-1 h-12"
                    >
                      Clear All
                    </Button>
                    <Button 
                      onClick={() => setIsFilterSheetOpen(false)}
                      className="flex-1 h-12 bg-timber-600 hover:bg-timber-700"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Quick Clear All Filters */}
            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-10 px-3 text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          
          {/* Active Filter Chips */}
          {getActiveFilterCount() > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.usage.map((usage) => (
                <Badge
                  key={`usage-${usage}`}
                  variant="secondary"
                  className="bg-timber-100 text-timber-800 hover:bg-timber-200 cursor-pointer"
                  onClick={() => toggleFilter('usage', usage)}
                >
                  {formatUsageLabel(usage)}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {activeFilters.purpose.map((purpose) => (
                <Badge
                  key={`purpose-${purpose}`}
                  variant="secondary"
                  className="bg-timber-100 text-timber-800 hover:bg-timber-200 cursor-pointer capitalize"
                  onClick={() => toggleFilter('purpose', purpose)}
                >
                  {purpose}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {activeFilters.stockStatus.map((status) => (
                <Badge
                  key={`stock-${status}`}
                  variant="secondary"
                  className="bg-timber-100 text-timber-800 hover:bg-timber-200 cursor-pointer"
                  onClick={() => toggleFilter('stockStatus', status)}
                >
                  {status}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {activeFilters.priceRange && (
                <Badge
                  variant="secondary"
                  className="bg-timber-100 text-timber-800 hover:bg-timber-200 cursor-pointer"
                  onClick={() => toggleFilter('priceRange', activeFilters.priceRange!)}
                >
                  Price Range
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {/* Mobile-Optimized Category Tabs */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange}>
          <div className="mb-6 md:mb-8">
            <TabsList className="grid w-full grid-cols-2 md:inline-flex md:w-auto h-auto md:h-10">
              <TabsTrigger value="all" className="text-xs md:text-sm py-2.5 md:py-2">All Products</TabsTrigger>
              <TabsTrigger value="teak" className="text-xs md:text-sm py-2.5 md:py-2">Teak Wood</TabsTrigger>
              <TabsTrigger value="plywood" className="text-xs md:text-sm py-2.5 md:py-2">Plywood</TabsTrigger>
              <TabsTrigger value="hardwood" className="text-xs md:text-sm py-2.5 md:py-2">Hardwood Logs</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            <ProductGrid products={filteredProducts} />
          </TabsContent>
          
          <TabsContent value="teak">
            <ProductGrid
              products={filteredProducts.filter(p => p.category === "teak")}
              title="Premium Teak Wood"
              description="Explore our collection of Burma, Ghana, Brazilian, and Indian Sal teak wood options."
            />
          </TabsContent>
          
          <TabsContent value="plywood">
            <ProductGrid
              products={filteredProducts.filter(p => p.category === "plywood")}
              title="Quality Plywood"
              description="Century Ply Sainik MR, Marine, Laminated, and Waterproof plywood solutions."
            />
          </TabsContent>
          
          <TabsContent value="hardwood">
            <ProductGrid
              products={filteredProducts.filter(p => p.category === "hardwood")}
              title="Hardwood Logs"
              description="Various hardwood logs perfect for custom projects and specialized needs."
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProductsPage;
