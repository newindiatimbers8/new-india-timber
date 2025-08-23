import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EstimatorItem, ItemTemplate } from './types';
import { materialRates, getMaterialDisplayName } from './PricingEngine';
import { getTemplatesByType } from './ItemTemplates';

interface ItemBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: EstimatorItem) => void;
  editItem?: EstimatorItem | null;
  itemType: 'door' | 'window' | 'custom';
}

export const ItemBuilder: React.FC<ItemBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  editItem,
  itemType
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ItemTemplate | null>(null);
  const [formData, setFormData] = useState<Partial<EstimatorItem>>({
    type: itemType,
    name: '',
    description: '',
    dimensions: { width: 3, height: 7, unit: 'ft' },
    material: 'ghanaTeak',
    style: '',
    finish: 'natural',
    quantity: 1
  });

  React.useEffect(() => {
    if (editItem) {
      setFormData(editItem);
      setSelectedTemplate(null);
    } else {
      // Reset form for new item
      setFormData({
        type: itemType,
        name: '',
        description: '',
        dimensions: { width: 3, height: 7, unit: 'ft' },
        material: 'ghanaTeak',
        style: '',
        finish: 'natural',
        quantity: 1
      });
      setSelectedTemplate(null);
    }
  }, [editItem, itemType, isOpen]);

  const templates = getTemplatesByType(itemType);

  const handleTemplateSelect = (template: ItemTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      ...formData,
      name: template.name,
      description: template.description,
      dimensions: { ...template.defaultDimensions },
      material: template.suggestedMaterials[0] || 'ghanaTeak',
      style: template.styles?.[0] || ''
    });
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('dimensions.')) {
      const dimField = field.split('.')[1];
      setFormData({
        ...formData,
        dimensions: {
          ...formData.dimensions!,
          [dimField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.material) return;

    const item: EstimatorItem = {
      id: editItem?.id || `${itemType}-${Date.now()}`,
      type: itemType,
      name: formData.name!,
      description: formData.description,
      dimensions: formData.dimensions!,
      material: formData.material!,
      style: formData.style,
      finish: formData.finish,
      quantity: formData.quantity!,
      unitPrice: 0,
      totalPrice: 0
    };

    onSave(item);
    onClose();
  };

  const getStyleOptions = () => {
    if (itemType === 'door') {
      return ['flush', 'paneled', 'french', 'sliding', 'folding', 'custom'];
    } else if (itemType === 'window') {
      return ['fixed', 'casement', 'sliding', 'bay', 'skylight', 'opening'];
    }
    return [];
  };

  const getFinishOptions = () => {
    return ['natural', 'stained', 'painted', 'glossy', 'distressed', 'matte', 'oiled'];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editItem ? 'Edit' : 'Add'} {itemType === 'custom' ? 'Custom Item' : itemType}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          {!editItem && templates.length > 0 && (
            <div>
              <Label className="text-base font-medium">Quick Templates</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTemplateSelect(template)}
                    className="text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs opacity-70">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Basic Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={`Enter ${itemType} name`}
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity || 1}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add any specific details or requirements..."
              rows={2}
            />
          </div>

          {/* Dimensions */}
          <div>
            <Label className="text-base font-medium">Dimensions</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              <div>
                <Label htmlFor="width">Width *</Label>
                <Input
                  id="width"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.dimensions?.width || 0}
                  onChange={(e) => handleInputChange('dimensions.width', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="height">Height *</Label>
                <Input
                  id="height"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.dimensions?.height || 0}
                  onChange={(e) => handleInputChange('dimensions.height', parseFloat(e.target.value) || 0)}
                />
              </div>
              {itemType === 'custom' && (
                <div>
                  <Label htmlFor="depth">Depth</Label>
                  <Input
                    id="depth"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.dimensions?.depth || 0}
                    onChange={(e) => handleInputChange('dimensions.depth', parseFloat(e.target.value) || 0)}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={formData.dimensions?.unit || 'ft'} 
                  onValueChange={(value) => handleInputChange('dimensions.unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ft">Feet</SelectItem>
                    <SelectItem value="inch">Inches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Material Selection */}
          <div>
            <Label htmlFor="material">Material *</Label>
            <Select 
              value={formData.material || ''} 
              onValueChange={(value) => handleInputChange('material', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {materialRates.map((material) => (
                  <SelectItem key={material.name} value={material.name}>
                    <div className="flex justify-between items-center w-full">
                      <span>{getMaterialDisplayName(material.name)}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ₹{material.pricePerSqFt}/sq ft
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Style and Finish */}
          <div className="grid grid-cols-2 gap-4">
            {itemType !== 'custom' && (
              <div>
                <Label htmlFor="style">Style</Label>
                <Select 
                  value={formData.style || ''} 
                  onValueChange={(value) => handleInputChange('style', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStyleOptions().map((style) => (
                      <SelectItem key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="finish">Finish</Label>
              <Select 
                value={formData.finish || 'natural'} 
                onValueChange={(value) => handleInputChange('finish', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getFinishOptions().map((finish) => (
                    <SelectItem key={finish} value={finish}>
                      {finish.charAt(0).toUpperCase() + finish.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.name || !formData.material}
            >
              {editItem ? 'Update' : 'Add'} Item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};