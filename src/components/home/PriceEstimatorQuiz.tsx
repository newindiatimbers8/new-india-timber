
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem, 
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QuizStep = 'type' | 'size' | 'materials' | 'results';

interface MaterialPrice {
  [key: string]: number; // price per unit in Rs
}

const materialPrices: MaterialPrice = {
  "burmaTeak": 3500, // per sq ft
  "ghanaTeak": 2800, // per sq ft
  "brazilianTeak": 3200, // per sq ft
  "indianSal": 1600, // per sq ft
  "centuryPlySainik": 2200, // per sheet (standard size)
  "marinePlywood": 2600, // per sheet (standard size)
  "laminatedPlywood": 1800, // per sheet (standard size)
  "waterproofPlywood": 2400 // per sheet (standard size)
};

const PriceEstimatorQuiz = () => {
  const [currentStep, setCurrentStep] = useState<QuizStep>('type');
  const [projectType, setProjectType] = useState<string>('');
  const [areaSize, setAreaSize] = useState<number>(500);
  const [numDoors, setNumDoors] = useState<number>(4);
  const [numWindows, setNumWindows] = useState<number>(6);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

  const handleNextStep = () => {
    switch(currentStep) {
      case 'type':
        setCurrentStep('size');
        break;
      case 'size':
        setCurrentStep('materials');
        break;
      case 'materials':
        calculateEstimate();
        setCurrentStep('results');
        break;
      default:
        // Reset quiz
        setCurrentStep('type');
        setProjectType('');
        setAreaSize(500);
        setNumDoors(4);
        setNumWindows(6);
        setSelectedMaterials([]);
        setEstimatedPrice(0);
    }
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev => 
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const calculateEstimate = () => {
    // Basic estimation algorithm
    let estimate = 0;
    
    // Base cost by project type
    const baseMultiplier = projectType === 'residential' ? 1 : 1.25;
    
    // Calculate materials cost
    if (selectedMaterials.length > 0) {
      const averageMaterialPrice = selectedMaterials.reduce(
        (sum, material) => sum + materialPrices[material], 0
      ) / selectedMaterials.length;
      
      // Door and window cost
      const doorCost = numDoors * averageMaterialPrice * 20; // Assuming standard door size
      const windowCost = numWindows * averageMaterialPrice * 10; // Assuming standard window size
      
      // Area cost (simplified for estimation)
      const areaCost = areaSize * 100; // Base area cost
      
      estimate = (doorCost + windowCost + areaCost) * baseMultiplier;
    } else {
      // Default estimation if no materials selected
      estimate = areaSize * 500 + (numDoors * 8000) + (numWindows * 5000);
    }
    
    setEstimatedPrice(Math.round(estimate));
  };

  return (
    <div className="py-12 bg-accent rounded-lg shadow-inner">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Price Estimator</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get a quick estimate for your timber project in just a few steps
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                {currentStep === 'type' && "What type of project are you planning?"}
                {currentStep === 'size' && "What's the size of your project?"}
                {currentStep === 'materials' && "Select your preferred materials"}
                {currentStep === 'results' && "Your Estimated Project Cost"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Step 1: Project Type */}
              {currentStep === 'type' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant={projectType === 'residential' ? 'default' : 'outline'} 
                      className={`h-32 ${projectType === 'residential' ? 'bg-timber-600 hover:bg-timber-700' : ''}`} 
                      onClick={() => setProjectType('residential')}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-semibold">Residential</span>
                        <span className="text-sm mt-2">Home, Apartment, Villa</span>
                      </div>
                    </Button>
                    <Button 
                      variant={projectType === 'commercial' ? 'default' : 'outline'} 
                      className={`h-32 ${projectType === 'commercial' ? 'bg-forest-700 hover:bg-forest-800' : ''}`} 
                      onClick={() => setProjectType('commercial')}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-semibold">Commercial</span>
                        <span className="text-sm mt-2">Office, Shop, Restaurant</span>
                      </div>
                    </Button>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={handleNextStep} 
                      disabled={!projectType}
                      className="bg-timber-600 hover:bg-timber-700"
                    >
                      Next <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Project Size */}
              {currentStep === 'size' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="area-size" className="text-base font-medium">
                        Approximate area (sq. ft): {areaSize}
                      </Label>
                      <Slider
                        id="area-size"
                        defaultValue={[areaSize]}
                        min={100}
                        max={5000}
                        step={50}
                        onValueChange={(value) => setAreaSize(value[0])}
                        className="my-4"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>100 sq.ft</span>
                        <span>5000 sq.ft</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="doors" className="text-base font-medium">Number of Doors</Label>
                        <div className="flex items-center space-x-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setNumDoors(Math.max(0, numDoors - 1))}
                          >
                            -
                          </Button>
                          <span className="text-lg font-medium w-8 text-center">{numDoors}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setNumDoors(numDoors + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="windows" className="text-base font-medium">Number of Windows</Label>
                        <div className="flex items-center space-x-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setNumWindows(Math.max(0, numWindows - 1))}
                          >
                            -
                          </Button>
                          <span className="text-lg font-medium w-8 text-center">{numWindows}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setNumWindows(numWindows + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('type')}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleNextStep} 
                      className="bg-timber-600 hover:bg-timber-700"
                    >
                      Next <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Materials */}
              {currentStep === 'materials' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Select one or more materials that you're interested in using for your project:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="burmaTeak" 
                          checked={selectedMaterials.includes('burmaTeak')} 
                          onCheckedChange={() => toggleMaterial('burmaTeak')}
                        />
                        <div className="space-y-1">
                          <Label 
                            htmlFor="burmaTeak" 
                            className="font-medium cursor-pointer"
                          >
                            Burma Teak
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Premium quality, dark brown with high density
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="ghanaTeak" 
                          checked={selectedMaterials.includes('ghanaTeak')} 
                          onCheckedChange={() => toggleMaterial('ghanaTeak')}
                        />
                        <div className="space-y-1">
                          <Label 
                            htmlFor="ghanaTeak" 
                            className="font-medium cursor-pointer"
                          >
                            Ghana Teak
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            High-quality imported teak with beautiful grain
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="brazilianTeak" 
                          checked={selectedMaterials.includes('brazilianTeak')} 
                          onCheckedChange={() => toggleMaterial('brazilianTeak')}
                        />
                        <div className="space-y-1">
                          <Label 
                            htmlFor="brazilianTeak" 
                            className="font-medium cursor-pointer"
                          >
                            Brazilian Teak
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Exotic hardwood with distinctive appearance
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="indianSal" 
                          checked={selectedMaterials.includes('indianSal')} 
                          onCheckedChange={() => toggleMaterial('indianSal')}
                        />
                        <div className="space-y-1">
                          <Label 
                            htmlFor="indianSal" 
                            className="font-medium cursor-pointer"
                          >
                            Indian Sal
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Budget-friendly option with good durability
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="centuryPlySainik" 
                          checked={selectedMaterials.includes('centuryPlySainik')} 
                          onCheckedChange={() => toggleMaterial('centuryPlySainik')}
                        />
                        <div className="space-y-1">
                          <Label 
                            htmlFor="centuryPlySainik" 
                            className="font-medium cursor-pointer"
                          >
                            Century Ply Sainik MR
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Moisture resistant plywood for interior use
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="marinePlywood" 
                          checked={selectedMaterials.includes('marinePlywood')} 
                          onCheckedChange={() => toggleMaterial('marinePlywood')}
                        />
                        <div className="space-y-1">
                          <Label 
                            htmlFor="marinePlywood" 
                            className="font-medium cursor-pointer"
                          >
                            Marine Plywood
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Weather resistant, ideal for outdoor applications
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="laminatedPlywood" 
                          checked={selectedMaterials.includes('laminatedPlywood')} 
                          onCheckedChange={() => toggleMaterial('laminatedPlywood')}
                        />
                        <div className="space-y-1">
                          <Label 
                            htmlFor="laminatedPlywood" 
                            className="font-medium cursor-pointer"
                          >
                            Laminated Plywood
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Pre-finished decorative surface, ready to use
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="waterproofPlywood" 
                          checked={selectedMaterials.includes('waterproofPlywood')} 
                          onCheckedChange={() => toggleMaterial('waterproofPlywood')}
                        />
                        <div className="space-y-1">
                          <Label 
                            htmlFor="waterproofPlywood" 
                            className="font-medium cursor-pointer"
                          >
                            Waterproof Plywood
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Fully waterproof, for bathrooms and outdoor use
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('size')}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleNextStep} 
                      disabled={selectedMaterials.length === 0}
                      className="bg-timber-600 hover:bg-timber-700"
                    >
                      Get Estimate <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Results */}
              {currentStep === 'results' && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <p className="text-lg mb-2">Your estimated project cost:</p>
                    <p className="text-4xl font-bold text-timber-700">₹{estimatedPrice.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-muted-foreground mt-4">
                      This is a preliminary estimate based on the information provided. 
                      For a detailed quote, please contact our team.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('type')}
                    >
                      Start Over
                    </Button>
                    <Button 
                      className="bg-forest-700 hover:bg-forest-800"
                      asChild
                    >
                      <a href="/contact">Get Detailed Quote</a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PriceEstimatorQuiz;
