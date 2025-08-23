import { ItemTemplate } from './types';

export const doorTemplates: ItemTemplate[] = [
  {
    id: 'bedroom-door',
    name: 'Bedroom Door',
    type: 'door',
    description: 'Standard interior bedroom door',
    defaultDimensions: { width: 3, height: 7, unit: 'ft' },
    suggestedMaterials: ['ghanaTeak', 'oakWood', 'marinePlywood'],
    styles: ['flush', 'paneled'],
    priceMultiplier: 1.0
  },
  {
    id: 'main-door',
    name: 'Main Entrance Door',
    type: 'door',
    description: 'Heavy duty main entrance door',
    defaultDimensions: { width: 3.5, height: 7.5, unit: 'ft' },
    suggestedMaterials: ['burmaTeak', 'mahoganyWood', 'brazilianTeak'],
    styles: ['paneled', 'custom'],
    priceMultiplier: 1.8
  },
  {
    id: 'bathroom-door',
    name: 'Bathroom Door',
    type: 'door',
    description: 'Moisture resistant bathroom door',
    defaultDimensions: { width: 2.5, height: 7, unit: 'ft' },
    suggestedMaterials: ['waterproofPlywood', 'marinePlywood', 'cedarWood'],
    styles: ['flush', 'paneled'],
    priceMultiplier: 1.2
  },
  {
    id: 'balcony-door',
    name: 'Balcony Door',
    type: 'door',
    description: 'Glass panel balcony door',
    defaultDimensions: { width: 6, height: 7, unit: 'ft' },
    suggestedMaterials: ['ghanaTeak', 'oakWood', 'cedarWood'],
    styles: ['french', 'sliding'],
    priceMultiplier: 1.5
  }
];

export const windowTemplates: ItemTemplate[] = [
  {
    id: 'bedroom-window',
    name: 'Bedroom Window',
    type: 'window',
    description: 'Standard casement window',
    defaultDimensions: { width: 3, height: 4, unit: 'ft' },
    suggestedMaterials: ['ghanaTeak', 'oakWood', 'marinePlywood'],
    styles: ['casement', 'sliding'],
    priceMultiplier: 1.0
  },
  {
    id: 'living-room-window',
    name: 'Living Room Window',
    type: 'window',
    description: 'Large living room window',
    defaultDimensions: { width: 5, height: 4, unit: 'ft' },
    suggestedMaterials: ['burmaTeak', 'ghanaTeak', 'oakWood'],
    styles: ['casement', 'bay'],
    priceMultiplier: 1.3
  },
  {
    id: 'kitchen-window',
    name: 'Kitchen Window',
    type: 'window',
    description: 'Moisture resistant kitchen window',
    defaultDimensions: { width: 2.5, height: 3, unit: 'ft' },
    suggestedMaterials: ['waterproofPlywood', 'cedarWood', 'marinePlywood'],
    styles: ['casement', 'sliding'],
    priceMultiplier: 1.1
  },
  {
    id: 'skylight',
    name: 'Skylight',
    type: 'window',
    description: 'Roof mounted skylight',
    defaultDimensions: { width: 2, height: 3, unit: 'ft' },
    suggestedMaterials: ['waterproofPlywood', 'cedarWood'],
    styles: ['fixed', 'opening'],
    priceMultiplier: 1.8
  }
];

export const customTemplates: ItemTemplate[] = [
  {
    id: 'kitchen-cabinet',
    name: 'Kitchen Cabinet',
    type: 'custom',
    description: 'Modular kitchen cabinet unit',
    defaultDimensions: { width: 2, height: 3, depth: 1.5, unit: 'ft' },
    suggestedMaterials: ['marinePlywood', 'waterproofPlywood', 'centuryPlySainik'],
    priceMultiplier: 2.0
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    type: 'custom',
    description: 'Built-in bedroom wardrobe',
    defaultDimensions: { width: 6, height: 8, depth: 2, unit: 'ft' },
    suggestedMaterials: ['ghanaTeak', 'marinePlywood', 'laminatedPlywood'],
    priceMultiplier: 2.2
  },
  {
    id: 'tv-unit',
    name: 'TV Unit',
    type: 'custom',
    description: 'Wall mounted TV cabinet',
    defaultDimensions: { width: 5, height: 2, depth: 1, unit: 'ft' },
    suggestedMaterials: ['ghanaTeak', 'oakWood', 'marinePlywood'],
    priceMultiplier: 1.8
  },
  {
    id: 'dining-table',
    name: 'Dining Table',
    type: 'custom',
    description: '6-seater dining table',
    defaultDimensions: { width: 6, height: 2.5, depth: 3, unit: 'ft' },
    suggestedMaterials: ['burmaTeak', 'mahoganyWood', 'oakWood'],
    priceMultiplier: 3.0
  },
  {
    id: 'staircase',
    name: 'Staircase',
    type: 'custom',
    description: 'Wooden staircase with railing',
    defaultDimensions: { width: 3, height: 10, depth: 12, unit: 'ft' },
    suggestedMaterials: ['burmaTeak', 'ghanaTeak', 'oakWood'],
    priceMultiplier: 4.0
  },
  {
    id: 'wooden-flooring',
    name: 'Wooden Flooring',
    type: 'custom',
    description: 'Per sq ft wooden flooring',
    defaultDimensions: { width: 1, height: 1, unit: 'ft' },
    suggestedMaterials: ['burmaTeak', 'oakWood', 'mapleWood'],
    priceMultiplier: 1.5
  }
];

export const getAllTemplates = (): ItemTemplate[] => [
  ...doorTemplates,
  ...windowTemplates,
  ...customTemplates
];

export const getTemplatesByType = (type: 'door' | 'window' | 'custom'): ItemTemplate[] => {
  switch (type) {
    case 'door':
      return doorTemplates;
    case 'window':
      return windowTemplates;
    case 'custom':
      return customTemplates;
    default:
      return [];
  }
};