import { useParams, Navigate } from "react-router-dom";
import { useState } from "react";
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
  Phone
} from "lucide-react";
import { getWoodProduct, getComparisonData, type WoodProduct } from "@/data/woodProducts";
import Layout from "../layout/Layout";
import { Progress } from "@/components/ui/progress";

const WoodProductPage = () => {
  const { woodType } = useParams<{ woodType: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  
  const woodData = getWoodProduct(woodType || "");
  
  if (!woodData) {
    return <Navigate to="/products" replace />;
  }

  // Get related woods for comparison (same category, different grades)
  const relatedWoods = getComparisonData([
    'burma-teak', 'ghana-teak', 'red-sal', 'marine-plywood'
  ]).filter(w => w.id !== woodData.id).slice(0, 3);

  const MetricBar = ({ label, value, maxValue = 5 }: { label: string; value: number; maxValue?: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}/{maxValue}</span>
      </div>
      <Progress value={(value / maxValue) * 100} className="h-2" />
    </div>
  );

  const ComparisonCard = ({ wood }: { wood: WoodProduct }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{wood.name}</CardTitle>
            <p className="text-sm text-gray-600">{wood.overview.tagline}</p>
          </div>
          <Badge variant={wood.grade === 'premium' ? 'default' : 'secondary'}>
            {wood.grade}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-lg font-semibold text-green-600">
          ₹{wood.pricing.pricePerSqFt}/sq.ft
        </div>
        <div className="space-y-2">
          <MetricBar label="Durability" value={wood.comparisonMetrics.durability} />
          <MetricBar label="Workability" value={wood.comparisonMetrics.workability} />
          <MetricBar label="Value" value={wood.comparisonMetrics.costValue} />
        </div>
        <Button asChild variant="outline" className="w-full">
          <a href={`/products/wood/${wood.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-timber-50 to-amber-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Product Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {woodData.category.toUpperCase()}
                  </Badge>
                  <Badge 
                    variant={woodData.grade === 'premium' ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {woodData.grade.toUpperCase()}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  {woodData.name}
                </h1>
                {woodData.scientificName && (
                  <p className="text-lg text-gray-600 italic">
                    {woodData.scientificName}
                  </p>
                )}
                <p className="text-xl text-timber-600 font-medium">
                  {woodData.overview.tagline}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {woodData.comparisonMetrics.durability}/5
                  </div>
                  <div className="text-sm text-gray-600">Durability</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {woodData.comparisonMetrics.workability}/5
                  </div>
                  <div className="text-sm text-gray-600">Workability</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {woodData.comparisonMetrics.sustainability}/5
                  </div>
                  <div className="text-sm text-gray-600">Sustainability</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {woodData.comparisonMetrics.costValue}/5
                  </div>
                  <div className="text-sm text-gray-600">Value</div>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-green-600">
                    ₹{woodData.pricing.pricePerSqFt}
                  </div>
                  <div className="text-gray-600">per sq.ft</div>
                  <Badge variant="outline">
                    {woodData.pricing.marketTrend}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="bg-timber-600 hover:bg-timber-700">
                    <Phone className="mr-2 h-5 w-5" />
                    Get Quote
                  </Button>
                  <Button size="lg" variant="outline">
                    <Download className="mr-2 h-5 w-5" />
                    Download Specs
                  </Button>
                  <Button size="lg" variant="outline">
                    <Mail className="mr-2 h-5 w-5" />
                    Contact Expert
                  </Button>
                </div>
              </div>
            </div>

            {/* Image/Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-6xl mb-4">🌳</div>
                  <p className="text-lg font-medium">{woodData.name}</p>
                  <p className="text-sm">High-quality timber sample</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Content Tabs */}
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specifications">Specs</TabsTrigger>
            <TabsTrigger value="applications">Uses</TabsTrigger>
            <TabsTrigger value="origin">Origin</TabsTrigger>
            <TabsTrigger value="buying-guide">Buying Guide</TabsTrigger>
            <TabsTrigger value="comparison">Compare</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">About {woodData.name}</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {woodData.overview.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Why Choose {woodData.name}?</h3>
                  <p className="text-gray-700 mb-4">
                    {woodData.overview.premiumPositioning}
                  </p>
                  <ul className="space-y-2">
                    {woodData.overview.keyBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Quick Specs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Density:</span>
                      <span className="font-medium">{woodData.specifications.density} kg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hardness:</span>
                      <span className="font-medium">{woodData.specifications.hardness} Janka</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durability:</span>
                      <span className="font-medium capitalize">{woodData.specifications.durability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Workability:</span>
                      <span className="font-medium capitalize">{woodData.specifications.workability}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pros & Cons</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Advantages</h4>
                      <ul className="space-y-1">
                        {woodData.prosAndCons.pros.slice(0, 3).map((pro, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">Considerations</h4>
                      <ul className="space-y-1">
                        {woodData.prosAndCons.cons.slice(0, 2).map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Specifications Tab */}
          <TabsContent value="specifications" className="space-y-6">
            <h2 className="text-2xl font-bold">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Physical Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Density</span>
                      <div className="font-medium">{woodData.specifications.density} kg/m³</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Hardness</span>
                      <div className="font-medium">{woodData.specifications.hardness} Janka</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Moisture</span>
                      <div className="font-medium">{woodData.specifications.moistureContent}%</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Grain</span>
                      <div className="font-medium capitalize">{woodData.specifications.grainPattern}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Ratings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MetricBar 
                    label="Durability" 
                    value={woodData.comparisonMetrics.durability} 
                  />
                  <MetricBar 
                    label="Workability" 
                    value={woodData.comparisonMetrics.workability} 
                  />
                  <MetricBar 
                    label="Finish Quality" 
                    value={woodData.specifications.finishQuality === 'excellent' ? 5 : 
                           woodData.specifications.finishQuality === 'good' ? 4 : 3} 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Natural Resistance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(woodData.specifications.naturalResistance).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="capitalize text-gray-600">{key}</span>
                      {value ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <h2 className="text-2xl font-bold">Applications & Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Recommended Uses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Primary Applications</h4>
                      <ul className="space-y-1">
                        {woodData.applications.primary.map((app, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Secondary Applications</h4>
                      <ul className="space-y-1">
                        {woodData.applications.secondary.map((app, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-700">Not Recommended For</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {woodData.applications.notRecommended.map((app, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{app}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Origin Tab */}
          <TabsContent value="origin" className="space-y-6">
            <h2 className="text-2xl font-bold">Origin & Sustainability</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Origin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Countries</h4>
                    <div className="flex flex-wrap gap-2">
                      {woodData.origin.countries.map((country, index) => (
                        <Badge key={index} variant="outline">{country}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Regions</h4>
                    <ul className="space-y-1">
                      {woodData.origin.regions.map((region, index) => (
                        <li key={index} className="text-sm text-gray-600">• {region}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Harvesting Method</h4>
                    <p className="text-sm text-gray-700">{woodData.origin.harvestingMethod}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications & Sustainability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {woodData.origin.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Sustainability Rating</h4>
                    <MetricBar 
                      label="Environmental Score" 
                      value={woodData.origin.sustainabilityRating} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Buying Guide Tab */}
          <TabsContent value="buying-guide" className="space-y-6">
            <h2 className="text-2xl font-bold">Buying Guide</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quality Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {woodData.buyingGuide.qualityIndicators.map((indicator, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Important Considerations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {woodData.buyingGuide.importantConsiderations.map((consideration, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Expected Lifespan & Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  <strong>Expected Lifespan:</strong> {woodData.buyingGuide.expectedLifespan}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <h2 className="text-2xl font-bold">Compare with Other Woods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedWoods.map((wood) => (
                <ComparisonCard key={wood.id} wood={wood} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Contact CTA */}
      <div className="bg-timber-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get expert guidance on {woodData.name} for your project. Our specialists 
            will help you make the right choice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-timber-600 hover:bg-timber-700">
              <Phone className="mr-2 h-5 w-5" />
              Call +91 80 2571 5555
            </Button>
            <Button size="lg" variant="outline">
              <Mail className="mr-2 h-5 w-5" />
              Get Free Quote
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WoodProductPage;