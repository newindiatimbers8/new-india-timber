import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  TrendingUp, 
  Shield, 
  Leaf,
  ArrowRight
} from "lucide-react";
import { woodProducts, type WoodProduct } from "@/data/woodProducts";
import { Link } from "react-router-dom";

const WoodComparisonTool = () => {
  const [selectedWoods, setSelectedWoods] = useState<string[]>([]);
  const [maxCompare] = useState(4); // Maximum woods to compare

  const handleAddWood = (woodId: string) => {
    if (selectedWoods.length < maxCompare && !selectedWoods.includes(woodId)) {
      setSelectedWoods([...selectedWoods, woodId]);
    }
  };

  const handleRemoveWood = (woodId: string) => {
    setSelectedWoods(selectedWoods.filter(id => id !== woodId));
  };

  const clearComparison = () => {
    setSelectedWoods([]);
  };

  const selectedWoodData = selectedWoods
    .map(id => woodProducts.find(w => w.id === id))
    .filter(Boolean) as WoodProduct[];

  const MetricBar = ({ value, maxValue = 5, color = "bg-blue-600" }: { 
    value: number; 
    maxValue?: number; 
    color?: string; 
  }) => (
    <div className="w-full">
      <Progress 
        value={(value / maxValue) * 100} 
        className={`h-3 ${color}`}
      />
      <span className="text-sm text-gray-600 mt-1">{value}/{maxValue}</span>
    </div>
  );

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'commercial': return 'bg-blue-100 text-blue-800';
      case 'budget': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'teak': return '🌳';
      case 'hardwood': return '🪵';
      case 'plywood': return '📋';
      default: return '🌲';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Wood Comparison Tool</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Compare different wood types side by side to make the best choice for your project. 
          Select up to {maxCompare} woods to compare their properties, pricing, and applications.
        </p>
      </div>

      {/* Wood Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Select Woods to Compare</span>
            <Badge variant="outline">
              {selectedWoods.length}/{maxCompare} selected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {woodProducts.map((wood) => (
              <div
                key={wood.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedWoods.includes(wood.id)
                    ? 'border-timber-600 bg-timber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => 
                  selectedWoods.includes(wood.id) 
                    ? handleRemoveWood(wood.id)
                    : handleAddWood(wood.id)
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{getCategoryIcon(wood.category)}</span>
                  <Badge className={getGradeColor(wood.grade)}>
                    {wood.grade}
                  </Badge>
                </div>
                <h4 className="font-medium text-lg mb-1">{wood.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{wood.overview.tagline}</p>
                <div className="text-lg font-semibold text-green-600">
                  ₹{wood.pricing.pricePerSqFt}/sq.ft
                </div>
                {selectedWoods.includes(wood.id) && (
                  <div className="mt-2">
                    <Badge variant="default" className="bg-timber-600">
                      ✓ Selected
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {selectedWoods.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={clearComparison}>
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {selectedWoodData.length > 0 && (
        <div className="space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="pros-cons">Pros & Cons</TabsTrigger>
            </TabsList>

            {/* Overview Comparison */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Metrics Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {['durability', 'workability', 'appearance', 'costValue', 'sustainability'].map((metric) => (
                        <div key={metric} className="space-y-2">
                          <h4 className="font-medium capitalize flex items-center gap-2">
                            {metric === 'durability' && <Shield className="h-4 w-4 text-green-600" />}
                            {metric === 'workability' && <Star className="h-4 w-4 text-yellow-600" />}
                            {metric === 'appearance' && <Star className="h-4 w-4 text-purple-600" />}
                            {metric === 'costValue' && <TrendingUp className="h-4 w-4 text-blue-600" />}
                            {metric === 'sustainability' && <Leaf className="h-4 w-4 text-green-600" />}
                            {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${selectedWoodData.length}, 1fr)` }}>
                            {selectedWoodData.map((wood) => (
                              <div key={wood.id} className="text-center">
                                <div className="text-xs text-gray-600 mb-1">{wood.name}</div>
                                <MetricBar 
                                  value={wood.comparisonMetrics[metric as keyof typeof wood.comparisonMetrics]} 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Info Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          {selectedWoodData.map((wood) => (
                            <TableHead key={wood.id} className="text-center">
                              {wood.name}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Category</TableCell>
                          {selectedWoodData.map((wood) => (
                            <TableCell key={wood.id} className="text-center capitalize">
                              {wood.category}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Grade</TableCell>
                          {selectedWoodData.map((wood) => (
                            <TableCell key={wood.id} className="text-center">
                              <Badge className={getGradeColor(wood.grade)}>
                                {wood.grade}
                              </Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Price/sq.ft</TableCell>
                          {selectedWoodData.map((wood) => (
                            <TableCell key={wood.id} className="text-center font-semibold text-green-600">
                              ₹{wood.pricing.pricePerSqFt}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Origin</TableCell>
                          {selectedWoodData.map((wood) => (
                            <TableCell key={wood.id} className="text-center text-sm">
                              {wood.origin.countries[0]}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Detailed Specifications */}
            <TabsContent value="specifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Specification</TableHead>
                        {selectedWoodData.map((wood) => (
                          <TableHead key={wood.id} className="text-center">
                            {wood.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Density (kg/m³)</TableCell>
                        {selectedWoodData.map((wood) => (
                          <TableCell key={wood.id} className="text-center">
                            {wood.specifications.density}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Hardness (Janka)</TableCell>
                        {selectedWoodData.map((wood) => (
                          <TableCell key={wood.id} className="text-center">
                            {wood.specifications.hardness}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Durability Class</TableCell>
                        {selectedWoodData.map((wood) => (
                          <TableCell key={wood.id} className="text-center capitalize">
                            {wood.specifications.durability}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Workability</TableCell>
                        {selectedWoodData.map((wood) => (
                          <TableCell key={wood.id} className="text-center capitalize">
                            {wood.specifications.workability}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Termite Resistance</TableCell>
                        {selectedWoodData.map((wood) => (
                          <TableCell key={wood.id} className="text-center">
                            {wood.specifications.naturalResistance.termites ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Moisture Resistance</TableCell>
                        {selectedWoodData.map((wood) => (
                          <TableCell key={wood.id} className="text-center">
                            {wood.specifications.naturalResistance.moisture ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pricing Analysis */}
            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedWoodData
                        .sort((a, b) => a.pricing.pricePerSqFt - b.pricing.pricePerSqFt)
                        .map((wood, index) => (
                          <div key={wood.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{wood.name}</h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {wood.pricing.priceRange} range
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-600">
                                ₹{wood.pricing.pricePerSqFt}
                              </div>
                              <div className="text-sm text-gray-500">per sq.ft</div>
                              {index === 0 && (
                                <Badge className="mt-1 bg-green-100 text-green-800">
                                  Best Value
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Value Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedWoodData.map((wood) => (
                        <div key={wood.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{wood.name}</span>
                            <Badge className={getGradeColor(wood.grade)}>
                              {wood.grade}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Cost Value:</span>
                              <MetricBar value={wood.comparisonMetrics.costValue} />
                            </div>
                            <div>
                              <span className="text-gray-600">Availability:</span>
                              <MetricBar value={wood.comparisonMetrics.availability} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pros and Cons */}
            <TabsContent value="pros-cons" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedWoodData.map((wood) => (
                  <Card key={wood.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {wood.name}
                        <Badge className={getGradeColor(wood.grade)}>
                          {wood.grade}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Advantages
                          </h4>
                          <ul className="space-y-1">
                            {wood.prosAndCons.pros.slice(0, 4).map((pro, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-green-600 mt-1">•</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Considerations
                          </h4>
                          <ul className="space-y-1">
                            {wood.prosAndCons.cons.slice(0, 3).map((con, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button asChild variant="outline" className="w-full">
                          <Link to={`/products/wood/${wood.id}`}>
                            View Full Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Recommendation */}
          {selectedWoodData.length >= 2 && (
            <Card className="bg-gradient-to-r from-timber-50 to-amber-50">
              <CardHeader>
                <CardTitle>Our Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Based on your selection, here are our recommendations:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">Best for Premium Projects</h4>
                      <p className="text-lg font-semibold">
                        {selectedWoodData.find(w => w.grade === 'premium')?.name || selectedWoodData[0]?.name}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">Best Value</h4>
                      <p className="text-lg font-semibold">
                        {selectedWoodData
                          .sort((a, b) => b.comparisonMetrics.costValue - a.comparisonMetrics.costValue)[0]?.name}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">Most Sustainable</h4>
                      <p className="text-lg font-semibold">
                        {selectedWoodData
                          .sort((a, b) => b.comparisonMetrics.sustainability - a.comparisonMetrics.sustainability)[0]?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {selectedWoodData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🌳</div>
          <h3 className="text-xl font-medium mb-2">Select Woods to Compare</h3>
          <p>Choose at least 2 wood types from above to start comparing their properties.</p>
        </div>
      )}
    </div>
  );
};

export default WoodComparisonTool;