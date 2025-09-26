/**
 * ProductSearchFilter Component
 * Advanced search and filtering for products with real-time results
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  availability: string[];
  features: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ProductSearchFilterProps {
  products: Product[];
  onFilteredProducts: (products: Product[]) => void;
  className?: string;
  showAdvancedFilters?: boolean;
}

const ProductSearchFilter: React.FC<ProductSearchFilterProps> = ({
  products,
  onFilteredProducts,
  className,
  showAdvancedFilters = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 10000],
    availability: [],
    features: [],
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))];
    const features = [...new Set(products.flatMap(p => p.keyFeatures || []))];
    const maxPrice = Math.max(...products.map(p => p.pricing?.basePrice || 0));
    
    return {
      categories,
      features,
      maxPrice: Math.ceil(maxPrice / 1000) * 1000 // Round up to nearest 1000
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = [
          product.name,
          product.description,
          product.category,
          ...(product.keyFeatures || []),
          ...(product.applications || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Price range filter
      const productPrice = product.pricing?.basePrice || 0;
      if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
        return false;
      }

      // Availability filter
      if (filters.availability.length > 0) {
        const isInStock = product.stockStatus === 'in_stock';
        const isLimited = product.stockStatus === 'limited';
        
        if (filters.availability.includes('in_stock') && !isInStock) {
          return false;
        }
        if (filters.availability.includes('limited') && !isLimited) {
          return false;
        }
      }

      // Features filter
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature =>
          product.keyFeatures?.includes(feature)
        );
        if (!hasAllFeatures) {
          return false;
        }
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.pricing?.basePrice || 0;
          bValue = b.pricing?.basePrice || 0;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchQuery, filters]);

  // Update filtered products when filters change
  useEffect(() => {
    onFilteredProducts(filteredProducts);
  }, [filteredProducts, onFilteredProducts]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      features: checked
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      availability: checked
        ? [...prev.availability, availability]
        : prev.availability.filter(a => a !== availability)
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      categories: [],
      priceRange: [0, filterOptions.maxPrice],
      availability: [],
      features: [],
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = searchQuery || 
    filters.categories.length > 0 || 
    filters.availability.length > 0 || 
    filters.features.length > 0 ||
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < filterOptions.maxPrice;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-blue-100' : ''}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {filters.categories.length + filters.availability.length + filters.features.length}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters(prev => ({ 
              ...prev, 
              sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
            }))}
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="font-semibold mb-3">Categories</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filterOptions.categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-semibold mb-3">Price Range</h4>
              <div className="space-y-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                  max={filterOptions.maxPrice}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{filters.priceRange[0].toLocaleString()}</span>
                  <span>₹{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h4 className="font-semibold mb-3">Availability</h4>
              <div className="space-y-2">
                {['in_stock', 'limited'].map(availability => (
                  <div key={availability} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${availability}`}
                      checked={filters.availability.includes(availability)}
                      onCheckedChange={(checked) => handleAvailabilityChange(availability, checked as boolean)}
                    />
                    <label
                      htmlFor={`availability-${availability}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {availability === 'in_stock' ? 'In Stock' : 'Limited Stock'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {filterOptions.features.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filterOptions.features.slice(0, 10).map(feature => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature}`}
                        checked={filters.features.includes(feature)}
                        onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                      />
                      <label
                        htmlFor={`feature-${feature}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredProducts.length} of {products.length} products
        {hasActiveFilters && (
          <span className="ml-2">
            • <Button variant="link" size="sm" onClick={clearFilters} className="p-0 h-auto">
              Clear filters
            </Button>
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductSearchFilter;

