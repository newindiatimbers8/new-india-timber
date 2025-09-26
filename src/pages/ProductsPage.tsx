
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
// Define a compatible Product interface for the products.json structure
interface TimberProduct {
  id: string;
  name: string;
  category: string;
  grade: string;
  description: string;
  specifications: {
    grade?: string;
    [key: string]: any;
  };
  pricing: {
    [key: string]: any;
  };
  images: Array<{
    id: string;
    productId: string;
    url: string;
    altText: string;
    context: string;
    sequence: number;
    dimensions: {
      [key: string]: any;
    };
    metadata: {
      [key: string]: any;
    };
    isActive: boolean;
    isPlaceholder: boolean;
  }>;
  isActive: boolean;
  tags?: string[];
  seo: {
    [key: string]: any;
  };
  benefits?: string[];
  applications?: string[];
  serviceAreas?: string[];
  createdAt: string;
  updatedAt: string;
  primaryImage: string;
  stockStatus?: string;
}
import { Helmet } from "react-helmet-async";
import { generateProductsStructuredData } from "@/services/seo";


const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const { products: dbProducts, loading, error, getProductsByCategory } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<TimberProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeFilters, setActiveFilters] = useState<{
    grade: string[];
    stockStatus: string[];
    priceRange: string | null;
  }>({
    grade: [],
    stockStatus: [],
    priceRange: null
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  const gradeParam = searchParams.get('grade');
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
      setFilteredProducts(dbProducts as unknown as TimberProduct[]);
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
    
    // Filter by grade parameter
    if (gradeParam) {
      filtered = filtered.filter(p => {
        // Handle special cases for plywood types
        if (gradeParam === 'marine') {
          return p.name.toLowerCase().includes('marine') || 
                 p.tags?.includes('marine') ||
                 p.specifications?.grade?.toLowerCase().includes('marine');
        }
        // Handle other special cases
        if (gradeParam === 'century') {
          return p.name.toLowerCase().includes('century');
        }
        // Default grade matching
        return p.grade === gradeParam;
      });
    }
    
    setFilteredProducts(filtered as unknown as TimberProduct[]);
  }, [dbProducts, gradeParam, categoryParam, typeParam]);
  
  const handleCategoryChange = async (category: string) => {
    setActiveCategory(category);
    
    if (category === "all") {
      setFilteredProducts(dbProducts as unknown as TimberProduct[]);
    } else {
      // Fetch products by category from database
      try {
        await getProductsByCategory(category);
        // The hook will update the products state, so we don't need to set it here
      } catch {
        // Fallback to filtering existing products
        const categoryFiltered = dbProducts.filter(p => p.category === category);
        setFilteredProducts(categoryFiltered as unknown as TimberProduct[]);
      }
    }
  };
  
  const applyFilters = useCallback((baseProducts: TimberProduct[]) => {
    let filtered = [...baseProducts];
    
    // Apply grade filter
    if (activeFilters.grade.length > 0) {
      filtered = filtered.filter(p => activeFilters.grade.includes(p.grade));
    }
    
    // Apply stock status filter
    if (activeFilters.stockStatus.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.stockStatus) return true; // Show products without stock status
        return activeFilters.stockStatus.includes(p.stockStatus);
      });
    }
    
    // Apply quality tier filter (replacing price range filter)
    if (activeFilters.priceRange) {
      filtered = filtered.filter(p => {
        switch (activeFilters.priceRange) {
          case 'budget':
            return p.grade === 'standard' || p.grade === 'economy';
          case 'standard':
            return p.grade === 'standard' || p.grade === 'premium';
          case 'premium':
            return p.grade === 'premium' || p.grade === 'luxury';
          case 'luxury':
            return p.grade === 'luxury' || p.grade === 'premium';
          default:
            return true;
        }
      });
    }
    
    setFilteredProducts(filtered as unknown as TimberProduct[]);
  }, [activeFilters]);
  
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
      grade: [],
      stockStatus: [],
      priceRange: null
    });
  };
  
  const getActiveFilterCount = () => {
    return activeFilters.grade.length + 
           activeFilters.stockStatus.length + 
           (activeFilters.priceRange ? 1 : 0);
  };
  
  const formatGradeLabel = (grade: string) => {
    return grade.charAt(0).toUpperCase() + grade.slice(1);
  };
  
  
  // Apply filters whenever activeFilters changes (only for manual filter changes, not URL params)
  useEffect(() => {
    if (dbProducts.length > 0 && !categoryParam && !gradeParam) {
      applyFilters(dbProducts as unknown as TimberProduct[]);
    }
  }, [activeFilters, dbProducts, categoryParam, gradeParam]);
  
  return (
    <Layout>
      <Helmet>
        <title>Timber & Plywood Products in Bangalore | Premium Teak & Hardwood</title>
        <meta
          name="description"
          content="Browse New India Timber’s curated catalog of premium teak, plywood, and hardwood solutions for Bangalore builders, architects, and homeowners."
        />
        <script type="application/ld+json">
          {JSON.stringify(generateProductsStructuredData())}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-timber-800 via-timber-700 to-timber-600 text-white py-16 md:py-24">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                Premium Timber Products
              </h1>
              <p className="text-lg md:text-xl text-timber-100 mb-6 md:mb-8">
                Discover our extensive collection of premium teak, plywood, and hardwood solutions
                {gradeParam && (
                  <span className="block mt-2 text-timber-200">
                    in {formatGradeLabel(gradeParam)} grade
                  </span>
                )}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  ✓ FSC Certified
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  ✓ 25+ Years Experience
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  ✓ Premium Quality
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-8 md:py-12 px-4">
        
        {/* Wood Directory Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-timber-800">Featured Products</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Explore our comprehensive collection of premium wood types with detailed specifications, 
              comparisons, and expert guidance from our workshop.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {dbProducts.slice(0, 8).map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant={product.grade === 'premium' ? 'default' : 'secondary'}
                      className={`text-xs font-semibold ${
                        product.grade === 'premium' 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.grade.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-timber-300 text-timber-700">
                      {product.category.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-timber-600 transition-colors font-semibold">
                    {product.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {product.description || product.name}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden shadow-inner">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/teak-wood.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🪵</div>
                          <div className="text-sm">Workshop Image</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-700">
                      Contact for Price
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Custom quotes available
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-timber-600 to-timber-700 hover:from-timber-700 hover:to-timber-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    size="sm"
                  >
                    <Link to={`/products/${product.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="border-2 border-timber-300 text-timber-700 hover:bg-timber-50 hover:border-timber-400 font-semibold px-8 py-3">
              <Link to="/products/wood/burma-teak">
                Explore Full Wood Directory
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Enhanced Filter Controls */}
        <div className="mb-8 md:mb-10 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-12 px-6 border-2 border-timber-300 hover:border-timber-500 hover:bg-timber-50 font-semibold text-timber-700"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge className="ml-2 bg-gradient-to-r from-timber-600 to-timber-700 text-white text-xs font-bold">
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
                  {/* Grade Filter */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-600">Grade</h4>
                    <div className="flex flex-wrap gap-2">
                      {['premium', 'standard'].map((grade) => (
                        <Button
                          key={grade}
                          variant={activeFilters.grade.includes(grade) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter('grade', grade)}
                          className={cn(
                            "h-10 px-4 rounded-full",
                            activeFilters.grade.includes(grade) 
                              ? "bg-timber-600 text-white border-timber-600" 
                              : "border-gray-300 hover:border-timber-600"
                          )}
                        >
                          {formatGradeLabel(grade)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  
                  {/* Stock Status Filter */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-600">Availability</h4>
                    <div className="flex flex-wrap gap-2">
                      {['in_stock', 'low_stock', 'out_of_stock'].map((status) => (
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
                          {status.replace('_', ' ').toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range Quick Filters */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-600">Price Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Budget', value: 'budget' },
                        { label: 'Standard', value: 'standard' },
                        { label: 'Premium', value: 'premium' },
                        { label: 'Luxury', value: 'luxury' }
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
              {activeFilters.grade.map((grade) => (
                <Badge
                  key={`grade-${grade}`}
                  variant="secondary"
                  className="bg-timber-100 text-timber-800 hover:bg-timber-200 cursor-pointer"
                  onClick={() => toggleFilter('grade', grade)}
                >
                  {formatGradeLabel(grade)}
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
                  {status.replace('_', ' ').toUpperCase()}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {activeFilters.priceRange && (
                <Badge
                  variant="secondary"
                  className="bg-timber-100 text-timber-800 hover:bg-timber-200 cursor-pointer"
                  onClick={() => activeFilters.priceRange && toggleFilter('priceRange', activeFilters.priceRange)}
                >
                  Price Range
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {/* Enhanced Category Tabs */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange}>
          <div className="mb-8 md:mb-10">
            <TabsList className="grid w-full grid-cols-2 md:inline-flex md:w-auto h-auto md:h-12 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl p-1">
              <TabsTrigger value="all" className="text-sm md:text-base py-3 md:py-2 px-4 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-timber-600 data-[state=active]:to-timber-700 data-[state=active]:text-white rounded-lg transition-all duration-300">All Products</TabsTrigger>
              <TabsTrigger value="teak" className="text-sm md:text-base py-3 md:py-2 px-4 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-timber-600 data-[state=active]:to-timber-700 data-[state=active]:text-white rounded-lg transition-all duration-300">Teak Wood</TabsTrigger>
              <TabsTrigger value="plywood" className="text-sm md:text-base py-3 md:py-2 px-4 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-timber-600 data-[state=active]:to-timber-700 data-[state=active]:text-white rounded-lg transition-all duration-300">Plywood</TabsTrigger>
              <TabsTrigger value="hardwood" className="text-sm md:text-base py-3 md:py-2 px-4 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-timber-600 data-[state=active]:to-timber-700 data-[state=active]:text-white rounded-lg transition-all duration-300">Hardwood Logs</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            <ProductGrid 
              products={filteredProducts as any} 
              loading={loading}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="teak">
            <ProductGrid
              products={filteredProducts.filter(p => p.category === "teak") as any}
              title="Premium Teak Wood"
              description="Explore our collection of Burma, Ghana, Brazilian, and Indian Sal teak wood options."
              loading={loading}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="plywood">
            <ProductGrid
              products={filteredProducts.filter(p => p.category === "plywood") as any}
              title="Quality Plywood"
              description="Century Ply Sainik MR, Marine, Laminated, and Waterproof plywood solutions."
              loading={loading}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="hardwood">
            <ProductGrid
              products={filteredProducts.filter(p => p.category === "hardwood") as any}
              title="Hardwood Logs"
              description="Various hardwood logs perfect for custom projects and specialized needs."
              loading={loading}
              error={error}
            />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
