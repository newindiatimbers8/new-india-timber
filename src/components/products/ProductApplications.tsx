import React from 'react';
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Building,
  Home,
  Car,
  Ship,
  TreePine
} from 'lucide-react';

interface ProductApplicationsProps {
  product: Product;
  className?: string;
}

/**
 * ProductApplications Component
 * Displays product applications and use cases
 */
export const ProductApplications: React.FC<ProductApplicationsProps> = ({
  product,
  className = ''
}) => {
  const { applications } = product;

  // Icon mapping for different application types
  const getApplicationIcon = (application: string) => {
    const app = application.toLowerCase();
    if (app.includes('construction') || app.includes('structural')) {
      return <Building className="w-5 h-5" />;
    } else if (app.includes('furniture') || app.includes('interior')) {
      return <Home className="w-5 h-5" />;
    } else if (app.includes('automotive') || app.includes('vehicle')) {
      return <Car className="w-5 h-5" />;
    } else if (app.includes('marine') || app.includes('boat') || app.includes('ship')) {
      return <Ship className="w-5 h-5" />;
    } else if (app.includes('outdoor') || app.includes('garden')) {
      return <TreePine className="w-5 h-5" />;
    }
    return <Building className="w-5 h-5" />;
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Applications & Uses
        </CardTitle>
        <p className="text-gray-600">
          Discover the various applications and use cases for {product.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Applications */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              Primary Applications
            </h4>
          </div>
          <p className="text-sm text-gray-600">
            These are the most common and recommended uses for {product.name}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {applications.primary.map((application, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                {getApplicationIcon(application)}
                <span className="text-sm font-medium text-green-800">
                  {application}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Secondary Applications */}
        {applications.secondary && applications.secondary.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">
                Secondary Applications
              </h4>
            </div>
            <p className="text-sm text-gray-600">
              These applications are possible but may require additional considerations
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {applications.secondary.map((application, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  {getApplicationIcon(application)}
                  <span className="text-sm font-medium text-blue-800">
                    {application}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Not Recommended Applications */}
        {applications.notRecommended && applications.notRecommended.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-6 h-6 text-red-600" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Not Recommended
                </h4>
              </div>
              <p className="text-sm text-gray-600">
                These applications are not suitable for {product.name} due to its properties
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {applications.notRecommended.map((application, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    {getApplicationIcon(application)}
                    <span className="text-sm font-medium text-red-800">
                      {application}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Application Guidelines */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Application Guidelines
          </h4>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">
                Why {product.name} is suitable for primary applications:
              </h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Durability:</strong> {product.specifications.durability} durability rating</li>
                <li>• <strong>Workability:</strong> {product.specifications.workability} workability for easy processing</li>
                <li>• <strong>Moisture Resistance:</strong> {product.specifications.moistureResistance} resistance to water damage</li>
                <li>• <strong>Insect Resistance:</strong> {product.specifications.insectResistance} natural resistance to pests</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">
                Technical Considerations:
              </h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Density:</strong> {product.specifications.density.min}-{product.specifications.density.max} kg/m³ for structural strength</li>
                <li>• <strong>Grain Pattern:</strong> {product.specifications.grainPattern} grain for consistent appearance</li>
                <li>• <strong>Texture:</strong> {product.specifications.texture} texture for finishing options</li>
                <li>• <strong>Color:</strong> {product.specifications.color} color for aesthetic appeal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Industry Standards */}
        <Separator />
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Industry Standards & Compliance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">Quality Grades</h5>
              <div className="flex flex-wrap gap-2">
                {product.qualityGrades.map((grade, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {grade}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">Certifications</h5>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((cert, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs border-green-200 text-green-800 bg-green-50"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability Information */}
        <Separator />
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Sustainability & Environmental Impact
          </h4>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TreePine className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">
                {product.sustainability.source.charAt(0).toUpperCase() + 
                 product.sustainability.source.slice(1)} Source
              </span>
            </div>
            <p className="text-sm text-green-700">
              {product.name} is sourced from {product.sustainability.source} forests, 
              ensuring responsible harvesting practices and environmental sustainability.
              {product.sustainability.certification && (
                <span> Certified by {product.sustainability.certification}.</span>
              )}
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <h5 className="font-medium text-blue-900 mb-2">
            Need help choosing the right application?
          </h5>
          <p className="text-sm text-blue-700 mb-3">
            Our experts can help you select the perfect timber for your specific project requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Badge variant="outline" className="border-blue-300 text-blue-800">
              Free Consultation
            </Badge>
            <Badge variant="outline" className="border-blue-300 text-blue-800">
              Custom Solutions
            </Badge>
            <Badge variant="outline" className="border-blue-300 text-blue-800">
              Technical Support
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductApplications;

