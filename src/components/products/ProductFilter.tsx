
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ProductType } from "./ProductGrid";

interface ProductFilterProps {
  products: ProductType[];
  onFilterChange: (filtered: ProductType[]) => void;
}

const ProductFilter = ({ products, onFilterChange }: ProductFilterProps) => {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    subcategories: [] as string[],
    usage: [] as string[],
    purpose: [] as string[],
    stockStatus: [] as string[],
    priceRange: [0, 100000] as [number, number]
  });
  
  // Get unique values and ranges for filters
  const categories = [...new Set(products.map(p => p.category))];
  const subcategories = [...new Set(products.map(p => p.subcategory))];
  const usageOptions = [...new Set(products.map(p => p.usage))];
  const purposeOptions = [...new Set(products.map(p => p.purpose))];
  const stockOptions = [...new Set(products.map(p => p.stockStatus))];
  
  const priceMin = 0;
  const priceMax = Math.max(
    ...products
      .filter(p => p.price !== null)
      .map(p => p.price || 0)
  );
  
  // Initialize price range
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [priceMin, priceMax]
    }));
  }, [priceMin, priceMax]);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...products];
    
    // Filter by category
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }
    
    // Filter by subcategory
    if (filters.subcategories.length > 0) {
      filtered = filtered.filter(p => filters.subcategories.includes(p.subcategory));
    }
    
    // Filter by usage
    if (filters.usage.length > 0) {
      filtered = filtered.filter(p => filters.usage.includes(p.usage));
    }
    
    // Filter by purpose
    if (filters.purpose.length > 0) {
      filtered = filtered.filter(p => 
        filters.purpose.includes(p.purpose) || 
        (p.purpose === "both" && (filters.purpose.includes("commercial") || filters.purpose.includes("residential")))
      );
    }
    
    // Filter by stock status
    if (filters.stockStatus.length > 0) {
      filtered = filtered.filter(p => filters.stockStatus.includes(p.stockStatus));
    }
    
    // Filter by price range
    filtered = filtered.filter(p => 
      p.price === null || (p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
    );
    
    onFilterChange(filtered);
  }, [filters, products, onFilterChange]);
  
  const handleCheckboxChange = (
    filterType: keyof typeof filters, 
    value: string, 
    checked: boolean
  ) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      
      if (checked) {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [filterType]: currentValues.filter(v => v !== value)
        };
      }
    });
  };
  
  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]]
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      categories: [],
      subcategories: [],
      usage: [],
      purpose: [],
      stockStatus: [],
      priceRange: [priceMin, priceMax]
    });
  };
  
  const formatUsageLabel = (usage: string) => {
    switch (usage) {
      case "own_premium":
        return "Premium (Own Use)";
      case "own_budget":
        return "Budget (Own Use)";
      default:
        return usage;
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Filters</h3>
        <Button 
          variant="ghost" 
          className="text-sm text-forest-700 hover:text-forest-800" 
          onClick={clearFilters}
        >
          Clear All
        </Button>
      </div>
      
      <Accordion type="multiple" defaultValue={["category", "price"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('categories', category, checked as boolean)
                    }
                  />
                  <Label htmlFor={`category-${category}`} className="capitalize">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="subcategory">
          <AccordionTrigger>Subcategory</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {subcategories.map(subcategory => (
                <div key={subcategory} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`subcategory-${subcategory}`} 
                    checked={filters.subcategories.includes(subcategory)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('subcategories', subcategory, checked as boolean)
                    }
                  />
                  <Label htmlFor={`subcategory-${subcategory}`}>
                    {subcategory}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="usage">
          <AccordionTrigger>Usage</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {usageOptions.map(usage => (
                <div key={usage} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`usage-${usage}`} 
                    checked={filters.usage.includes(usage)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('usage', usage, checked as boolean)
                    }
                  />
                  <Label htmlFor={`usage-${usage}`}>
                    {formatUsageLabel(usage)}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="purpose">
          <AccordionTrigger>Purpose</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {purposeOptions.map(purpose => (
                <div key={purpose} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`purpose-${purpose}`} 
                    checked={filters.purpose.includes(purpose)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('purpose', purpose, checked as boolean)
                    }
                  />
                  <Label htmlFor={`purpose-${purpose}`} className="capitalize">
                    {purpose}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="stock">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {stockOptions.map(stock => (
                <div key={stock} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`stock-${stock}`} 
                    checked={filters.stockStatus.includes(stock)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('stockStatus', stock, checked as boolean)
                    }
                  />
                  <Label htmlFor={`stock-${stock}`}>
                    {stock}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              <div className="pt-4">
                <Slider 
                  min={priceMin}
                  max={priceMax}
                  step={1000}
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  onValueChange={handlePriceChange}
                  className="my-6"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="border rounded-md px-3 py-1">
                  ₹{filters.priceRange[0].toLocaleString()}
                </div>
                <div>to</div>
                <div className="border rounded-md px-3 py-1">
                  ₹{filters.priceRange[1].toLocaleString()}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilter;
