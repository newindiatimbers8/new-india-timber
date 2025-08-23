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
import { Plus, Download, Save, Calculator, Lightbulb } from 'lucide-react';
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
        title: "Quote Generated",
        description: "Your detailed quote has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getItemsByType = (type: 'door' | 'window' | 'custom') => {
    return items.filter(item => item.type === type);
  };

  const suggestions = estimate ? getAlternativeSuggestions(estimate.items) : [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Detailed Price Estimator
        </h2>
        <p className="text-muted-foreground">
          Get accurate pricing for doors, windows, and custom woodwork
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {['basics', 'items', 'results'].map((step, index) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep === step 
                  ? 'bg-primary text-primary-foreground' 
                  : index < ['basics', 'items', 'results'].indexOf(currentStep)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              {index < 2 && (
                <div className={`w-12 h-0.5 ${
                  index < ['basics', 'items', 'results'].indexOf(currentStep)
                    ? 'bg-primary'
                    : 'bg-muted'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Project Basics */}
      {currentStep === 'basics' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Project Basics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="projectType">Project Type</Label>
                <Select 
                  value={projectType} 
                  onValueChange={(value: 'residential' | 'commercial') => setProjectType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="areaSize">Total Area (sq ft)</Label>
                <Input
                  id="areaSize"
                  type="number"
                  value={areaSize}
                  onChange={(e) => setAreaSize(parseInt(e.target.value) || 0)}
                  min="100"
                  step="50"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-muted-foreground">
                Based on your {areaSize} sq ft {projectType} project, we suggest starting with{' '}
                <strong>{getQuickStartSuggestions().doors} doors</strong> and{' '}
                <strong>{getQuickStartSuggestions().windows} windows</strong>
              </div>
              <div className="flex gap-2">
                <Button onClick={addQuickItems}>
                  Quick Start
                </Button>
                <Button variant="outline" onClick={() => setCurrentStep('items')}>
                  Custom Setup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Items Management */}
      {currentStep === 'items' && (
        <div className="space-y-6">
          {/* Add Items Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Add Items to Your Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button onClick={() => openItemBuilder('door')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Door
                </Button>
                <Button onClick={() => openItemBuilder('window')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Window
                </Button>
                <Button onClick={() => openItemBuilder('custom')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Items Display */}
          {items.length > 0 && (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  All Items ({items.length})
                </TabsTrigger>
                <TabsTrigger value="doors">
                  Doors ({getItemsByType('door').length})
                </TabsTrigger>
                <TabsTrigger value="windows">
                  Windows ({getItemsByType('window').length})
                </TabsTrigger>
                <TabsTrigger value="custom">
                  Custom ({getItemsByType('custom').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

              <TabsContent value="doors" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

              <TabsContent value="windows" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

              <TabsContent value="custom" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStep('basics')}>
              Back to Basics
            </Button>
            <Button 
              onClick={() => setCurrentStep('results')}
              disabled={items.length === 0}
            >
              View Estimate
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {currentStep === 'results' && estimate && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Project Estimate Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {estimate.items.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {getItemsByType('door').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Doors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {getItemsByType('window').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Windows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {getItemsByType('custom').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Custom Items</div>
                </div>
              </div>

              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">
                  ₹{estimate.totalCost.toLocaleString('en-IN')}
                </div>
                <div className="text-muted-foreground">Total Estimated Cost</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Includes materials, labor, and finishing
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(estimate.breakdown).map(([category, amount]) => (
                    amount > 0 && (
                      <div key={category} className="flex justify-between items-center">
                        <span className="capitalize">{category}</span>
                        <span className="font-medium">
                          ₹{amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Material Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Material Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(estimate.materialSummary).map(([material, amount]) => (
                    <div key={material} className="flex justify-between items-center">
                      <span>{material}</span>
                      <span className="font-medium">
                        {amount.toFixed(1)} sq ft
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Cost Optimization Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('items')}>
              Modify Items
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={generateQuote}>
                <Download className="h-4 w-4 mr-2" />
                Download Quote
              </Button>
              <Button onClick={generateQuote}>
                <Save className="h-4 w-4 mr-2" />
                Request Formal Quote
              </Button>
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
  );
};

export default DetailedPriceEstimator;