export interface WoodSpecifications {
  density: number; // kg/m³
  hardness: number; // Janka hardness rating
  moistureContent: number; // percentage
  grainPattern: 'straight' | 'interlocked' | 'wavy' | 'irregular';
  durability: 'class1' | 'class2' | 'class3' | 'class4' | 'class5';
  workability: 'excellent' | 'good' | 'moderate' | 'difficult';
  finishQuality: 'excellent' | 'good' | 'fair' | 'poor';
  dimensionalStability: 'high' | 'medium' | 'low';
  naturalResistance: {
    termites: boolean;
    decay: boolean;
    moisture: boolean;
    insects: boolean;
  };
}

export interface OriginInfo {
  countries: string[];
  regions: string[];
  harvestingMethod: string;
  certifications: string[];
  sustainabilityRating: number; // 1-5 scale
}

export interface PricingInfo {
  pricePerSqFt: number;
  priceRange: 'budget' | 'commercial' | 'premium' | 'luxury';
  marketTrend: 'stable' | 'increasing' | 'decreasing';
}

export interface ComparisonMetrics {
  durability: number; // 1-5 scale
  workability: number; // 1-5 scale
  appearance: number; // 1-5 scale
  costValue: number; // 1-5 scale (5 = best value)
  sustainability: number; // 1-5 scale
  availability: number; // 1-5 scale
}

export interface WoodProduct {
  id: string;
  name: string;
  scientificName?: string;
  category: 'teak' | 'plywood' | 'hardwood' | 'softwood' | 'engineered';
  grade: 'premium' | 'commercial' | 'budget';
  
  overview: {
    description: string;
    keyBenefits: string[];
    premiumPositioning: string;
    tagline: string;
  };
  
  specifications: WoodSpecifications;
  origin: OriginInfo;
  pricing: PricingInfo;
  comparisonMetrics: ComparisonMetrics;
  
  prosAndCons: {
    pros: string[];
    cons: string[];
  };
  
  buyingGuide: {
    qualityIndicators: string[];
    importantConsiderations: string[];
    expectedLifespan: string;
  };
  
  applications: {
    primary: string[];
    secondary: string[];
    notRecommended: string[];
  };
  
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// Comprehensive wood database
export const woodProducts: WoodProduct[] = [
  {
    id: 'burma-teak',
    name: 'Burma Teak',
    scientificName: 'Tectona grandis',
    category: 'teak',
    grade: 'premium',
    
    overview: {
      description: "Burma Teak represents the pinnacle of premium hardwood, renowned worldwide for its exceptional durability, stunning golden-brown grain, and natural oils that provide unmatched resistance to moisture, termites, and decay.",
      keyBenefits: [
        "Superior natural durability with Class 1 rating (25+ years)",
        "Rich, golden grain pattern with natural protective oils",
        "Excellent dimensional stability with minimal warping",
        "Natural termite and moisture resistance without treatment",
        "Premium finishing characteristics with smooth texture",
        "Investment-grade wood with appreciating value over time"
      ],
      premiumPositioning: "Burma Teak is considered the gold standard of hardwoods, preferred by luxury yacht builders, master craftsmen, and premium construction projects worldwide.",
      tagline: "The Gold Standard of Premium Hardwoods"
    },
    
    specifications: {
      density: 650,
      hardness: 1155,
      moistureContent: 10,
      grainPattern: 'straight',
      durability: 'class1',
      workability: 'excellent',
      finishQuality: 'excellent',
      dimensionalStability: 'high',
      naturalResistance: {
        termites: true,
        decay: true,
        moisture: true,
        insects: true
      }
    },
    
    origin: {
      countries: ['Myanmar (Burma)', 'Thailand', 'Laos'],
      regions: ['Irrawaddy Delta', 'Central Myanmar', 'Northern Thailand'],
      harvestingMethod: 'Selective logging from old-growth forests',
      certifications: ['CITES', 'FSC (Limited)', 'Myanmar Forest Department'],
      sustainabilityRating: 3
    },
    
    pricing: {
      pricePerSqFt: 3500,
      priceRange: 'luxury',
      marketTrend: 'increasing'
    },
    
    comparisonMetrics: {
      durability: 5,
      workability: 5,
      appearance: 5,
      costValue: 3,
      sustainability: 3,
      availability: 2
    },
    
    prosAndCons: {
      pros: [
        "Exceptional longevity - Can last 100+ years with proper care",
        "Natural weather resistance without chemical treatment",
        "Beautiful grain that develops richer patina with age",
        "High resale and investment value",
        "Low maintenance requirements",
        "Excellent workability for complex designs"
      ],
      cons: [
        "Higher initial investment compared to alternatives",
        "Limited availability due to CITES restrictions",
        "Requires proper sourcing verification for legality",
        "Natural oils may require specific finishing techniques"
      ]
    },
    
    buyingGuide: {
      qualityIndicators: [
        "Rich, oily surface texture that feels smooth",
        "Consistent golden-brown color with minimal sapwood",
        "Minimal knots and natural defects",
        "Strong, pleasant teak aroma",
        "CITES documentation for legal sourcing"
      ],
      importantConsiderations: [
        "Always verify CITES certification for legal sourcing",
        "Check for proper kiln drying documentation",
        "Ensure grade matches intended application",
        "Factor in natural oil content for finishing",
        "Consider long-term investment value vs. immediate needs"
      ],
      expectedLifespan: "50-100+ years with proper care and maintenance"
    },
    
    applications: {
      primary: [
        "Luxury yacht decking and interiors",
        "High-end furniture and cabinetry",
        "Premium door and window frames",
        "Heritage building restoration"
      ],
      secondary: [
        "Decorative wall paneling",
        "Custom millwork and trim",
        "Garden furniture"
      ],
      notRecommended: [
        "Budget construction projects",
        "High-traffic commercial flooring"
      ]
    },
    
    seo: {
      metaTitle: "Burma Teak - Premium Hardwood | New India Timber",
      metaDescription: "Discover Burma Teak, the gold standard of premium hardwoods. Exceptional durability, natural beauty, and luxury appeal for high-end projects.",
      keywords: ["burma teak", "myanmar teak", "premium hardwood", "luxury wood", "teak furniture", "marine teak"]
    }
  },
  
  {
    id: 'red-sal',
    name: 'Red Sal',
    scientificName: 'Shorea robusta',
    category: 'hardwood',
    grade: 'commercial',
    
    overview: {
      description: "Red Sal is a versatile and robust hardwood native to the Indian subcontinent, prized for its excellent strength-to-weight ratio, natural durability, and cost-effectiveness.",
      keyBenefits: [
        "Excellent strength and load-bearing capacity",
        "Natural resistance to termites and decay",
        "Good dimensional stability with proper seasoning",
        "Cost-effective alternative to premium hardwoods",
        "Readily available from sustainable Indian forests"
      ],
      premiumPositioning: "Red Sal represents the perfect balance of quality and value, offering reliable performance for professional applications without the premium price tag.",
      tagline: "Strength, Reliability, and Value Combined"
    },
    
    specifications: {
      density: 800,
      hardness: 1350,
      moistureContent: 12,
      grainPattern: 'straight',
      durability: 'class2',
      workability: 'good',
      finishQuality: 'good',
      dimensionalStability: 'medium',
      naturalResistance: {
        termites: true,
        decay: true,
        moisture: false,
        insects: true
      }
    },
    
    origin: {
      countries: ['India', 'Nepal', 'Bangladesh'],
      regions: ['Central India', 'Eastern Ghats', 'Himalayan foothills'],
      harvestingMethod: 'Sustainable forest management and plantation forestry',
      certifications: ['Indian Forest Service', 'FSC India', 'PEFC'],
      sustainabilityRating: 4
    },
    
    pricing: {
      pricePerSqFt: 1600,
      priceRange: 'commercial',
      marketTrend: 'stable'
    },
    
    comparisonMetrics: {
      durability: 4,
      workability: 4,
      appearance: 3,
      costValue: 5,
      sustainability: 4,
      availability: 5
    },
    
    prosAndCons: {
      pros: [
        "Excellent strength-to-weight ratio for structural applications",
        "Cost-effective solution for commercial projects",
        "Good natural durability with proper treatment",
        "Readily available from sustainable Indian sources",
        "Well-suited to Indian climate conditions"
      ],
      cons: [
        "Requires proper seasoning to prevent warping",
        "May need treatment for high-moisture applications",
        "Grain pattern less decorative than premium woods",
        "Can be prone to checking if not properly dried"
      ]
    },
    
    buyingGuide: {
      qualityIndicators: [
        "Uniform reddish-brown color throughout",
        "Straight grain with minimal knots",
        "Proper moisture content (10-14%)",
        "No signs of insect damage or decay",
        "Clean, square-cut edges"
      ],
      importantConsiderations: [
        "Verify proper kiln drying or air seasoning",
        "Check moisture content with a reliable meter",
        "Inspect for signs of fungal staining",
        "Ensure timber is from legal, sustainable sources"
      ],
      expectedLifespan: "20-40 years with proper treatment and maintenance"
    },
    
    applications: {
      primary: [
        "Structural framing and beams",
        "Door and window frames",
        "Commercial furniture",
        "Flooring (residential and light commercial)"
      ],
      secondary: [
        "Plywood core material",
        "Packaging and crates",
        "Tool handles and implements"
      ],
      notRecommended: [
        "Marine applications without treatment",
        "High-moisture environments"
      ]
    },
    
    seo: {
      metaTitle: "Red Sal Wood - Reliable Commercial Hardwood | New India Timber",
      metaDescription: "Red Sal offers excellent strength and value for construction and furniture projects. Sustainable Indian hardwood with natural durability.",
      keywords: ["red sal wood", "shorea robusta", "indian hardwood", "construction timber", "commercial wood"]
    }
  }
];

// Helper functions
export const getWoodProduct = (id: string): WoodProduct | undefined => {
  return woodProducts.find(product => product.id === id);
};

export const getWoodsByCategory = (category: string): WoodProduct[] => {
  return woodProducts.filter(product => product.category === category);
};

export const getComparisonData = (woodIds: string[]): WoodProduct[] => {
  return woodProducts.filter(product => woodIds.includes(product.id));
};