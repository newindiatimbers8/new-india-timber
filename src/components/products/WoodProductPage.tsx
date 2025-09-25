import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Leaf, 
  Shield, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Download,
  Mail,
  Phone,
  MapPin,
  Clock
} from "lucide-react";
import Layout from "../layout/Layout";
import { Progress } from "@/components/ui/progress";
import { getProducts } from "@/services/products";
import type { Product } from "@/types/product";

const WoodProductPage = () => {
  const { woodType } = useParams<{ woodType: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const result = await getProducts();
        const products = result.products;
        
        // Find product by wood type (convert kebab-case to match product names)
        const woodTypeFormatted = woodType?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const searchTerm = woodType?.toLowerCase() || '';
        
        const foundProduct = products.find(p => {
          const productName = p.name.toLowerCase();
          const productTags = p.tags?.map(tag => tag.toLowerCase()) || [];
          
          // Check if product name contains the wood type
          if (productName.includes(searchTerm)) return true;
          
          // Check if any tag contains the wood type
          if (productTags.some(tag => tag.includes(searchTerm))) return true;
          
          // Special case for "burma-teak" -> "burma teak"
          if (searchTerm === 'burma-teak' && productName.includes('burma teak')) return true;
          if (searchTerm === 'ghana-teak' && productName.includes('ghana teak')) return true;
          
          return false;
        });
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    if (woodType) {
      loadProduct();
    }
  }, [woodType]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-timber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The requested product could not be found."}</p>
            <Button asChild>
              <a href="/products">← Back to Products</a>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const woodTypeDisplay = woodType?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Wood';

  return (
    <Layout>
      <Helmet>
        <title>{product.name} | {woodTypeDisplay} Details | New India Timbers</title>
        <meta
          name="description"
          content={`Learn about ${product.name} - ${product.description}. Premium quality wood products available in Bangalore.`}
        />
        <meta
          name="keywords"
          content={`${woodTypeDisplay.toLowerCase()}, ${product.name.toLowerCase()}, wood products bangalore, timber bangalore, ${product.tags?.join(', ')}`}
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.grade?.toUpperCase()}
              </Badge>
              <h1 className="text-3xl font-bold text-forest-900 mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-timber-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pricing</p>
                  <p className="text-2xl font-bold text-forest-900">
                    {product.pricing?.displayText || 'Contact for Quote'}
                  </p>
                  {product.pricing?.internalPricing?.unit && (
                    <p className="text-sm text-muted-foreground">per {product.pricing.internalPricing.unit}</p>
                  )}
                  {product.pricing?.internalPricing?.priceRange && (
                    <p className="text-sm text-timber-600 font-medium">{product.pricing.internalPricing.priceRange}</p>
                  )}
                </div>
                <Button size="lg" className="bg-timber-600 hover:bg-timber-700">
                  <Phone className="w-4 h-4 mr-2" />
                  {product.pricing?.ctaButton?.text || 'Get Quote'}
                </Button>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-timber-600" />
                  <a href="tel:+919886033342" className="text-timber-600 hover:underline">
                    +91 9886033342
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-timber-600" />
                  <a href="mailto:newindiatimbers8@gmail.com" className="text-timber-600 hover:underline">
                    newindiatimbers8@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-timber-600" />
                  <span className="text-sm text-muted-foreground">
                    Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 4:00 PM
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WoodProductPage;
