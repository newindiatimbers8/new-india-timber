import React, { useState } from 'react';
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Plus, 
  X, 
  IndianRupee,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ProductComparisonProps {
  products: Product[];
  onAddProduct?: (product: Product) => void;
  onRemoveProduct?: (productId: string) => void;
  className?: string;
}

/**
 * ProductComparison Component
 * Allows users to compare multiple timber products side by side
 */
export const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onAddProduct,
  onRemoveProduct,
  className = ''
}) => {
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([
    'density',
    'workability',
    'durability',
    'moistureResistance',
    'insectResistance'
  ]);

  const availableSpecs = [
    { key: 'density', label: 'Density', type: 'range' },
    { key: 'grainPattern', label: 'Grain Pattern', type: 'text' },
    { key: 'texture', label: 'Texture', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'workability', label: 'Workability', type: 'rating' },
    { key: 'durability', label: 'Durability', type: 'rating' },
    { key: 'moistureResistance', label: 'Moisture Resistance', type: 'rating' },
    { key: 'insectResistance', label: 'Insect Resistance', type: 'rating' }
  ];

  // Helper function to get rating color
  const getRatingColor = (rating: string): string => {
    switch (rating) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'difficult':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function to format density
  const formatDensity = (density: { min: number; max: number }): string => {
    return `${density.min}-${density.max} kg/m³`;
  };

  // Helper function to format rating
  const formatRating = (rating: string): string => {
    return rating.charAt(0).toUpperCase() + rating.slice(1);
  };

  // Helper function to get specification value
  const getSpecValue = (product: Product, specKey: string): string => {
    const spec = product.specifications[specKey as keyof typeof product.specifications];
    if (specKey === 'density') {
      return formatDensity(spec as { min: number; max: number });
    }
    return String(spec);
  };

  // Toggle specification selection
  const toggleSpec = (specKey: string) => {
    setSelectedSpecs(prev => 
      prev.includes(specKey) 
        ? prev.filter(s => s !== specKey)
        : [...prev, specKey]
    );
  };

  if (products.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Products Selected
          </h3>
          <p className="text-gray-600 mb-4">
            Add products to compare their specifications and features
          </p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Products to Compare
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Product Comparison
              </CardTitle>
              <p className="text-gray-600">
                Compare {products.length} timber products side by side
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add More
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Specification Selector */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Select Specifications to Compare
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableSpecs.map(spec => (
                <Button
                  key={spec.key}
                  variant={selectedSpecs.includes(spec.key) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSpec(spec.key)}
                  className="text-xs"
                >
                  {spec.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">
                    Specification
                  </th>
                  {products.map(product => (
                    <th key={product.id} className="text-center p-3 min-w-[200px]">
                      <div className="space-y-2">
                        <img
                          src={product.images.hero.webp}
                          alt={product.images.hero.alt}
                          className="w-16 h-12 object-cover rounded mx-auto"
                        />
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">
                            {product.name}
                          </h5>
                          <p className="text-xs text-gray-600">
                            {product.scientificName}
                          </p>
                        </div>
                        {onRemoveProduct && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic Information */}
                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-medium text-gray-700">Category</td>
                  {products.map(product => (
                    <td key={product.id} className="p-3 text-center">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </td>
                  ))}
                </tr>
                
                <tr className="border-b">
                  <td className="p-3 font-medium text-gray-700">Origin</td>
                  {products.map(product => (
                    <td key={product.id} className="p-3 text-center text-sm">
                      {product.origin}
                    </td>
                  ))}
                </tr>

                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-medium text-gray-700">Price</td>
                  {products.map(product => (
                    <td key={product.id} className="p-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <IndianRupee className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-600">
                          {product.pricing.basePrice.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        per {product.pricing.unit.replace('-', ' ')}
                      </p>
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-medium text-gray-700">Availability</td>
                  {products.map(product => (
                    <td key={product.id} className="p-3 text-center">
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          product.availability.status === 'in-stock' 
                            ? 'border-green-200 text-green-800 bg-green-50'
                            : product.availability.status === 'limited'
                            ? 'border-yellow-200 text-yellow-800 bg-yellow-50'
                            : 'border-red-200 text-red-800 bg-red-50'
                        }`}
                      >
                        {product.availability.status.replace('-', ' ')}
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Selected Specifications */}
                {selectedSpecs.map(specKey => {
                  const spec = availableSpecs.find(s => s.key === specKey);
                  if (!spec) return null;

                  return (
                    <tr key={specKey} className="border-b">
                      <td className="p-3 font-medium text-gray-700">
                        {spec.label}
                      </td>
                      {products.map(product => (
                        <td key={product.id} className="p-3 text-center">
                          {spec.type === 'rating' ? (
                            <Badge 
                              className={`text-xs ${getRatingColor(getSpecValue(product, specKey))}`}
                            >
                              {formatRating(getSpecValue(product, specKey))}
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-900">
                              {getSpecValue(product, specKey)}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {/* Applications */}
                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-medium text-gray-700">Primary Applications</td>
                  {products.map(product => (
                    <td key={product.id} className="p-3 text-center">
                      <div className="space-y-1">
                        {product.applications.primary.slice(0, 2).map((app, index) => (
                          <Badge key={index} variant="outline" className="text-xs block">
                            {app}
                          </Badge>
                        ))}
                        {product.applications.primary.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{product.applications.primary.length - 2} more
                          </p>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Certifications */}
                <tr className="border-b">
                  <td className="p-3 font-medium text-gray-700">Certifications</td>
                  {products.map(product => (
                    <td key={product.id} className="p-3 text-center">
                      <div className="space-y-1">
                        {product.certifications.slice(0, 2).map((cert, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs block border-green-200 text-green-800 bg-green-50"
                          >
                            {cert}
                          </Badge>
                        ))}
                        {product.certifications.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{product.certifications.length - 2} more
                          </p>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Get Quotes for All
            </Button>
            <Button variant="outline" className="flex-1">
              Download Comparison
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductComparison;

