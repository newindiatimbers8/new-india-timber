import { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Download, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { getAIProjectInsights, type ProjectDetails } from "@/utils/aiUtils";
import { generatePDF, generateQuoteNumber } from "@/utils/pdfUtils";

// Enhanced quiz step types
type QuizStep = 
  | 'type' 
  | 'sub-type' 
  | 'size' 
  | 'door-details'
  | 'window-details'
  | 'additional-woodwork'
  | 'materials' 
  | 'design-preferences'
  | 'environmental'
  | 'budget'
  | 'ai-questions' 
  | 'results';

interface MaterialPrice {
  [key: string]: number; // price per unit in Rs
}

// Door types and their base prices
interface DoorType {
  type: string;
  description: string;
  priceMultiplier: number; // Multiplier applied to base price
}

// Window types and their base prices
interface WindowType {
  type: string;
  description: string;
  priceMultiplier: number; // Multiplier applied to base price
}

// Material prices
const materialPrices: MaterialPrice = {
  "burmaTeak": 3500, // per sq ft
  "ghanaTeak": 2800, // per sq ft
  "brazilianTeak": 3200, // per sq ft
  "indianSal": 1600, // per sq ft
  "centuryPlySainik": 2200, // per sheet (standard size)
  "marinePlywood": 2600, // per sheet (standard size)
  "laminatedPlywood": 1800, // per sheet (standard size)
  "waterproofPlywood": 2400, // per sheet (standard size)
  "oakWood": 2900, // per sq ft
  "mapleWood": 3100, // per sq ft
  "cherryWood": 3400, // per sq ft
  "mahoganyWood": 3800, // per sq ft
  "pineWood": 1200, // per sq ft
  "cedarWood": 2600, // per sq ft
  "bambooWood": 1800 // per sq ft
};

// Door types
const doorTypes: DoorType[] = [
  { type: "standard", description: "Standard single panel door", priceMultiplier: 1.0 },
  { type: "paneled", description: "Multi-panel decorative door", priceMultiplier: 1.3 },
  { type: "flush", description: "Smooth surface door", priceMultiplier: 0.9 },
  { type: "french", description: "Glass paneled door", priceMultiplier: 1.5 },
  { type: "sliding", description: "Space-saving sliding door", priceMultiplier: 1.4 },
  { type: "folding", description: "Bi-fold or accordion style", priceMultiplier: 1.6 },
  { type: "custom", description: "Custom design door", priceMultiplier: 2.0 }
];

// Window types
const windowTypes: WindowType[] = [
  { type: "fixed", description: "Non-opening window", priceMultiplier: 0.8 },
  { type: "casement", description: "Side-hinged opening window", priceMultiplier: 1.0 },
  { type: "sliding", description: "Horizontal sliding window", priceMultiplier: 1.2 },
  { type: "double-hung", description: "Vertically sliding window", priceMultiplier: 1.3 },
  { type: "bay", description: "Protruding bay window", priceMultiplier: 1.7 },
  { type: "skylight", description: "Ceiling/roof window", priceMultiplier: 1.6 },
  { type: "custom", description: "Custom design window", priceMultiplier: 1.8 }
];

// Additional woodwork types
const additionalWoodworkTypes = [
  { id: "cabinetry", label: "Kitchen/Bathroom Cabinetry" },
  { id: "shelving", label: "Built-in Shelves & Storage" },
  { id: "paneling", label: "Wall Paneling" },
  { id: "stairs", label: "Staircase & Railing" },
  { id: "furniture", label: "Custom Furniture" },
  { id: "ceiling", label: "Ceiling Work" },
  { id: "exterior", label: "Exterior Woodwork" },
  { id: "flooring", label: "Wooden Flooring" },
  { id: "partition", label: "Wooden Partition/Room Divider" },
  { id: "moulding", label: "Decorative Moulding & Trim" }
];

// Design styles
const designStyles = [
  { id: "traditional", label: "Traditional Indian" },
  { id: "modern", label: "Modern Minimalist" },
  { id: "contemporary", label: "Contemporary" },
  { id: "rustic", label: "Rustic/Natural" },
  { id: "colonial", label: "Colonial" },
  { id: "industrial", label: "Industrial" },
  { id: "artDeco", label: "Art Deco" },
  { id: "scandinavian", label: "Scandinavian" }
];

// Finish types
const finishTypes = [
  { id: "natural", label: "Natural/Clear Coat" },
  { id: "stained", label: "Stained" },
  { id: "painted", label: "Painted" },
  { id: "distressed", label: "Distressed/Weathered" },
  { id: "glossy", label: "High Gloss" },
  { id: "matte", label: "Matte Finish" },
  { id: "oiled", label: "Oil Finish" }
];

// Climate zones in India
const climateZones = [
  { id: "hot-dry", label: "Hot and Dry (Rajasthan, Gujarat, parts of Maharashtra)" },
  { id: "hot-humid", label: "Hot and Humid (Coastal areas, Kerala, Tamil Nadu)" },
  { id: "temperate", label: "Temperate (Karnataka, Andhra Pradesh)" },
  { id: "cold", label: "Cold (Himachal Pradesh, Uttarakhand, J&K)" },
  { id: "composite", label: "Composite (Delhi, UP, MP, Bihar)" }
];

// Residential project types
const residentialProjectTypes = [
  "Independent House/Villa",
  "Apartment/Flat",
  "Bungalow",
  "Row House",
  "Farmhouse",
  "Studio Apartment",
  "Penthouse",
  "Cottage",
  "Duplex/Triplex"
];

// Commercial project types
const commercialProjectTypes = [
  "Office Space",
  "Retail Shop/Store",
  "Restaurant/Café",
  "Hotel/Resort",
  "Educational Institution",
  "Healthcare Facility",
  "Coworking Space",
  "Showroom",
  "Warehouse/Industrial",
  "Banquet Hall/Event Space"
];

// Define the interface for AI question responses to match ProjectDetails
interface AIQuestionResponses {
  projectPurpose: string;
  specificRequirements: string;
  timeline: string;
  challenges: string;
  maintenanceExpectations?: string;
  regionalPreferences?: string;
}

const PriceEstimatorQuiz = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<QuizStep>('type');
  const [projectType, setProjectType] = useState<string>('');
  const [projectSubType, setProjectSubType] = useState<string>('');
  const [areaSize, setAreaSize] = useState<number>(500);
  
  // Door details
  const [numDoors, setNumDoors] = useState<number>(4);
  const [selectedDoorTypes, setSelectedDoorTypes] = useState<string[]>([]);
  const [doorSizes, setDoorSizes] = useState<{width: number, height: number}>({width: 3, height: 7});
  const [doorFinishes, setDoorFinishes] = useState<string[]>([]);
  
  // Window details
  const [numWindows, setNumWindows] = useState<number>(6);
  const [selectedWindowTypes, setSelectedWindowTypes] = useState<string[]>([]);
  const [windowSizes, setWindowSizes] = useState<{width: number, height: number}>({width: 3, height: 4});
  
  // Additional woodwork
  const [additionalWoodwork, setAdditionalWoodwork] = useState<string[]>([]);
  const [additionalWoodworkDetails, setAdditionalWoodworkDetails] = useState<string>('');
  
  // Materials and design
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [designStyle, setDesignStyle] = useState<string>('');
  const [finishPreferences, setFinishPreferences] = useState<string[]>([]);
  
  // Environmental factors
  const [climateZone, setClimateZone] = useState<string>('');
  const [sustainabilityPreference, setSustainabilityPreference] = useState<number>(3); // Scale 1-5
  const [termiteProtection, setTermiteProtection] = useState<boolean>(false);
  const [moistureResistance, setMoistureResistance] = useState<boolean>(false);
  
  // Budget factors
  const [budgetRange, setBudgetRange] = useState<string>('medium');
  const [budgetFlexibility, setBudgetFlexibility] = useState<string>('somewhat');
  const [priorityFactor, setPriorityFactor] = useState<string>('quality');
  
  // AI questions
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);
  const [aiQuestionResponses, setAiQuestionResponses] = useState<AIQuestionResponses>({
    projectPurpose: '',
    specificRequirements: '',
    timeline: '',
    challenges: '',
    maintenanceExpectations: '',
    regionalPreferences: ''
  });

  const handleNextStep = async () => {
    switch(currentStep) {
      case 'type':
        setCurrentStep('sub-type');
        break;
      case 'sub-type':
        setCurrentStep('size');
        break;
      case 'size':
        setCurrentStep('door-details');
        break;
      case 'door-details':
        setCurrentStep('window-details');
        break;
      case 'window-details':
        setCurrentStep('additional-woodwork');
        break;
      case 'additional-woodwork':
        setCurrentStep('materials');
        break;
      case 'materials':
        setCurrentStep('design-preferences');
        break;
      case 'design-preferences':
        setCurrentStep('environmental');
        break;
      case 'environmental':
        setCurrentStep('budget');
        break;
      case 'budget':
        calculateEstimate();
        setCurrentStep('ai-questions');
        break;
      case 'ai-questions':
        setIsLoadingInsights(true);
        try {
          // Enhanced project details with all the additional information
          const projectDetails: ProjectDetails = {
            projectType,
            projectSubType,
            areaSize,
            numDoors,
            numWindows,
            selectedMaterials,
            estimatedPrice,
            doorDetails: {
              types: selectedDoorTypes,
              sizes: doorSizes,
              finishes: doorFinishes
            },
            windowDetails: {
              types: selectedWindowTypes,
              sizes: windowSizes
            },
            additionalWoodwork: {
              types: additionalWoodwork,
              details: additionalWoodworkDetails
            },
            designPreferences: {
              style: designStyle,
              finishes: finishPreferences
            },
            environmentalFactors: {
              climateZone,
              sustainabilityPreference,
              termiteProtection,
              moistureResistance
            },
            budgetInfo: {
              range: budgetRange,
              flexibility: budgetFlexibility,
              priority: priorityFactor
            },
            additionalInfo: aiQuestionResponses
          };

          const insights = await getAIProjectInsights(projectDetails);
          setAiInsights(insights);
        } catch (error) {
          console.error("Error fetching AI insights:", error);
          setAiInsights("Unable to generate insights at this time. Please try again later.");
        } finally {
          setIsLoadingInsights(false);
          setCurrentStep('results');
        }
        break;
      default:
        // Reset quiz
        resetQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentStep('type');
    setProjectType('');
    setProjectSubType('');
    setAreaSize(500);
    setNumDoors(4);
    setSelectedDoorTypes([]);
    setDoorSizes({width: 3, height: 7});
    setDoorFinishes([]);
    setNumWindows(6);
    setSelectedWindowTypes([]);
    setWindowSizes({width: 3, height: 4});
    setAdditionalWoodwork([]);
    setAdditionalWoodworkDetails('');
    setSelectedMaterials([]);
    setDesignStyle('');
    setFinishPreferences([]);
    setClimateZone('');
    setSustainabilityPreference(3);
    setTermiteProtection(false);
    setMoistureResistance(false);
    setBudgetRange('medium');
    setBudgetFlexibility('somewhat');
    setPriorityFactor('quality');
    setEstimatedPrice(0);
    setAiInsights('');
    setAiQuestionResponses({
      projectPurpose: '',
      specificRequirements: '',
      timeline: '',
      challenges: '',
      maintenanceExpectations: '',
      regionalPreferences: ''
    });
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev => 
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const toggleDoorType = (type: string) => {
    setSelectedDoorTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleWindowType = (type: string) => {
    setSelectedWindowTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleAdditionalWoodwork = (type: string) => {
    setAdditionalWoodwork(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleFinishType = (type: string) => {
    setFinishPreferences(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const calculateEstimate = () => {
    // Enhanced pricing algorithm that takes into account all the additional factors
    let estimate = 0;
    
    // Base cost by project type
    const baseMultiplier = projectType === 'residential' ? 1 : 1.25;
    
    // Calculate materials cost
    if (selectedMaterials.length > 0) {
      const averageMaterialPrice = selectedMaterials.reduce(
        (sum, material) => sum + materialPrices[material], 0
      ) / selectedMaterials.length;
      
      // Door cost with type factors
      let doorCost = 0;
      if (selectedDoorTypes.length > 0) {
        const doorTypeObj = doorTypes.find(d => selectedDoorTypes.includes(d.type));
        const doorTypeMultiplier = doorTypeObj ? doorTypeObj.priceMultiplier : 1.0;
        doorCost = numDoors * averageMaterialPrice * 20 * doorTypeMultiplier * 
                  (doorSizes.width * doorSizes.height / 21); // Normalized to standard door size
      } else {
        doorCost = numDoors * averageMaterialPrice * 20; // Standard door cost
      }
      
      // Window cost with type factors
      let windowCost = 0;
      if (selectedWindowTypes.length > 0) {
        const windowTypeObj = windowTypes.find(w => selectedWindowTypes.includes(w.type));
        const windowTypeMultiplier = windowTypeObj ? windowTypeObj.priceMultiplier : 1.0;
        windowCost = numWindows * averageMaterialPrice * 10 * windowTypeMultiplier *
                    (windowSizes.width * windowSizes.height / 12); // Normalized to standard window size
      } else {
        windowCost = numWindows * averageMaterialPrice * 10; // Standard window cost
      }
      
      // Additional woodwork cost
      const additionalWoodworkCost = additionalWoodwork.length * averageMaterialPrice * 50;
      
      // Area cost (simplified for estimation)
      const areaCost = areaSize * 100; // Base area cost
      
      // Design style factor
      let designFactor = 1.0;
      switch (designStyle) {
        case 'traditional':
          designFactor = 1.2;
          break;
        case 'modern':
          designFactor = 1.1;
          break;
        case 'artDeco':
          designFactor = 1.35;
          break;
        case 'rustic':
          designFactor = 1.05;
          break;
        default:
          designFactor = 1.0;
      }
      
      // Environmental factors
      let environmentalFactor = 1.0;
      if (termiteProtection) environmentalFactor += 0.08;
      if (moistureResistance) environmentalFactor += 0.07;
      if (climateZone === 'hot-humid' || climateZone === 'hot-dry') environmentalFactor += 0.05;
      if (climateZone === 'cold') environmentalFactor += 0.03;
      
      // Finish preferences factor
      const finishFactor = 1 + (finishPreferences.length * 0.03);
      
      // Budget factors
      let budgetFactor = 1.0;
      switch (budgetRange) {
        case 'low':
          budgetFactor = 0.85;
          break;
        case 'medium':
          budgetFactor = 1.0;
          break;
        case 'high':
          budgetFactor = 1.2;
          break;
        case 'luxury':
          budgetFactor = 1.5;
          break;
      }
      
      // Priority factor
      let priorityMultiplier = 1.0;
      if (priorityFactor === 'quality') priorityMultiplier = 1.15;
      if (priorityFactor === 'speed') priorityMultiplier = 1.08;
      
      // Factor in AI question responses for more personalized estimate
      let complexityMultiplier = 1;
      if (aiQuestionResponses.specificRequirements.toLowerCase().includes('custom')) {
        complexityMultiplier += 0.15; // Custom requirements add 15%
      }
      if (aiQuestionResponses.timeline.toLowerCase().includes('urgent') || 
          aiQuestionResponses.timeline.toLowerCase().includes('immediate')) {
        complexityMultiplier += 0.1; // Urgent timeline adds 10%
      }
      if (aiQuestionResponses.challenges.toLowerCase().includes('difficult') ||
          aiQuestionResponses.challenges.toLowerCase().includes('complex')) {
        complexityMultiplier += 0.08; // Complex challenges add 8%
      }
      
      // Combine all factors for final estimate
      estimate = (doorCost + windowCost + additionalWoodworkCost + areaCost) * 
                baseMultiplier * designFactor * environmentalFactor * finishFactor * 
                budgetFactor * priorityMultiplier * complexityMultiplier;
    } else {
      // Default estimation if no materials selected
      estimate = areaSize * 500 + (numDoors * 8000) + (numWindows * 5000);
    }
    
    setEstimatedPrice(Math.round(estimate));
  };

  const handleDownloadPDF = async () => {
    try {
      const projectDetails: ProjectDetails = {
        projectType,
        projectSubType,
        areaSize,
        numDoors,
        numWindows,
        selectedMaterials,
        estimatedPrice,
        doorDetails: {
          types: selectedDoorTypes,
          sizes: doorSizes,
          finishes: doorFinishes
        },
        windowDetails: {
          types: selectedWindowTypes,
          sizes: windowSizes
        },
        additionalWoodwork: {
          types: additionalWoodwork,
          details: additionalWoodworkDetails
        },
        designPreferences: {
          style: designStyle,
          finishes: finishPreferences
        },
        environmentalFactors: {
          climateZone,
          sustainabilityPreference,
          termiteProtection,
          moistureResistance
        },
        budgetInfo: {
          range: budgetRange,
          flexibility: budgetFlexibility,
          priority: priorityFactor
        },
        additionalInfo: aiQuestionResponses
      };

      await generatePDF({
        projectDetails,
        insights: aiInsights,
        quoteDate: new Date().toLocaleDateString('en-IN'),
        quoteNumber: generateQuoteNumber()
      });

      toast({
        title: "PDF Generated",
        description: "Your detailed estimate has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("PDF Error:", error);
      toast({
        title: "PDF Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="py-12 bg-accent rounded-lg shadow-inner">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Detailed Price Estimator</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get a comprehensive estimate for your timber project with AI-powered insights
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                {currentStep === 'type' && "What type of project are you planning?"}
                {currentStep === 'sub-type' && "Select your specific project type"}
                {currentStep === 'size' && "What's the size of your project?"}
                {currentStep === 'door-details' && "Tell us about the doors you need"}
                {currentStep === 'window-details' && "Tell us about the windows you need"}
                {currentStep === 'additional-woodwork' && "Any additional woodwork requirements?"}
                {currentStep === 'materials' && "Select your preferred materials"}
                {currentStep === 'design-preferences' && "What design style are you looking for?"}
                {currentStep === 'environmental' && "Environmental & durability considerations"}
                {currentStep === 'budget' && "Budget and priorities"}
                {currentStep === 'ai-questions' && "Tell us more about your project"}
                {currentStep === 'results' && "Your Detailed Project Estimate"}
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

              {/* Step 1B: Project Sub-Type */}
              {currentStep === 'sub-type' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Select specific project type:</Label>
                    <div className="grid grid-cols-1 gap-3 mt-3">
                      <Select 
                        value={projectSubType} 
                        onValueChange={(value) => setProjectSubType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectType === 'residential' ? (
                            residentialProjectTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))
                          ) : (
                            commercialProjectTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
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
                      disabled={!projectSubType}
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
                      onClick={() => setCurrentStep('sub-type')}
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

              {/* Step 3: Door Details */}
              {currentStep === 'door-details' && numDoors > 0 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Door Types (select all that apply):</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {doorTypes.map((door) => (
                        <div key={door.type} className="flex items-start space-x-3">
                          <Checkbox 
                            id={`door-${door.type}`} 
                            checked={selectedDoorTypes.includes(door.type)} 
                            onCheckedChange={() => toggleDoorType(door.type)}
                          />
                          <div className="space-y-1">
                            <Label 
                              htmlFor={`door-${door.type}`} 
                              className="font-medium cursor-pointer"
                            >
                              {door.type.charAt(0).toUpperCase() + door.type.slice(1)}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {door.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Label className="text-base font-medium">Average Door Dimensions:</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="space-y-2">
                          <Label htmlFor="door-width">Width (feet)</Label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              id="door-width" 
                              type="number" 
                              min="2"
                              max="10"
                              step="0.5"
                              value={doorSizes.width} 
                              onChange={(e) => setDoorSizes(prev => ({...prev, width: parseFloat(e.target.value) || prev.width}))}
                            />
                            <span className="text-sm">ft</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="door-height">Height (feet)</Label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              id="door-height" 
                              type="number" 
                              min="5"
                              max="12"
                              step="0.5"
                              value={doorSizes.height} 
                              onChange={(e) => setDoorSizes(prev => ({...prev, height: parseFloat(e.target.value) || prev.height}))}
                            />
                            <span className="text-sm">ft</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Label className="text-base font-medium">Door Finish Preferences:</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {finishTypes.slice(0, 4).map((finish) => (
                          <div key={finish.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`door-finish-${finish.id}`} 
                              checked={doorFinishes.includes(finish.id)} 
                              onCheckedChange={() => {
                                setDoorFinishes(prev => 
                                  prev.includes(finish.id)
                                    ? prev.filter(f => f !== finish.id)
                                    : [...prev, finish.id]
                                );
                              }}
                            />
                            <Label htmlFor={`door-finish-${finish.id}`}>{finish.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button 
                      variant
