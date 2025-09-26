import React from 'react';
import { Product, ProductSpecifications as ProductSpecs } from '../../types/Product';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface ProductSpecificationsProps {
  product: Product;
  className?: string;
}

/**
 * ProductSpecifications Component
 * Displays detailed technical specifications for timber products
 */
export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  product,
  className = ''
}) => {
  const { specifications } = product;

  // Helper function to get quality rating color
  const getQualityColor = (rating: string): string => {
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

  // Helper function to format grain pattern
  const formatGrainPattern = (pattern: string): string => {
    return pattern.charAt(0).toUpperCase() + pattern.slice(1).replace('-', ' ');
  };

  // Helper function to format texture
  const formatTexture = (texture: string): string => {
    return texture.charAt(0).toUpperCase() + texture.slice(1);
  };

  // Helper function to format quality rating
  const formatQualityRating = (rating: string): string => {
    return rating.charAt(0).toUpperCase() + rating.slice(1);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Technical Specifications
        </CardTitle>
        <p className="text-gray-600">
          Detailed technical properties and characteristics of {product.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Density */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Density</h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">
                {formatDensity(specifications.density)}
              </span>
              <Badge variant="outline" className="text-xs">
                kg/m³
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              Higher density indicates greater strength and durability
            </p>
          </div>
        </div>

        <Separator />

        {/* Physical Properties */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Physical Properties</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Grain Pattern</label>
              <Badge 
                variant="outline" 
                className="w-full justify-start text-left"
              >
                {formatGrainPattern(specifications.grainPattern)}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Texture</label>
              <Badge 
                variant="outline" 
                className="w-full justify-start text-left"
              >
                {formatTexture(specifications.texture)}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Color</label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ 
                    backgroundColor: specifications.color.includes('red') ? '#dc2626' :
                                   specifications.color.includes('brown') ? '#92400e' :
                                   specifications.color.includes('golden') ? '#f59e0b' :
                                   specifications.color.includes('dark') ? '#374151' :
                                   '#8b5cf6'
                  }}
                />
                <span className="text-sm text-gray-900 capitalize">
                  {specifications.color}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Performance Ratings */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Performance Ratings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Workability</label>
              <Badge 
                className={`w-full justify-start text-left ${getQualityColor(specifications.workability)}`}
              >
                {formatQualityRating(specifications.workability)}
              </Badge>
              <p className="text-xs text-gray-600">
                Ease of cutting, shaping, and finishing
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Durability</label>
              <Badge 
                className={`w-full justify-start text-left ${getQualityColor(specifications.durability)}`}
              >
                {formatQualityRating(specifications.durability)}
              </Badge>
              <p className="text-xs text-gray-600">
                Resistance to wear and aging
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Moisture Resistance</label>
              <Badge 
                className={`w-full justify-start text-left ${getQualityColor(specifications.moistureResistance)}`}
              >
                {formatQualityRating(specifications.moistureResistance)}
              </Badge>
              <p className="text-xs text-gray-600">
                Resistance to water damage and swelling
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Insect Resistance</label>
              <Badge 
                className={`w-full justify-start text-left ${getQualityColor(specifications.insectResistance)}`}
              >
                {formatQualityRating(specifications.insectResistance)}
              </Badge>
              <p className="text-xs text-gray-600">
                Natural resistance to termites and borers
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Scientific Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Scientific Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Scientific Name</label>
              <p className="text-sm text-gray-900 font-mono italic">
                {product.scientificName}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Origin</label>
              <p className="text-sm text-gray-900">
                {product.origin}
              </p>
            </div>
          </div>
        </div>

        {/* Quality Grades */}
        {product.qualityGrades && product.qualityGrades.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Quality Grades</h4>
              <div className="flex flex-wrap gap-2">
                {product.qualityGrades.map((grade, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {grade}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Certifications */}
        {product.certifications && product.certifications.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((cert, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="px-3 py-1 border-green-200 text-green-800 bg-green-50"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Sustainability */}
        <Separator />
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Sustainability</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Source</label>
              <Badge 
                variant="outline"
                className="w-full justify-start text-left border-green-200 text-green-800 bg-green-50"
              >
                {product.sustainability.source.charAt(0).toUpperCase() + 
                 product.sustainability.source.slice(1)}
              </Badge>
            </div>
            
            {product.sustainability.certification && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Certification</label>
                <p className="text-sm text-gray-900">
                  {product.sustainability.certification}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSpecifications;

