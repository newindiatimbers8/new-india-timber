import { EstimatorItem, ProjectEstimate, MaterialRate } from './types';

export const materialRates: MaterialRate[] = [
  { name: 'burmaTeak', pricePerSqFt: 3500, category: 'wood' },
  { name: 'ghanaTeak', pricePerSqFt: 2800, category: 'wood' },
  { name: 'brazilianTeak', pricePerSqFt: 3200, category: 'wood' },
  { name: 'indianSal', pricePerSqFt: 1600, category: 'wood' },
  { name: 'oakWood', pricePerSqFt: 2900, category: 'wood' },
  { name: 'mapleWood', pricePerSqFt: 3100, category: 'wood' },
  { name: 'cherryWood', pricePerSqFt: 3400, category: 'wood' },
  { name: 'mahoganyWood', pricePerSqFt: 3800, category: 'wood' },
  { name: 'pineWood', pricePerSqFt: 1200, category: 'wood' },
  { name: 'cedarWood', pricePerSqFt: 2600, category: 'wood' },
  { name: 'bambooWood', pricePerSqFt: 1800, category: 'wood' },
  { name: 'centuryPlySainik', pricePerSqFt: 2200, category: 'plywood' },
  { name: 'marinePlywood', pricePerSqFt: 2600, category: 'plywood' },
  { name: 'laminatedPlywood', pricePerSqFt: 1800, category: 'plywood' },
  { name: 'waterproofPlywood', pricePerSqFt: 2400, category: 'plywood' }
];

export const styleMultipliers: { [key: string]: number } = {
  // Door styles
  'flush': 1.0,
  'paneled': 1.3,
  'french': 1.5,
  'sliding': 1.4,
  'folding': 1.6,
  'custom': 2.0,
  
  // Window styles
  'fixed': 0.8,
  'casement': 1.0,
  'bay': 1.7,
  'skylight': 1.6,
  'opening': 1.2
};

export const finishMultipliers: { [key: string]: number } = {
  'natural': 1.0,
  'stained': 1.1,
  'painted': 1.2,
  'glossy': 1.3,
  'distressed': 1.4,
  'matte': 1.1,
  'oiled': 1.15
};

export function calculateItemPrice(item: EstimatorItem): number {
  const materialRate = materialRates.find(m => m.name === item.material);
  if (!materialRate) return 0;

  // Calculate area in square feet
  let area = item.dimensions.width * item.dimensions.height;
  
  // Convert inches to feet if needed
  if (item.dimensions.unit === 'inch') {
    area = area / 144; // 144 square inches = 1 square foot
  }

  // Add depth for custom items (volume-based pricing)
  if (item.type === 'custom' && item.dimensions.depth) {
    let depth = item.dimensions.depth;
    if (item.dimensions.unit === 'inch') {
      depth = depth / 12; // Convert inches to feet
    }
    area = area * depth; // Volume for custom items
  }

  // Base price calculation
  let basePrice = area * materialRate.pricePerSqFt;

  // Apply style multiplier
  const styleMultiplier = styleMultipliers[item.style || 'flush'] || 1.0;
  basePrice *= styleMultiplier;

  // Apply finish multiplier
  const finishMultiplier = finishMultipliers[item.finish || 'natural'] || 1.0;
  basePrice *= finishMultiplier;

  // Type-specific multipliers
  if (item.type === 'door') {
    basePrice *= 1.2; // Doors need more material and work
  } else if (item.type === 'window') {
    basePrice *= 1.0; // Base window pricing
  } else if (item.type === 'custom') {
    basePrice *= 1.5; // Custom items need more craftsmanship
  }

  // Labor cost (40% of material cost)
  const laborCost = basePrice * 0.4;
  
  // Total unit price
  const unitPrice = basePrice + laborCost;
  
  return Math.round(unitPrice * item.quantity);
}

export function calculateProjectEstimate(
  projectType: string,
  areaSize: number,
  items: EstimatorItem[]
): ProjectEstimate {
  // Calculate individual item prices
  const updatedItems = items.map(item => ({
    ...item,
    unitPrice: Math.round(calculateItemPrice({ ...item, quantity: 1 })),
    totalPrice: calculateItemPrice(item)
  }));

  // Calculate category breakdown
  const breakdown: { [category: string]: number } = {
    doors: 0,
    windows: 0,
    custom: 0
  };

  const materialSummary: { [material: string]: number } = {};

  updatedItems.forEach(item => {
    breakdown[item.type === 'custom' ? 'custom' : `${item.type}s`] += item.totalPrice;
    
    // Calculate material usage
    let area = item.dimensions.width * item.dimensions.height;
    if (item.dimensions.unit === 'inch') {
      area = area / 144;
    }
    if (item.type === 'custom' && item.dimensions.depth) {
      let depth = item.dimensions.depth;
      if (item.dimensions.unit === 'inch') {
        depth = depth / 12;
      }
      area = area * depth;
    }
    
    const materialName = getMaterialDisplayName(item.material);
    materialSummary[materialName] = (materialSummary[materialName] || 0) + (area * item.quantity);
  });

  const totalCost = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Apply project type multiplier
  const projectMultiplier = projectType === 'commercial' ? 1.25 : 1.0;
  const adjustedTotalCost = Math.round(totalCost * projectMultiplier);

  // Apply bulk discount for large orders
  let finalTotal = adjustedTotalCost;
  if (adjustedTotalCost > 500000) {
    finalTotal = Math.round(adjustedTotalCost * 0.95); // 5% discount
  } else if (adjustedTotalCost > 200000) {
    finalTotal = Math.round(adjustedTotalCost * 0.97); // 3% discount
  }

  return {
    projectType,
    areaSize,
    items: updatedItems,
    totalCost: finalTotal,
    breakdown,
    materialSummary
  };
}

export function getMaterialDisplayName(materialKey: string): string {
  const displayNames: { [key: string]: string } = {
    'burmaTeak': 'Burma Teak',
    'ghanaTeak': 'Ghana Teak',
    'brazilianTeak': 'Brazilian Teak',
    'indianSal': 'Indian Sal',
    'oakWood': 'Oak Wood',
    'mapleWood': 'Maple Wood',
    'cherryWood': 'Cherry Wood',
    'mahoganyWood': 'Mahogany Wood',
    'pineWood': 'Pine Wood',
    'cedarWood': 'Cedar Wood',
    'bambooWood': 'Bamboo Wood',
    'centuryPlySainik': 'Century Ply Sainik',
    'marinePlywood': 'Marine Plywood',
    'laminatedPlywood': 'Laminated Plywood',
    'waterproofPlywood': 'Waterproof Plywood'
  };
  return displayNames[materialKey] || materialKey;
}

export function getAlternativeSuggestions(items: EstimatorItem[]): string[] {
  const suggestions: string[] = [];
  
  items.forEach(item => {
    const currentMaterial = materialRates.find(m => m.name === item.material);
    if (!currentMaterial) return;

    // Find cheaper alternatives
    const alternatives = materialRates
      .filter(m => m.category === currentMaterial.category && m.pricePerSqFt < currentMaterial.pricePerSqFt)
      .sort((a, b) => b.pricePerSqFt - a.pricePerSqFt);

    if (alternatives.length > 0) {
      const savings = Math.round((currentMaterial.pricePerSqFt - alternatives[0].pricePerSqFt) * 
        item.dimensions.width * item.dimensions.height * item.quantity);
      
      if (savings > 1000) {
        suggestions.push(
          `Save ₹${savings.toLocaleString('en-IN')} by using ${getMaterialDisplayName(alternatives[0].name)} instead of ${getMaterialDisplayName(item.material)} for ${item.name}`
        );
      }
    }
  });

  return suggestions.slice(0, 3); // Return top 3 suggestions
}