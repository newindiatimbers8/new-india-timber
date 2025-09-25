import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Leaf, 
  Shield, 
  Award, 
  Download,
  Mail,
  Phone,
  MapPin,
  Home,
  ChevronRight,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Zap,
  TreePine,
  Wrench,
  Building,
  Sofa,
  HomeIcon
} from "lucide-react";
import Layout from "../components/layout/Layout";
import { getProducts } from "@/services/products";
import type { Product } from "@/types/product";
import ProductSchema from "../components/seo/ProductSchema";

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const result = await getProducts();
        const products = result.products;
        
        // Find product by ID
        const foundProduct = products.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
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

  // Generate SEO-friendly title and description
  const seoTitle = product.seo?.metaTitle || `${product.name} - Premium Quality | New India Timbers Bangalore`;
  const seoDescription = product.seo?.metaDescription || `Premium ${product.name} in Bangalore. ${product.description}. 25+ years experience. Contact for pricing: +91-9886033342`;
  const seoKeywords = product.seo?.keywords?.join(', ') || `${product.name.toLowerCase()}, bangalore, premium timber, wood suppliers`;

  // Breadcrumb navigation
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Timber & Wood', href: '/products' },
    { name: product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'Products', href: `/products?category=${product.category}` },
    { name: product.name }
  ];

  // Product benefits based on category
  const getProductBenefits = () => {
    const baseBenefits = [
      { icon: Shield, text: "Superior Durability", description: "25+ years lifespan with proper care" },
      { icon: Award, text: "Premium Grade Quality", description: "Hand-selected A-grade timber" },
      { icon: Leaf, text: "Sustainable Sourcing", description: "FSC certified responsible forestry" },
      { icon: Zap, text: "Expert Processing", description: "Professional kiln drying and treatment" }
    ];

    if (product.category === 'teak') {
      return [
        ...baseBenefits,
        { icon: TreePine, text: "Natural Resistance", description: "Termite and moisture resistant" },
        { icon: Wrench, text: "Custom Dimensions", description: "Cut to your exact specifications" }
      ];
    } else if (product.category === 'plywood') {
      return [
        ...baseBenefits,
        { icon: Shield, text: "Water Resistance", description: "Perfect for humid Bangalore climate" },
        { icon: Building, text: "Structural Strength", description: "High load-bearing capacity" }
      ];
    }

    return baseBenefits;
  };

  // Applications based on product type
  const getApplications = () => {
    if (product.name.toLowerCase().includes('door')) {
      return [
        { icon: Home, text: "Main Entrance Doors", description: "Premium entrance solutions" },
        { icon: Building, text: "Commercial Doors", description: "Office and retail spaces" },
        { icon: HomeIcon, text: "Interior Doors", description: "Bedroom and living room doors" }
      ];
    } else if (product.name.toLowerCase().includes('window')) {
      return [
        { icon: Home, text: "Residential Windows", description: "Home window frames" },
        { icon: Building, text: "Commercial Windows", description: "Office building windows" },
        { icon: HomeIcon, text: "French Windows", description: "Elegant window solutions" }
      ];
    } else if (product.name.toLowerCase().includes('plywood')) {
      return [
        { icon: Sofa, text: "Furniture Making", description: "Cabinets, tables, and chairs" },
        { icon: Home, text: "Kitchen Cabinets", description: "Moisture-resistant cabinets" },
        { icon: Building, text: "Construction", description: "Structural applications" }
      ];
    }

    return [
      { icon: Sofa, text: "Furniture Making", description: "Premium furniture and cabinets" },
      { icon: Home, text: "Construction", description: "Residential and commercial projects" },
      { icon: Building, text: "Architectural Features", description: "Beams, columns, decorative elements" }
    ];
  };

  // FAQ data
  const faqData = [
    {
      question: `What is the difference between Grade A and Grade B ${product.name.split(' ')[0]}?`,
      answer: `Grade A ${product.name.split(' ')[0]} has superior grain patterns, minimal knots, and higher density compared to Grade B. Our Grade A products are hand-selected for premium quality and consistency.`
    },
    {
      question: `How do you ensure the authenticity of ${product.name}?`,
      answer: `We provide certificates of origin and conduct density tests to verify authenticity. All our products come with quality certificates and are sourced from certified suppliers.`
    },
    {
      question: "What are the delivery options in Bangalore?",
      answer: "We offer same-day delivery within Bangalore city limits and next-day delivery to surrounding areas. Free delivery available for bulk orders."
    },
    {
      question: "Do you provide custom cutting services?",
      answer: "Yes, we offer precision cutting to your exact specifications with our advanced machinery. Custom cutting is available for all our timber products."
    }
  ];


  return (
    <Layout>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={product.images?.[0] || ""} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={product.images?.[0] || ""} />
      </Helmet>
      
      {/* SEO Schema Markup */}
      <ProductSchema product={product} />

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

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={typeof product.images[selectedImageIndex] === 'string' 
                    ? product.images[selectedImageIndex] 
                    : product.images[selectedImageIndex]?.url || product.images[0]?.url || product.images[0]}
                  alt={typeof product.images[selectedImageIndex] === 'string' 
                    ? product.name 
                    : product.images[selectedImageIndex]?.altText || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>No image available</span>
                </div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-timber-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={typeof image === 'string' ? image : image?.url}
                      alt={typeof image === 'string' ? `${product.name} ${index + 1}` : image?.altText || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.grade?.toUpperCase()} GRADE
              </Badge>
              <h1 className="text-3xl font-bold text-forest-900 mb-2">
                Premium {product.name} - Best {product.category} Suppliers in Bangalore
              </h1>
              <p className="text-muted-foreground text-lg">
                {product.description}
              </p>
            </div>

            {/* Trust Signals */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1 text-timber-600" />
                <span>25+ Years Experience</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-timber-600" />
                <span>FSC Certified</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1 text-timber-600" />
                <span>500+ Satisfied Customers</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-timber-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pricing</p>
                  <p className="text-3xl font-bold text-forest-900">
                    {product.pricing?.displayText || 'Contact for Price'}
                  </p>
                  {product.pricing?.internalPricing?.unit && (
                    <p className="text-sm text-muted-foreground">per {product.pricing.internalPricing.unit}</p>
                  )}
                  {product.pricing?.internalPricing?.priceRange && (
                    <p className="text-sm text-timber-600 font-medium">{product.pricing.internalPricing.priceRange}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Button size="lg" className="bg-timber-600 hover:bg-timber-700 w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    {product.pricing?.ctaButton?.text || 'Contact for Price'}
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Brochure
              </Button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Our {product.name} - Sustainably Sourced Premium Timber</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">
                    Our {product.name} represents the pinnacle of quality and craftsmanship in the timber industry. 
                    Sourced from certified sustainable forests and processed using state-of-the-art techniques, 
                    this premium product offers exceptional durability and aesthetic appeal.
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
                        <li>• In stock: {product.isActive ? 'Yes' : 'No'}</li>
                        <li>• Delivery: Same day in Bangalore</li>
                        <li>• Minimum order: 1 piece</li>
                        <li>• Custom orders: Available</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Property</th>
                          <th className="text-left py-3 px-4 font-semibold">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                          <tr key={key} className="border-b">
                            <td className="py-3 px-4 font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{value}</td>
                          </tr>
                        ))}
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Certification</td>
                          <td className="py-3 px-4 text-muted-foreground">FSC Certified</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Seasoning</td>
                          <td className="py-3 px-4 text-muted-foreground">Kiln Dried</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Treatment</td>
                          <td className="py-3 px-4 text-muted-foreground">Natural/Treated Options</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium">Minimum Order</td>
                          <td className="py-3 px-4 text-muted-foreground">1 Piece</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Our {product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {getProductBenefits().map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <benefit.icon className="w-6 h-6 text-timber-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{benefit.text}</h4>
                          <p className="text-muted-foreground text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Applications & Recommended Uses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {getApplications().map((app, index) => (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 bg-timber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <app.icon className="w-8 h-8 text-timber-600" />
                        </div>
                        <h4 className="font-semibold mb-2">{app.text}</h4>
                        <p className="text-muted-foreground text-sm">{app.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {faqData.map((faq, index) => (
                      <div key={index}>
                        <h4 className="font-semibold mb-2">{faq.question}</h4>
                        <p className="text-muted-foreground">{faq.answer}</p>
                        {index < faqData.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
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
