import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Download, 
  Save, 
  Calculator, 
  Lightbulb, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Package, 
  Home as HomeIcon,
  Zap,
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react';
import { EstimatorItem, ProjectEstimate } from './types';
import { ItemBuilder } from './ItemBuilder';
import { ItemCard } from './ItemCard';
import { calculateProjectEstimate, getAlternativeSuggestions, getMaterialDisplayName } from './PricingEngine';
import { doorTemplates, windowTemplates, customTemplates } from './ItemTemplates';
import { generateDetailedEstimatePDF, generateQuoteNumber } from '@/utils/pdfUtils';

const DetailedPriceEstimator = () => {
  const { toast } = useToast();
  
  // Project basics
  const [projectType, setProjectType] = useState<'residential' | 'commercial'>('residential');
  const [areaSize, setAreaSize] = useState<number>(1000);
  
  // Items management
  const [items, setItems] = useState<EstimatorItem[]>([]);
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  
  // UI state
  const [itemBuilderOpen, setItemBuilderOpen] = useState(false);
  const [currentItemType, setCurrentItemType] = useState<'door' | 'window' | 'custom'>('door');
  const [editingItem, setEditingItem] = useState<EstimatorItem | null>(null);
  const [currentStep, setCurrentStep] = useState<'basics' | 'items' | 'results'>('basics');
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);

  // Auto-calculate when items or project details change
  useEffect(() => {
    if (items.length > 0) {
      const newEstimate = calculateProjectEstimate(projectType, areaSize, items);
      setEstimate(newEstimate);
    } else {
      setEstimate(null);
    }
  }, [items, projectType, areaSize]);

  // Quick start suggestions based on project type and area
  const getQuickStartSuggestions = () => {
    if (areaSize <= 600) { // Studio/1BHK
      return {
        doors: 3,
        windows: 4,
        suggestions: ['bedroom-door', 'main-door', 'bathroom-door']
      };
    } else if (areaSize <= 1000) { // 2BHK
      return {
        doors: 5,
        windows: 6,
        suggestions: ['bedroom-door', 'main-door', 'bathroom-door', 'balcony-door']
      };
    } else { // 3BHK+
      return {
        doors: 7,
        windows: 8,
        suggestions: ['bedroom-door', 'main-door', 'bathroom-door', 'balcony-door']
      };
    }
  };

  const addQuickItems = () => {
    const suggestions = getQuickStartSuggestions();
    const newItems: EstimatorItem[] = [];

    // Add suggested doors
    suggestions.suggestions.forEach((templateId, index) => {
      const template = doorTemplates.find(t => t.id === templateId);
      if (template) {
        newItems.push({
          id: `door-${Date.now()}-${index}`,
          type: 'door',
          name: template.name,
          description: template.description,
          dimensions: { ...template.defaultDimensions },
          material: template.suggestedMaterials[0],
          style: template.styles?.[0],
          finish: 'natural',
          quantity: templateId === 'bedroom-door' ? Math.max(1, suggestions.doors - 3) : 1,
          unitPrice: 0,
          totalPrice: 0
        });
      }
    });

    // Add suggested windows
    ['bedroom-window', 'living-room-window'].forEach((templateId, index) => {
      const template = windowTemplates.find(t => t.id === templateId);
      if (template) {
        newItems.push({
          id: `window-${Date.now()}-${index}`,
          type: 'window',
          name: template.name,
          description: template.description,
          dimensions: { ...template.defaultDimensions },
          material: template.suggestedMaterials[0],
          style: template.styles?.[0],
          finish: 'natural',
          quantity: index === 0 ? Math.max(2, suggestions.windows - 2) : 2,
          unitPrice: 0,
          totalPrice: 0
        });
      }
    });

    setItems(newItems);
    setCurrentStep('items');
  };

  const openItemBuilder = (type: 'door' | 'window' | 'custom', editItem?: EstimatorItem) => {
    setCurrentItemType(type);
    setEditingItem(editItem || null);
    setItemBuilderOpen(true);
  };

  const handleSaveItem = (item: EstimatorItem) => {
    if (editingItem) {
      // Update existing item
      setItems(prev => prev.map(i => i.id === item.id ? item : i));
      toast({
        title: "Item Updated",
        description: `${item.name} has been updated successfully.`
      });
    } else {
      // Add new item
      setItems(prev => [...prev, item]);
      toast({
        title: "Item Added",
        description: `${item.name} has been added to your estimate.`
      });
    }
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your estimate."
    });
  };

  const handleDuplicateItem = (item: EstimatorItem) => {
    const duplicatedItem: EstimatorItem = {
      ...item,
      id: `${item.type}-${Date.now()}`,
      name: `${item.name} (Copy)`
    };
    setItems(prev => [...prev, duplicatedItem]);
    toast({
      title: "Item Duplicated",
      description: `${item.name} has been copied successfully.`
    });
  };

  const generateQuote = async () => {
    if (!estimate) return;

    setIsGeneratingQuote(true);
    try {
      const quoteNumber = generateQuoteNumber();
      const quoteData = {
        quoteNumber,
        customerName: 'Customer',
        projectType: estimate.projectType,
        areaSize: estimate.areaSize,
        items: estimate.items,
        breakdown: estimate.breakdown,
        totalCost: estimate.totalCost,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      };

      await generateDetailedEstimatePDF(quoteData);
      
      toast({
        title: "Quote Generated Successfully!",
        description: "Your detailed quote has been downloaded. Check your Downloads folder."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const getItemsByType = (type: 'door' | 'window' | 'custom') => {
    return items.filter(item => item.type === type);
  };

  const suggestions = estimate ? getAlternativeSuggestions(estimate.items) : [];

  // Validation helpers
  const canProceedToItems = () => {
    return areaSize >= 100 && projectType;
  };

  const canProceedToResults = () => {
    return items.length > 0 && estimate;
  };

  // Step navigation with validation
  const goToStep = (step: 'basics' | 'items' | 'results') => {
    if (step === 'items' && !canProceedToItems()) {
      toast({
        title: "Incomplete Information",
        description: "Please complete project details with area size ≥ 100 sq ft.",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 'results' && !canProceedToResults()) {
      toast({
        title: "No Items Added",
        description: "Please add at least one item to view results.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep(step);
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated Background with Multiple Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-timber-900 to-forest-800">
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-forest-600/20 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(255,255,255,0.1),transparent)] animate-pulse">
          </div>
        </div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-timber-400/10 rounded-full blur-xl animate-float [animation-delay:2s]">
        </div>
        <div className="absolute bottom-40 right-20 w-28 h-28 bg-forest-300/10 rounded-full blur-lg animate-float [animation-delay:5s]">
        </div>
        <div className="absolute top-60 right-10 w-36 h-36 bg-timber-500/10 rounded-full blur-2xl animate-float [animation-delay:1s]">
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Enhanced Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="animate-fade-in [animation-delay:0.2s]">
              <div className="flex items-center justify-center mb-4 md:mb-6">
                <div className="p-4 md:p-5 glassmorphism-dark rounded-2xl">
                  <Calculator className="h-8 w-8 md:h-10 md:w-10 text-timber-200" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Price Estimator
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Get accurate, instant pricing for your timber project 
                <br className="hidden md:block" />
                with our advanced estimation tool.
              </p>
            </div>
          </div>
          
          {/* Real-time Cost Preview - Mobile Sticky */}
          {estimate && (
            <div className="md:hidden sticky top-0 z-30 glassmorphism border-white/20 py-3 px-4 mb-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-white/60">Total Estimate</p>
                  <p className="text-lg font-bold text-timber-200">
                    ₹{estimate.totalCost.toLocaleString('en-IN')}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs bg-timber-500/30 text-white border-white/20">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          )}

      {/* Enhanced Progress Indicator */}
      <div className="mb-6 md:mb-8">
        <div className="flex justify-center">
          <div className="flex items-center w-full max-w-md">
            {[
              { key: 'basics', label: 'Project Details', icon: HomeIcon },
              { key: 'items', label: 'Add Items', icon: Package },
              { key: 'results', label: 'Results', icon: Check }
            ].map((step, index) => {
              const isActive = currentStep === step.key;
              const isCompleted = ['basics', 'items', 'results'].indexOf(currentStep) > index;
              const Icon = step.icon;
              
              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-timber-600 text-white shadow-lg' 
                        : isCompleted
                          ? 'bg-timber-100 text-timber-600'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : <Icon className="h-4 w-4 md:h-5 md:w-5" />}
                    </div>
                    <span className={`mt-2 text-xs md:text-sm text-center ${
                      isActive ? 'text-timber-600 font-medium' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className={`flex-1 h-0.5 mt-2 mx-2 md:mx-4 ${
                      isCompleted ? 'bg-timber-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step 1: Project Basics - Enhanced */}
      {currentStep === 'basics' && (
        <div className="animate-fade-in [animation-delay:0.4s]">
          <Card className="glassmorphism border-white/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2 text-white">
                <HomeIcon className="h-5 w-5 text-timber-200" />
                Project Details
              </CardTitle>
              <p className="text-sm text-white/70 mt-1">
                Tell us about your project to get started
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mobile-first form layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectType" className="text-sm font-medium text-white/80">
                    Project Type
                  </Label>
                  <Select 
                    value={projectType} 
                    onValueChange={(value: 'residential' | 'commercial') => setProjectType(value)}
                  >
                    <SelectTrigger className="h-11 glassmorphism-dark border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">
                        <div className="flex flex-col items-start">
                          <span>Residential</span>
                          <span className="text-xs text-gray-500">Homes, apartments</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="commercial">
                        <div className="flex flex-col items-start">
                          <span>Commercial</span>
                          <span className="text-xs text-gray-500">Offices, shops</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="areaSize" className="text-sm font-medium text-white/80">
                    Total Area (sq ft)
                  </Label>
                  <Input
                    id="areaSize"
                    type="number"
                    value={areaSize}
                    onChange={(e) => setAreaSize(parseInt(e.target.value) || 0)}
                    min="100"
                    step="50"
                    placeholder="e.g. 1000"
                    className="h-11 text-base glassmorphism-dark border-white/30 text-white placeholder-white/50"
                  />
                </div>
              </div>

              {/* Smart Suggestions */}
              {areaSize >= 100 && (
                <div className="glassmorphism-dark border border-white/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-timber-200 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-white mb-1">Smart Recommendation</h4>
                      <p className="text-sm text-white/70 mb-3">
                        For your {areaSize} sq ft {projectType} project, we suggest:
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-timber-200" />
                          <span className="text-white/80"><strong>{getQuickStartSuggestions().doors}</strong> doors</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-timber-200" />
                          <span className="text-white/80"><strong>{getQuickStartSuggestions().windows}</strong> windows</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={addQuickItems}
                  className="flex-1 sm:flex-none h-11 bg-timber-600 hover:bg-timber-700 transition-all duration-300 transform hover:scale-105"
                  disabled={areaSize < 100}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Quick Start
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => goToStep('items')}
                  className="flex-1 sm:flex-none h-11 glassmorphism-dark border-white/30 text-white hover:bg-white/20 transition-all duration-300"
                  disabled={!canProceedToItems()}
                >
                  Custom Setup
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Items Management - Enhanced */}
      {currentStep === 'items' && (
        <div className="space-y-4 md:space-y-6">
          {/* Add Items Section */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Package className="h-5 w-5 text-timber-600" />
                    Build Your Project
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Add doors, windows, and custom items
                  </p>
                </div>
                {items.length > 0 && (
                  <Badge variant="secondary" className="hidden md:flex">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Mobile-first button grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button 
                  onClick={() => openItemBuilder('door')}
                  variant="outline"
                  className="h-16 md:h-12 flex flex-col md:flex-row items-center justify-center gap-2 border-2 hover:border-timber-600 hover:bg-timber-50"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-center md:text-left">
                    <span className="font-medium">Add Door</span>
                    <p className="text-xs text-gray-500 hidden md:block">Interior & exterior</p>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => openItemBuilder('window')}
                  variant="outline"
                  className="h-16 md:h-12 flex flex-col md:flex-row items-center justify-center gap-2 border-2 hover:border-timber-600 hover:bg-timber-50"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-center md:text-left">
                    <span className="font-medium">Add Window</span>
                    <p className="text-xs text-gray-500 hidden md:block">All types & sizes</p>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => openItemBuilder('custom')}
                  variant="outline"
                  className="h-16 md:h-12 flex flex-col md:flex-row items-center justify-center gap-2 border-2 hover:border-timber-600 hover:bg-timber-50"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-center md:text-left">
                    <span className="font-medium">Custom Item</span>
                    <p className="text-xs text-gray-500 hidden md:block">Furniture & more</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Items Display with Empty State */}
          {items.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items added yet</h3>
                  <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                    Start building your project by adding doors, windows, or custom items above.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={() => openItemBuilder('door')}
                      className="bg-timber-600 hover:bg-timber-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Item
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={addQuickItems}
                      disabled={areaSize < 100}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Use Quick Start
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              {/* Mobile-optimized tabs */}
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                <TabsTrigger value="all" className="text-xs md:text-sm py-2">
                  <span className="hidden sm:inline">All Items </span>
                  <span className="sm:hidden">All </span>
                  ({items.length})
                </TabsTrigger>
                <TabsTrigger value="doors" className="text-xs md:text-sm py-2">
                  <span className="hidden sm:inline">Doors </span>
                  <span className="sm:hidden">Doors </span>
                  ({getItemsByType('door').length})
                </TabsTrigger>
                <TabsTrigger value="windows" className="text-xs md:text-sm py-2">
                  <span className="hidden sm:inline">Windows </span>
                  <span className="sm:hidden">Win </span>
                  ({getItemsByType('window').length})
                </TabsTrigger>
                <TabsTrigger value="custom" className="text-xs md:text-sm py-2">
                  <span className="hidden sm:inline">Custom </span>
                  <span className="sm:hidden">Custom </span>
                  ({getItemsByType('custom').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4 md:mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                  {items.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onEdit={() => openItemBuilder(item.type, item)}
                      onDelete={handleDeleteItem}
                      onDuplicate={handleDuplicateItem}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="doors" className="mt-4 md:mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                  {getItemsByType('door').map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onEdit={() => openItemBuilder(item.type, item)}
                      onDelete={handleDeleteItem}
                      onDuplicate={handleDuplicateItem}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="windows" className="mt-4 md:mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                  {getItemsByType('window').map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onEdit={() => openItemBuilder(item.type, item)}
                      onDelete={handleDeleteItem}
                      onDuplicate={handleDuplicateItem}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="mt-4 md:mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                  {getItemsByType('custom').map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onEdit={() => openItemBuilder(item.type, item)}
                      onDelete={handleDeleteItem}
                      onDuplicate={handleDuplicateItem}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Enhanced Navigation */}
          <div className="border-t pt-4 mt-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => goToStep('basics')}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Button>
              
              {items.length > 0 ? (
                <Button 
                  onClick={() => goToStep('results')}
                  className="order-1 sm:order-2 bg-timber-600 hover:bg-timber-700"
                  disabled={!canProceedToResults()}
                >
                  View Estimate
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <div className="order-1 sm:order-2 flex items-center gap-2 text-sm text-gray-500">
                  <AlertCircle className="h-4 w-4" />
                  Add at least one item to continue
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Results - Enhanced Mobile-First */}
      {currentStep === 'results' && estimate && (
        <div className="space-y-4 md:space-y-6">
          {/* Hero Summary Card */}
          <Card className="bg-gradient-to-br from-timber-50 to-timber-100 border-timber-200">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-white rounded-full shadow-lg">
                    <Check className="h-8 w-8 text-timber-600" />
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Your Estimate is Ready!
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  {projectType.charAt(0).toUpperCase() + projectType.slice(1)} project for {areaSize} sq ft
                </p>
              </div>

              {/* Total Cost Highlight */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-timber-200 mb-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-timber-600 mb-2">
                    ₹{estimate.totalCost.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 mb-1">Total Estimated Cost</div>
                  <div className="text-xs text-gray-500">
                    Includes materials, labor, and finishing
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl md:text-2xl font-bold text-timber-600">
                    {estimate.items.length}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mt-1">Total Items</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl md:text-2xl font-bold text-blue-600">
                    {getItemsByType('door').length}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mt-1">Doors</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl md:text-2xl font-bold text-green-600">
                    {getItemsByType('window').length}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mt-1">Windows</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl md:text-2xl font-bold text-purple-600">
                    {getItemsByType('custom').length}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mt-1">Custom</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Breakdown Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-timber-600" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(estimate.breakdown).map(([category, amount]) => (
                    amount > 0 && (
                      <div key={category} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-timber-600"></div>
                          <span className="capitalize text-sm md:text-base">{category}</span>
                        </div>
                        <span className="font-semibold text-sm md:text-base">
                          ₹{amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )
                  ))}
                  <div className="pt-2 mt-3 border-t-2 border-timber-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-timber-800">Total</span>
                      <span className="font-bold text-lg text-timber-600">
                        ₹{estimate.totalCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Material Summary */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-timber-600" />
                  Material Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(estimate.materialSummary).map(([material, amount]) => (
                    <div key={material} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm md:text-base">{getMaterialDisplayName(material)}</span>
                      <span className="font-medium text-sm md:text-base">
                        {amount.toFixed(1)} sq ft
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Suggestions */}
          {suggestions.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  Cost Optimization Tips
                </CardTitle>
                <p className="text-sm text-amber-700 mt-1">
                  Consider these suggestions to optimize your project cost
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-amber-200 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-amber-100 rounded-full mt-0.5">
                          <Lightbulb className="h-3 w-3 text-amber-600" />
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700">{suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Action Buttons */}
          <div className="border-t pt-6 mt-8">
            <div className="flex flex-col gap-4">
              {/* Primary Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  onClick={generateQuote}
                  className="h-12 bg-timber-600 hover:bg-timber-700 text-white font-semibold"
                  disabled={isGeneratingQuote}
                >
                  {isGeneratingQuote ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Detailed Quote
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={generateQuote}
                  className="h-12 border-2 border-timber-600 text-timber-600 hover:bg-timber-50 font-semibold"
                  disabled={isGeneratingQuote}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Request Formal Quote
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep('items')}
                  className="flex-1 h-10 text-gray-600 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Modify Items
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep('basics')}
                  className="flex-1 h-10 text-gray-600 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Change Project Details
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setItems([]);
                    goToStep('basics');
                  }}
                  className="flex-1 h-10 text-gray-600 hover:bg-gray-100"
                >
                  Start Over
                </Button>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Need help or have questions about your estimate?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm">
                    <div className="flex items-center gap-1 text-timber-600">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">+91 8095701235</span>
                    </div>
                    <span className="hidden sm:inline text-gray-400">|</span>
                    <div className="flex items-center gap-1 text-timber-600">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">contact@newindiatimber.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Builder Dialog */}
      <ItemBuilder
        isOpen={itemBuilderOpen}
        onClose={() => setItemBuilderOpen(false)}
        onSave={handleSaveItem}
        editItem={editingItem}
        itemType={currentItemType}
      />
        </div>
      </div>
    </section>
  );
};

export default DetailedPriceEstimator;