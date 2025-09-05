
/* CALCULATOR COMPONENT COMMENTED OUT
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Download, Save } from "lucide-react";

interface ProjectFormData {
  purpose: string;
  projectType: string;
  doorCount: number;
  windowCount: number;
  needFlooring: boolean;
  flooringArea: number;
  woodType: string;
}

interface PriceRates {
  [key: string]: {
    doorPrice: number;
    windowPrice: number;
    flooringPricePerSqFt: number;
  };
}

const projectTypes = [
  "Residential Building",
  "Villa",
  "Apartment",
  "PG",
  "Hostel",
  "Co-living",
  "Studio Room",
  "Hostel Room",
  "Hotel Rooms",
  "Bungalows",
  "Community Project",
  "Resorts"
];

const woodTypes = [
  "Burma Teak",
  "Ghana Teak",
  "Brazilian Teak",
  "Indian Sal",
  "Century Ply Sainik MR",
  "Marine Plywood"
];

// Sample price rates
const priceRates: PriceRates = {
  "Burma Teak": {
    doorPrice: 50000,
    windowPrice: 25000,
    flooringPricePerSqFt: 1000
  },
  "Ghana Teak": {
    doorPrice: 38000,
    windowPrice: 18000,
    flooringPricePerSqFt: 800
  },
  "Brazilian Teak": {
    doorPrice: 43000,
    windowPrice: 22000,
    flooringPricePerSqFt: 900
  },
  "Indian Sal": {
    doorPrice: 22000,
    windowPrice: 12000,
    flooringPricePerSqFt: 500
  },
  "Century Ply Sainik MR": {
    doorPrice: 12000,
    windowPrice: 8000,
    flooringPricePerSqFt: 300
  },
  "Marine Plywood": {
    doorPrice: 15000,
    windowPrice: 10000,
    flooringPricePerSqFt: 400
  }
};

const CostCalculator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProjectFormData>({
    purpose: "residential",
    projectType: "",
    doorCount: 0,
    windowCount: 0,
    needFlooring: false,
    flooringArea: 0,
    woodType: ""
  });
  
  const [calculationDone, setCalculationDone] = useState(false);
  const [costBreakdown, setCostBreakdown] = useState<{ [key: string]: number }>({});
  const [totalCost, setTotalCost] = useState(0);
  
  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset calculation when form changes
    if (calculationDone) {
      setCalculationDone(false);
    }
  };
  
  const calculateCost = () => {
    if (!formData.woodType) {
      toast({
        title: "Missing Information",
        description: "Please select a wood type to calculate costs.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.doorCount === 0 && formData.windowCount === 0 && (!formData.needFlooring || formData.flooringArea === 0)) {
      toast({
        title: "Missing Information",
        description: "Please enter at least one item quantity (doors, windows, or flooring area).",
        variant: "destructive"
      });
      return;
    }
    
    const rates = priceRates[formData.woodType];
    
    const doorCost = formData.doorCount * rates.doorPrice;
    const windowCost = formData.windowCount * rates.windowPrice;
    const flooringCost = formData.needFlooring ? formData.flooringArea * rates.flooringPricePerSqFt : 0;
    
    const breakdown = {
      doors: doorCost,
      windows: windowCost,
      flooring: flooringCost
    };
    
    const total = doorCost + windowCost + flooringCost;
    
    setCostBreakdown(breakdown);
    setTotalCost(total);
    setCalculationDone(true);
  };
  
  const saveQuote = () => {
    toast({
      title: "Quote Saved",
      description: "Your cost calculation has been saved.",
    });
  };
  
  const requestFormalQuote = () => {
    toast({
      title: "Quote Requested",
      description: "Our team will contact you with a formal quote soon.",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calculate Your Wood Cost</CardTitle>
        <CardDescription>
          Estimate the cost of your wood requirements based on your project specifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Purpose */}
        <div className="space-y-2">
          <Label htmlFor="purpose">Is it for Commercial or Residential?</Label>
          <Select 
            value={formData.purpose} 
            onValueChange={(value) => handleChange("purpose", value)}
          >
            <SelectTrigger id="purpose">
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Project Type */}
        <div className="space-y-2">
          <Label htmlFor="project-type">Project Type</Label>
          <Select 
            value={formData.projectType} 
            onValueChange={(value) => handleChange("projectType", value)}
          >
            <SelectTrigger id="project-type">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Wood Type */}
        <div className="space-y-2">
          <Label htmlFor="wood-type">Wood Type</Label>
          <Select 
            value={formData.woodType} 
            onValueChange={(value) => handleChange("woodType", value)}
          >
            <SelectTrigger id="wood-type">
              <SelectValue placeholder="Select wood type" />
            </SelectTrigger>
            <SelectContent>
              {woodTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Doors */}
        <div className="space-y-2">
          <Label htmlFor="door-count">How many doors?</Label>
          <Input 
            id="door-count" 
            type="number" 
            min="0"
            value={formData.doorCount} 
            onChange={(e) => handleChange("doorCount", parseInt(e.target.value) || 0)}
          />
        </div>
        
        {/* Windows */}
        <div className="space-y-2">
          <Label htmlFor="window-count">How many windows?</Label>
          <Input 
            id="window-count" 
            type="number" 
            min="0"
            value={formData.windowCount} 
            onChange={(e) => handleChange("windowCount", parseInt(e.target.value) || 0)}
          />
        </div>
        
        {/* Flooring */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="need-flooring">Wooden flooring?</Label>
            <Switch 
              id="need-flooring" 
              checked={formData.needFlooring}
              onCheckedChange={(checked) => handleChange("needFlooring", checked)}
            />
          </div>
          
          {formData.needFlooring && (
            <div className="space-y-2">
              <Label htmlFor="flooring-area">How many square feet?</Label>
              <Input 
                id="flooring-area" 
                type="number" 
                min="0"
                value={formData.flooringArea} 
                onChange={(e) => handleChange("flooringArea", parseInt(e.target.value) || 0)}
              />
            </div>
          )}
        </div>
        
        <Button 
          onClick={calculateCost} 
          className="w-full bg-forest-700 hover:bg-forest-800"
        >
          Calculate Cost
        </Button>
        
        {calculationDone && (
          <div className="p-4 bg-timber-50 rounded-md mt-4 animate-fade-in">
            <h3 className="font-bold text-lg mb-2">Cost Breakdown</h3>
            
            {costBreakdown.doors > 0 && (
              <div className="flex justify-between py-2">
                <span>{formData.doorCount} {formData.woodType} doors:</span>
                <span>₹{costBreakdown.doors.toLocaleString()}</span>
              </div>
            )}
            
            {costBreakdown.windows > 0 && (
              <div className="flex justify-between py-2">
                <span>{formData.windowCount} {formData.woodType} windows:</span>
                <span>₹{costBreakdown.windows.toLocaleString()}</span>
              </div>
            )}
            
            {costBreakdown.flooring > 0 && (
              <div className="flex justify-between py-2">
                <span>{formData.flooringArea} sq.ft. {formData.woodType} flooring:</span>
                <span>₹{costBreakdown.flooring.toLocaleString()}</span>
              </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="flex justify-between py-2 font-bold">
              <span>Total Estimated Cost:</span>
              <span>₹{totalCost.toLocaleString()}</span>
            </div>
            
            <div className="text-sm text-gray-500 mt-2">
              Note: This is an estimated cost. Contact us for a precise quote.
            </div>
          </div>
        )}
      </CardContent>
      
      {calculationDone && (
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex space-x-4 w-full">
            <Button 
              onClick={saveQuote} 
              variant="outline"
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" /> Save Quote
            </Button>
            <Button 
              onClick={requestFormalQuote}
              className="flex-1 bg-timber-600 hover:bg-timber-700"
            >
              <Download className="mr-2 h-4 w-4" /> Request Formal Quote
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CostCalculator;
*/
/* END CALCULATOR COMPONENT COMMENTED OUT */
