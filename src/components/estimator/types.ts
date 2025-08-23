export interface EstimatorItem {
  id: string;
  type: 'door' | 'window' | 'custom';
  name: string;
  description?: string;
  dimensions: { 
    width: number; 
    height: number; 
    depth?: number;
    unit: 'ft' | 'inch';
  };
  material: string;
  style?: string;
  finish?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ProjectEstimate {
  projectType: string;
  areaSize: number;
  items: EstimatorItem[];
  totalCost: number;
  breakdown: { [category: string]: number };
  materialSummary: { [material: string]: number };
}

export interface MaterialRate {
  name: string;
  pricePerSqFt: number;
  category: 'wood' | 'plywood' | 'engineered';
}

export interface ItemTemplate {
  id: string;
  name: string;
  type: 'door' | 'window' | 'custom';
  description: string;
  defaultDimensions: {
    width: number;
    height: number;
    depth?: number;
    unit: 'ft' | 'inch';
  };
  suggestedMaterials: string[];
  styles?: string[];
  priceMultiplier: number;
}