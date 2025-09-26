import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Shield, 
  Award, 
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Users
} from "lucide-react";
import Layout from "../components/layout/Layout";
import { getProducts } from "@/services/products";
import type { Product } from "@/types/product";
import ProductSEO from "../components/products/ProductSEO";
import ProductSpecifications from "../components/products/ProductSpecifications";
import ProductImages from "../components/products/ProductImages";
import ProductApplications from "../components/products/ProductApplications";
import ProductComparison from "../components/products/ProductComparison";

// Helper function to transform existing product data to match component expectations
const transformProductData = (product: any): Product => {
  // If the product already has the expected structure, return it as is
  if (product.specifications?.density?.min !== undefined) {
    return product;
  }

  // Transform existing product structure to match component expectations
  const transformedProduct: Product = {
    ...product,
    // Transform specifications
    specifications: {
      density: {
        min: 500,
        max: 800
      },
      grainPattern: 'straight' as const,
      texture: 'medium' as const,
      color: product.specifications?.color || 'brown',
      workability: 'good' as const,
      durability: 'excellent' as const,
      moistureResistance: 'good' as const,
      insectResistance: 'excellent' as const,
      ...product.specifications
    },
    // Transform images to match expected structure (using PNG format)
    images: {
      hero: {
        webp: product.images?.[0]?.url || product.images?.[0] || '/images/teak-wood.jpg',
        jpg: product.images?.[0]?.url || product.images?.[0] || '/images/teak-wood.jpg',
        alt: product.images?.[0]?.altText || `${product.name} - Main Image`
      },
      gallery: product.images?.map((img: any, index: number) => ({
        webp: img.url || img,
        jpg: img.url || img,
        alt: img.altText || `${product.name} - Image ${index + 1}`,
        caption: img.caption || ''
      })) || [],
      details: {
        grain: {
          webp: product.images?.[0]?.url || product.images?.[0] || '/images/teak-wood.jpg',
          jpg: product.images?.[0]?.url || product.images?.[0] || '/images/teak-wood.jpg',
          alt: `${product.name} - Grain Detail`
        },
        crossSection: {
          webp: product.images?.[1]?.url || product.images?.[1] || '/images/teak-wood.jpg',
          jpg: product.images?.[1]?.url || product.images?.[1] || '/images/teak-wood.jpg',
          alt: `${product.name} - Cross Section`
        },
        applications: product.images?.slice(2, 5).map((img: any, index: number) => ({
          webp: img.url || img,
          jpg: img.url || img,
          alt: img.altText || `${product.name} - Application ${index + 1}`
        })) || []
      }
    },
    // Transform pricing to match expected structure
    pricing: {
      basePrice: product.pricing?.basePrice || 0,
      unit: product.pricing?.unit || 'piece',
      bulkDiscounts: [],
      regionalPricing: [],
      // Only spread non-null values to avoid overriding our defaults
      ...(product.pricing?.basePrice !== null && { basePrice: product.pricing.basePrice }),
      ...(product.pricing?.unit && { unit: product.pricing.unit })
    },
    // Add default values for missing properties
    scientificName: product.scientificName || 'Unknown',
    origin: product.origin || 'India',
    sustainability: {
      source: 'sustainable' as const,
      certification: 'FSC Certified'
    },
    qualityGrades: product.qualityGrades || ['Premium'],
    certifications: product.certifications || ['FSC Certified'],
    applications: {
      primary: ['Furniture', 'Construction'],
      secondary: ['Decorative'],
      notRecommended: []
    },
    availability: {
      status: 'in-stock' as const,
      leadTime: '1-2 weeks',
      seasonalAvailability: []
    },
    // Add keyFeatures for SEO
    keyFeatures: product.keyFeatures || ['Premium Quality', 'Durable', 'Sustainable'],
    // Add shortDescription for SEO
    shortDescription: product.shortDescription || product.description
  };

  return transformedProduct;
};

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const result = await getProducts();
        const products = result.products;
        
        // Find product by ID
        const foundProduct = products.find(p => p.id === productId);
        
        if (foundProduct) {
          // Transform the product data to match component expectations
          const transformedProduct = transformProductData(foundProduct);
          setProduct(transformedProduct);
        } else {
          setError("Product not found");
        }
      } catch {
        setError("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

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


  // Breadcrumb navigation
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Timber & Wood', href: '/products' },
    { name: product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'Products', href: `/products?category=${product.category}` },
    { name: product.name }
  ];



  return (
    <Layout>
      {/* Enhanced SEO with our new component */}
      <ProductSEO product={product} />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-foreground font-medium">{item.name}</span>
              ) : (
                <a href={item.href} className="hover:text-timber-600 transition-colors">
                  {item.name}
                </a>
              )}
            </div>
          ))}
        </nav>

        {/* Product Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-2">
            {product.category?.toUpperCase()} TIMBER
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {product.shortDescription || product.description}
          </p>
          
          {/* Trust Signals */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1 text-blue-600" />
              <span>25+ Years Experience</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1 text-green-600" />
              <span>FSC Certified</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-purple-600" />
              <span>500+ Satisfied Customers</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Product Images */}
          <ProductImages product={product} />
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <ProductSpecifications product={product} />
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              <ProductApplications product={product} />
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <ProductComparison products={[product]} />
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Our {product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">
                    {product.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Premium grade quality assurance</li>
                        <li>• Professional kiln drying process</li>
                        <li>• Custom sizing available</li>
                        <li>• Quality certification included</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Availability:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• In stock: Yes</li>
                        <li>• Delivery: Same day in Bangalore</li>
                        <li>• Minimum order: 1 piece</li>
                        <li>• Custom orders: Available</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Customer Reviews */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>What Our Customers Say</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    "Excellent quality {product.name.split(' ')[0]}. Used for our villa project in Whitefield. 
                    Delivered on time and perfect finish."
                  </p>
                  <p className="text-sm font-medium">- Rajesh K., Architect, Bangalore</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    "Best timber suppliers in Bangalore. Genuine A-grade quality and excellent service."
                  </p>
                  <p className="text-sm font-medium">- Priya M., Interior Designer, Koramangala</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Local SEO Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Serving Bangalore & Surrounding Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {['Bangalore City', 'Electronic City', 'Whitefield', 'Koramangala', 'BTM Layout', 'Jayanagar', 'Indiranagar', 'HSR Layout'].map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-timber-600" />
                    <span className="text-sm">{area}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-timber-50 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Order?</h3>
          <p className="text-muted-foreground mb-6">
            Contact our experts for pricing and delivery options in Bangalore
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-timber-600 hover:bg-timber-700">
              <Phone className="w-4 h-4 mr-2" />
              Call: +91-9886033342
            </Button>
            <Button variant="outline" size="lg">
              <Mail className="w-4 h-4 mr-2" />
              Email Us
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
