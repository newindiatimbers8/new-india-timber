import { Client, Databases, ID } from 'appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Appwrite configuration
const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id');

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'timbercraft-db';
const PRODUCTS_COLLECTION_ID = 'products';

// Sample products to populate
const sampleProducts = [
  {
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
      dimensionalStability: 'high'
    },
    pricing: {
      pricePerSqFt: 3500,
      priceRange: 'luxury',
      marketTrend: 'increasing'
    }
  },
  {
    name: 'Ghana Teak',
    scientificName: 'Tectona grandis',
    category: 'teak',
    grade: 'commercial',
    overview: {
      description: "Ghana Teak offers excellent quality at a more accessible price point, maintaining the essential characteristics of teak wood while being more readily available.",
      keyBenefits: [
        "Good natural durability and weather resistance",
        "Attractive golden-brown color with straight grain",
        "Moderate pricing for commercial applications",
        "Good workability for furniture and construction",
        "Sustainable sourcing from managed plantations"
      ],
      premiumPositioning: "Ghana Teak provides the perfect balance of quality and value for commercial and residential projects.",
      tagline: "Quality Teak at Commercial Pricing"
    },
    specifications: {
      density: 600,
      hardness: 1000,
      moistureContent: 12,
      grainPattern: 'straight',
      durability: 'class2',
      workability: 'good',
      finishQuality: 'good',
      dimensionalStability: 'medium'
    },
    pricing: {
      pricePerSqFt: 2200,
      priceRange: 'commercial',
      marketTrend: 'stable'
    }
  },
  {
    name: 'Brazilian Teak',
    scientificName: 'Tabebuia serratifolia',
    category: 'teak',
    grade: 'premium',
    overview: {
      description: "Brazilian Teak, also known as Ipe, is one of the hardest and most durable woods available, with exceptional resistance to weather, insects, and decay.",
      keyBenefits: [
        "Extremely high density and hardness",
        "Superior weather and UV resistance",
        "Natural resistance to termites and decay",
        "Beautiful rich brown color with fine grain",
        "Excellent for outdoor applications"
      ],
      premiumPositioning: "Brazilian Teak is the ultimate choice for outdoor applications requiring maximum durability and weather resistance.",
      tagline: "Ultimate Outdoor Durability"
    },
    specifications: {
      density: 1050,
      hardness: 3680,
      moistureContent: 8,
      grainPattern: 'straight',
      durability: 'class1',
      workability: 'moderate',
      finishQuality: 'excellent',
      dimensionalStability: 'high'
    },
    pricing: {
      pricePerSqFt: 2800,
      priceRange: 'premium',
      marketTrend: 'stable'
    }
  },
  {
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
      dimensionalStability: 'medium'
    },
    pricing: {
      pricePerSqFt: 1600,
      priceRange: 'commercial',
      marketTrend: 'stable'
    }
  },
  {
    name: 'Century Ply Sainik MR',
    category: 'plywood',
    grade: 'commercial',
    overview: {
      description: "High-quality moisture-resistant plywood suitable for kitchen cabinets and interior furniture. Features uniform thickness and no hollow spaces.",
      keyBenefits: [
        "Moisture resistant for kitchen and bathroom use",
        "Uniform thickness with no hollow spaces",
        "Good strength and durability",
        "Easy to work with standard tools",
        "Cost-effective for commercial applications"
      ],
      premiumPositioning: "Century Ply Sainik MR offers reliable moisture resistance for interior applications at competitive pricing.",
      tagline: "Moisture Resistant Plywood for Interiors"
    },
    specifications: {
      density: 600,
      hardness: 800,
      moistureContent: 8,
      grainPattern: 'cross-laminated',
      durability: 'class2',
      workability: 'excellent',
      finishQuality: 'good',
      dimensionalStability: 'high'
    },
    pricing: {
      pricePerSqFt: 120,
      priceRange: 'commercial',
      marketTrend: 'stable'
    }
  },
  {
    name: 'Marine Plywood',
    category: 'plywood',
    grade: 'premium',
    overview: {
      description: "Water-resistant plywood suitable for outdoor furniture and high-moisture areas. Made with waterproof adhesives and high-quality veneers.",
      keyBenefits: [
        "100% waterproof construction",
        "Weather resistant for outdoor use",
        "High strength and durability",
        "Fungus and termite resistant",
        "Suitable for marine applications"
      ],
      premiumPositioning: "Marine Plywood is the premium choice for applications requiring maximum water resistance and outdoor durability.",
      tagline: "Waterproof Plywood for Outdoor Use"
    },
    specifications: {
      density: 650,
      hardness: 900,
      moistureContent: 6,
      grainPattern: 'cross-laminated',
      durability: 'class1',
      workability: 'good',
      finishQuality: 'excellent',
      dimensionalStability: 'high'
    },
    pricing: {
      pricePerSqFt: 180,
      priceRange: 'premium',
      marketTrend: 'stable'
    }
  }
];

async function populateProducts() {
  try {
    console.log('Starting to populate products...');
    
    for (const product of sampleProducts) {
      try {
        const result = await databases.createDocument(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          ID.unique(),
          product
        );
        console.log(`✅ Created product: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to create product ${product.name}:`, error.message);
      }
    }
    
    console.log('✅ Product population completed!');
  } catch (error) {
    console.error('❌ Error populating products:', error);
  }
}

// Run the population script
populateProducts();
