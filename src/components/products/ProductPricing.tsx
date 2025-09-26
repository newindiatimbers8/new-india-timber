import React, { useState } from 'react';
import { Product } from '../../types/Product';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  IndianRupee, 
  Calculator, 
  Truck, 
  Clock,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react';

interface ProductPricingProps {
  product: Product;
  className?: string;
}

/**
 * ProductPricing Component
 * Displays pricing information, bulk discounts, and availability
 */
export const ProductPricing: React.FC<ProductPricingProps> = ({
  product,
  className = ''
}) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const { pricing, availability } = product;

  // Calculate final price based on quantity and region
  const calculateFinalPrice = (): number => {
    let finalPrice = pricing.basePrice;
    
    // Apply bulk discount
    const applicableDiscount = pricing.bulkDiscounts
      .filter(discount => selectedQuantity >= discount.minQuantity)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];
    
    if (applicableDiscount) {
      finalPrice = finalPrice * (1 - applicableDiscount.discountPercentage / 100);
    }
    
    // Apply regional pricing
    if (selectedRegion && pricing.regionalPricing) {
      const regionalMultiplier = pricing.regionalPricing
        .find(region => region.region === selectedRegion)?.priceMultiplier || 1;
      finalPrice = finalPrice * regionalMultiplier;
    }
    
    return Math.round(finalPrice);
  };

  // Get applicable discount
  const getApplicableDiscount = () => {
    return pricing.bulkDiscounts
      .filter(discount => selectedQuantity >= discount.minQuantity)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get availability status color
  const getAvailabilityColor = (status: string): string => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'seasonal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Pricing & Availability
        </CardTitle>
        <p className="text-gray-600">
          Get competitive pricing for {product.name} with bulk discounts
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Price Display */}
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <IndianRupee className="w-6 h-6 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(calculateFinalPrice())}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            per {pricing.unit.replace('-', ' ')}
          </p>
          {selectedQuantity > 1 && (
            <p className="text-sm text-gray-500 mt-1">
              Total: {formatCurrency(calculateFinalPrice() * selectedQuantity)}
            </p>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Quantity
          </label>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
              disabled={selectedQuantity <= 1}
            >
              -
            </Button>
            <span className="w-16 text-center font-medium">
              {selectedQuantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedQuantity(selectedQuantity + 1)}
            >
              +
            </Button>
          </div>
        </div>

        {/* Regional Pricing */}
        {pricing.regionalPricing && pricing.regionalPricing.length > 0 && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Region</option>
              {pricing.regionalPricing.map((region, index) => (
                <option key={index} value={region.region}>
                  {region.region} ({region.priceMultiplier > 1 ? '+' : ''}{Math.round((region.priceMultiplier - 1) * 100)}%)
                </option>
              ))}
            </select>
          </div>
        )}

        <Separator />

        {/* Bulk Discounts */}
        {pricing.bulkDiscounts && pricing.bulkDiscounts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="text-lg font-semibold text-gray-900">
                Bulk Discounts
              </h4>
            </div>
            <div className="space-y-2">
              {pricing.bulkDiscounts.map((discount, index) => {
                const isApplicable = selectedQuantity >= discount.minQuantity;
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isApplicable 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {isApplicable && <CheckCircle className="w-4 h-4 text-green-600" />}
                      <span className={`text-sm font-medium ${
                        isApplicable ? 'text-green-800' : 'text-gray-700'
                      }`}>
                        {discount.minQuantity}+ units
                      </span>
                    </div>
                    <Badge 
                      variant="outline"
                      className={isApplicable ? 'border-green-300 text-green-800' : ''}
                    >
                      {discount.discountPercentage}% off
                    </Badge>
                  </div>
                );
              })}
            </div>
            
            {getApplicableDiscount() && (
              <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>You're saving {getApplicableDiscount()?.discountPercentage}%</strong> with your current quantity!
                </p>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Availability Status */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              Availability
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <Badge 
              className={`px-3 py-1 ${getAvailabilityColor(availability.status)}`}
            >
              {availability.status.replace('-', ' ').toUpperCase()}
            </Badge>
            <span className="text-sm text-gray-600">
              Lead time: {availability.leadTime}
            </span>
          </div>
          
          {availability.seasonalAvailability && availability.seasonalAvailability.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Seasonal Availability:</strong> {availability.seasonalAvailability.join(', ')}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={availability.status === 'out-of-stock'}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Get Quote
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Contact Sales
            </Button>
            <Button variant="outline" className="w-full">
              <Truck className="w-4 h-4 mr-2" />
              Check Delivery
            </Button>
          </div>
        </div>

        {/* Pricing Notes */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="font-medium text-yellow-800 mb-2">
            Pricing Information
          </h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Prices are subject to market fluctuations</li>
            <li>• Final pricing may vary based on specifications</li>
            <li>• Contact us for custom sizing and bulk orders</li>
            <li>• All prices exclude taxes and delivery charges</li>
          </ul>
        </div>

        {/* Payment Terms */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h5 className="font-medium text-gray-800 mb-2">
            Payment Terms
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p><strong>Standard Terms:</strong> 30 days</p>
              <p><strong>Bulk Orders:</strong> Negotiable</p>
            </div>
            <div>
              <p><strong>Payment Methods:</strong> Bank transfer, Cheque</p>
              <p><strong>Credit Terms:</strong> Available for regular customers</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPricing;

