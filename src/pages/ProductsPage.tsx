
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProductGrid, { ProductType } from "../components/products/ProductGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    image: "/images/wood-texture.jpg",
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
    image: "/images/wood-texture.jpg",
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
    image: "/images/wood-texture.jpg",
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
    image: "/images/wood-texture.jpg",
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
    image: "/images/wood-texture.jpg",
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
    image: "/images/wood-texture.jpg",
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
    image: "/images/wood-texture.jpg",
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
    image: "/images/wood-texture.jpg",
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
    image: "/images/wood-texture.jpg",
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
    image: "/images/wood-texture.jpg",
    stockStatus: "In Stock",
    usage: "own_premium",
    purpose: "both"
  }
];

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductType[]>(sampleProducts);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
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
    
    if (category === "all") {
      setProducts(sampleProducts);
    } else {
      setProducts(sampleProducts.filter(p => p.category === category));
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange}>
          <div className="mb-8 overflow-auto">
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="teak">Teak Wood</TabsTrigger>
              <TabsTrigger value="plywood">Plywood</TabsTrigger>
              <TabsTrigger value="hardwood">Hardwood Logs</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            <ProductGrid products={products} />
          </TabsContent>
          
          <TabsContent value="teak">
            <ProductGrid
              products={products.filter(p => p.category === "teak")}
              title="Premium Teak Wood"
              description="Explore our collection of Burma, Ghana, Brazilian, and Indian Sal teak wood options."
            />
          </TabsContent>
          
          <TabsContent value="plywood">
            <ProductGrid
              products={products.filter(p => p.category === "plywood")}
              title="Quality Plywood"
              description="Century Ply Sainik MR, Marine, Laminated, and Waterproof plywood solutions."
            />
          </TabsContent>
          
          <TabsContent value="hardwood">
            <ProductGrid
              products={products.filter(p => p.category === "hardwood")}
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
