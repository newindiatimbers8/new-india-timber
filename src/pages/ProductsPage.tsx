
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProductGrid, { ProductType } from "../components/products/ProductGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, SlidersHorizontal, X, Search, ArrowRight, Star, Leaf, Shield, ChevronRight, MicIcon, SortAsc } from "lucide-react";
import { getPlaceholderImage } from "../utils/imageUtils";
import { woodProducts } from "../data/woodProducts";
import { cn } from "@/lib/utils";
import { useProducts } from "../hooks/useProducts";
import { WoodProduct } from "../services/database";

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
    usage: "own_budget",
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
  const { products: dbProducts, loading, error, getProductsByCategory } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<WoodProduct[]>([]);
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popular");
  
  const usageParam = searchParams.get('usage');
  const purposeParam = searchParams.get('purpose');
  const categoryParam = searchParams.get('category');
  const typeParam = searchParams.get('type');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Set active category based on URL parameter
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    
    // Set initial filtered products from database
    if (dbProducts.length > 0) {
      setFilteredProducts(dbProducts);
    }
  }, [dbProducts, categoryParam]);

  // Handle URL parameter filtering
  useEffect(() => {
    if (dbProducts.length === 0) return;
    
    let filtered = [...dbProducts];
    
    // Filter by category parameter
    if (categoryParam) {
      filtered = filtered.filter(p => p.category === categoryParam);
    }
    
    // Filter by type parameter (for plywood subcategories)
    if (typeParam) {
      filtered = filtered.filter(p => {
        const subcategoryMatch = p.grade?.toLowerCase().includes(typeParam.replace('-', ' '));
        return subcategoryMatch;
      });
    }
    
    // Filter by usage parameter (based on grade)
    if (usageParam) {
      filtered = filtered.filter(p => {
        const productUsage = p.grade === 'premium' ? 'own_premium' : 'own_budget';
        return productUsage === usageParam;
      });
    }
    
    // Filter by purpose parameter (default to both for database products)
    if (purposeParam) {
      // Since database products don't have purpose field, we'll show all for now
      // This can be enhanced later by adding purpose field to database
    }
    
    setFilteredProducts(filtered);
  }, [dbProducts, usageParam, purposeParam, categoryParam, typeParam]);
  
  const handleCategoryChange = async (category: string) => {
    setActiveCategory(category);
    
    if (category === "all") {
      setFilteredProducts(dbProducts);
    } else {
      // Fetch products by category from database
      try {
        const categoryProducts = await getProductsByCategory(category);
        setFilteredProducts(categoryProducts);
      } catch (error) {
        console.error('Error fetching products by category:', error);
        // Fallback to filtering existing products
        const categoryFiltered = dbProducts.filter(p => p.category === category);
        setFilteredProducts(categoryFiltered);
      }
    }
  };
  
  const applyFilters = (baseProducts: WoodProduct[] = filteredProducts) => {
    let filtered = [...baseProducts];
    
    // Apply usage filter (based on grade)
    if (activeFilters.usage.length > 0) {
      filtered = filtered.filter(p => {
        const productUsage = p.grade === 'premium' ? 'own_premium' : 'own_budget';
        return activeFilters.usage.includes(productUsage);
      });
    }
    
    // Apply purpose filter (default to both for database products)
    if (activeFilters.purpose.length > 0) {
      // Since database products don't have purpose field, we'll show all for now
      // This can be enhanced later by adding purpose field to database
    }
    
    // Apply stock status filter (default to "In Stock" for database products)
    if (activeFilters.stockStatus.length > 0) {
      // Since database products don't have stock status, we'll show all for now
      // This can be enhanced later by adding stock status field to database
    }
    
    // Apply price range filter
    if (activeFilters.priceRange) {
      filtered = filtered.filter(p => {
        const price = p.pricing.pricePerSqFt;
        
        switch (activeFilters.priceRange) {
          case 'under-25k':
            return price < 25000;
          case '25k-50k':
            return price >= 25000 && price <= 50000;
          case '50k-75k':
            return price > 50000 && price <= 75000;
          case 'above-75k':
            return price > 75000;
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
      default: return usage;
    }
  };
  
  const categories = [
    { value: "all", label: "All Products", icon: Filter },
    { value: "teak", label: "Teak", icon: Leaf },
    { value: "plywood", label: "Plywood", icon: Shield },
    { value: "hardwood", label: "Hardwood", icon: Star }
  ];
  
  const removeFilter = (key: string) => {
    // Implementation for removing individual filters
    console.log("Remove filter:", key);
  };
  
  const activeFilterCount = getActiveFilterCount();
  const activeFiltersList: { key: string; label: string }[] = [];
  
  // Helper to handle image errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, category: string) => {
    const target = e.target as HTMLImageElement;
    target.src = getPlaceholderImage(category);
  };
  
  // Apply filters whenever activeFilters changes
  useEffect(() => {
    if (filteredProducts.length > 0) {
      applyFilters();
    }
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
                    : "commercial use"
              }</span>
            )}
          </p>
        </div>
        
        {/* Wood Directory Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Wood Directory</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive collection of premium wood types with detailed specifications, 
              comparisons, and expert guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {woodProducts.map((wood) => (
              <Card key={wood.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      variant={wood.grade === 'premium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {wood.grade.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {wood.category.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-timber-600 transition-colors">
                    {wood.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {wood.overview.tagline}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center">
                      <Shield className="h-4 w-4 text-green-600 mb-1" />
                      <span className="text-xs text-gray-600">Durability</span>
                      <span className="text-sm font-medium">{wood.comparisonMetrics.durability}/5</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Star className="h-4 w-4 text-yellow-600 mb-1" />
                      <span className="text-xs text-gray-600">Quality</span>
                      <span className="text-sm font-medium">{wood.comparisonMetrics.workability}/5</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Leaf className="h-4 w-4 text-green-600 mb-1" />
                      <span className="text-xs text-gray-600">Eco</span>
                      <span className="text-sm font-medium">{wood.comparisonMetrics.sustainability}/5</span>
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      ₹{wood.pricing.pricePerSqFt}/sq.ft
                    </div>
                    <p className="text-xs text-gray-500">
                      {wood.pricing.priceRange} range
                    </p>
                  </div>
                  
                  {/* CTA */}
                  <Button 
                    asChild 
                    className="w-full bg-timber-600 hover:bg-timber-700 group-hover:bg-timber-700 transition-colors"
                    size="sm"
                  >
                    <Link to={`/products/wood/${wood.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/products/wood/burma-teak">
                Explore Full Wood Directory
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
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
                      {['own_premium', 'own_budget'].map((usage) => (
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
            <ProductGrid 
              products={filteredProducts} 
              loading={loading}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="teak">
            <ProductGrid
              products={filteredProducts.filter(p => p.category === "teak")}
              title="Premium Teak Wood"
              description="Explore our collection of Burma, Ghana, Brazilian, and Indian Sal teak wood options."
              loading={loading}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="plywood">
            <ProductGrid
              products={filteredProducts.filter(p => p.category === "plywood")}
              title="Quality Plywood"
              description="Century Ply Sainik MR, Marine, Laminated, and Waterproof plywood solutions."
              loading={loading}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="hardwood">
            <ProductGrid
              products={filteredProducts.filter(p => p.category === "hardwood")}
              title="Hardwood Logs"
              description="Various hardwood logs perfect for custom projects and specialized needs."
              loading={loading}
              error={error}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProductsPage;
