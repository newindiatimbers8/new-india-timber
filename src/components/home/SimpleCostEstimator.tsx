/* SIMPLE COST ESTIMATOR COMPONENT COMMENTED OUT
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem, 
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Download, Mail, Calculator, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { generateSimpleEstimatePDF, generateQuoteNumber } from "@/utils/pdfUtils";

// Wood types with pricing
const woodTypes = [
  { id: "burma-teak", name: "Burma Teak", pricePerSqFt: 3500, category: "Premium" },
  { id: "ghana-teak", name: "Ghana Teak", pricePerSqFt: 2800, category: "Premium" },
  { id: "brazilian-teak", name: "Brazilian Teak", pricePerSqFt: 3200, category: "Premium" },
  { id: "red-sal", name: "Red Sal", pricePerSqFt: 1600, category: "Commercial" },
  { id: "indian-sal", name: "Indian Sal", pricePerSqFt: 1400, category: "Budget" },
  { id: "marine-plywood", name: "Marine Plywood", pricePerSqFt: 2600, category: "Specialized" },
  { id: "waterproof-plywood", name: "Waterproof Plywood", pricePerSqFt: 2400, category: "Commercial" },
  { id: "century-ply", name: "Century Ply", pricePerSqFt: 2200, category: "Commercial" }
];

// Project types
const projectTypes = [
  { id: "doors", name: "Doors", baseMultiplier: 1.0 },
  { id: "windows", name: "Windows", baseMultiplier: 0.8 },
  { id: "furniture", name: "Furniture", baseMultiplier: 1.2 },
  { id: "flooring", name: "Flooring", baseMultiplier: 0.9 },
  { id: "paneling", name: "Wall Paneling", baseMultiplier: 1.1 },
  { id: "cabinetry", name: "Cabinetry", baseMultiplier: 1.3 },
  { id: "custom", name: "Custom Work", baseMultiplier: 1.5 }
];

interface EstimateData {
  projectType: string;
  woodType: string;
  area: number;
  quantity: number;
  customRequirements: string;
  estimatedCost: number;
}

interface EmailDialogData {
  name: string;
  email: string;
  phone: string;
  additionalNotes: string;
}

const SimpleCostEstimator = () => {
  const { toast } = useToast();
  
  // Form state
  const [projectType, setProjectType] = useState<string>("");
  const [woodType, setWoodType] = useState<string>("");
  const [area, setArea] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [customRequirements, setCustomRequirements] = useState<string>("");
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  
  // Dialog states
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false);
  const [emailData, setEmailData] = useState<EmailDialogData>({
    name: "",
    email: "",
    phone: "",
    additionalNotes: ""
  });

  const calculateEstimate = () => {
    if (!projectType || !woodType || area <= 0) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields to calculate estimate.",
        variant: "destructive"
      });
      return;
    }

    const selectedWood = woodTypes.find(w => w.id === woodType);
    const selectedProject = projectTypes.find(p => p.id === projectType);
    
    if (!selectedWood || !selectedProject) return;

    // Base calculation
    let baseCost = selectedWood.pricePerSqFt * area * quantity;
    
    // Apply project type multiplier
    baseCost *= selectedProject.baseMultiplier;
    
    // Add complexity factor for custom requirements
    if (customRequirements.trim().length > 50) {
      baseCost *= 1.15; // 15% increase for detailed custom requirements
    }
    
    // Add labor and overhead (typically 40-60% of material cost)
    const totalCost = baseCost * 1.5;
    
    setEstimatedCost(Math.round(totalCost));
  };

  const handleDownloadPDF = async () => {
    if (estimatedCost === 0) {
      toast({
        title: "No Estimate Available",
        description: "Please calculate an estimate first.",
        variant: "destructive"
      });
      return;
    }

    const selectedWood = woodTypes.find(w => w.id === woodType);
    const selectedProject = projectTypes.find(p => p.id === projectType);

    const estimateData: EstimateData = {
      projectType: selectedProject?.name || "",
      woodType: selectedWood?.name || "",
      area,
      quantity,
      customRequirements,
      estimatedCost
    };

    try {
      await generateSimpleEstimatePDF({
        estimateData,
        quoteNumber: generateQuoteNumber(),
        quoteDate: new Date().toLocaleDateString('en-IN')
      });

      toast({
        title: "PDF Downloaded",
        description: "Your cost estimate has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF Error:", error);
      toast({
        title: "PDF Generation Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleEmailEstimate = () => {
    if (estimatedCost === 0) {
      toast({
        title: "No Estimate Available",
        description: "Please calculate an estimate first.",
        variant: "destructive"
      });
      return;
    }
    setShowEmailDialog(true);
  };

  const sendEmailEstimate = async () => {
    if (!emailData.name || !emailData.email) {
      toast({
        title: "Required Information Missing",
        description: "Please provide your name and email address.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the email via your backend
    // For now, we'll just show success and download the PDF
    try {
      await handleDownloadPDF();
      
      // Simulate email sending
      toast({
        title: "Estimate Sent!",
        description: `Cost estimate has been sent to ${emailData.email}`,
      });
      
      setShowEmailDialog(false);
      setEmailData({ name: "", email: "", phone: "", additionalNotes: "" });
    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setProjectType("");
    setWoodType("");
    setArea(0);
    setQuantity(1);
    setCustomRequirements("");
    setEstimatedCost(0);
  };

  const selectedWood = woodTypes.find(w => w.id === woodType);
  const selectedProject = projectTypes.find(p => p.id === projectType);

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quick Cost Estimator
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get an instant estimate for your wood project. Download as PDF or send to your email.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <Calculator className="h-6 w-6 text-timber-600" />
                Project Cost Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="project-type" className="text-base font-medium">
                    Project Type *
                  </Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wood-type" className="text-base font-medium">
                    Wood Type *
                  </Label>
                  <Select value={woodType} onValueChange={setWoodType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {woodTypes.map((wood) => (
                        <SelectItem key={wood.id} value={wood.id}>
                          <div className="flex justify-between w-full">
                            <span>{wood.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              ₹{wood.pricePerSqFt}/sq.ft
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedWood && (
                    <p className="text-sm text-gray-600">
                      Category: {selectedWood.category} | Rate: ₹{selectedWood.pricePerSqFt} per sq.ft
                    </p>
                  )}
                </div>
              </div>

              {/* Area and Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-base font-medium">
                    Area Required (sq.ft) *
                  </Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="Enter area in sq.ft"
                    value={area || ""}
                    onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-base font-medium">
                    Quantity/Units
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Number of units"
                    value={quantity || ""}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <p className="text-sm text-gray-500">
                    {projectType === 'doors' && 'Number of doors'}
                    {projectType === 'windows' && 'Number of windows'}
                    {projectType === 'furniture' && 'Number of pieces'}
                    {!projectType && 'Enter quantity of items needed'}
                  </p>
                </div>
              </div>

              {/* Custom Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-base font-medium">
                  Custom Requirements (Optional)
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="Describe any specific requirements, finishes, or custom work needed..."
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Calculate Button */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button 
                  onClick={calculateEstimate}
                  className="bg-timber-600 hover:bg-timber-700 text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate Estimate
                </Button>
                
                {estimatedCost > 0 && (
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    size="lg"
                  >
                    Reset Form
                  </Button>
                )}
              </div>

              {/* Results */}
              {estimatedCost > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Estimated Cost
                    </h3>
                    <div className="text-4xl font-bold text-green-600 mb-4">
                      ₹{estimatedCost.toLocaleString('en-IN')}
                    </div>
                    
                    {selectedWood && selectedProject && (
                      <div className="text-sm text-gray-600 space-y-1 mb-6">
                        <p><strong>Project:</strong> {selectedProject.name}</p>
                        <p><strong>Wood:</strong> {selectedWood.name}</p>
                        <p><strong>Area:</strong> {area} sq.ft × {quantity} units</p>
                        <p className="text-xs mt-2 text-gray-500">
                          *Estimate includes material, labor, and overhead costs. Final quote may vary based on actual requirements.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={handleDownloadPDF}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download PDF
                      </Button>
                      
                      <Button 
                        onClick={handleEmailEstimate}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                      >
                        <Mail className="mr-2 h-5 w-5" />
                        Email Estimate
                      </Button>
                      
                      <Button 
                        asChild
                        variant="outline"
                        size="lg"
                      >
                        <a href="/estimator">
                          Get Detailed Quote <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Your Estimate</DialogTitle>
            <DialogDescription>
              Provide your details and we'll send the estimate to your email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-name">Full Name *</Label>
              <Input
                id="email-name"
                placeholder="Enter your full name"
                value={emailData.name}
                onChange={(e) => setEmailData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-address">Email Address *</Label>
              <Input
                id="email-address"
                type="email"
                placeholder="Enter your email"
                value={emailData.email}
                onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-phone">Phone Number</Label>
              <Input
                id="email-phone"
                type="tel"
                placeholder="Enter your phone number"
                value={emailData.phone}
                onChange={(e) => setEmailData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-notes">Additional Notes</Label>
              <Textarea
                id="email-notes"
                placeholder="Any additional information..."
                value={emailData.additionalNotes}
                onChange={(e) => setEmailData(prev => ({ ...prev, additionalNotes: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={sendEmailEstimate} className="bg-green-600 hover:bg-green-700">
              <Mail className="mr-2 h-4 w-4" />
              Send Estimate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SimpleCostEstimator;
*/
/* END SIMPLE COST ESTIMATOR COMPONENT COMMENTED OUT */