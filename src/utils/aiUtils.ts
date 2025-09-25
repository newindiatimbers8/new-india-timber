import { toast } from "@/hooks/use-toast";
import { Groq } from "groq-sdk";

// Get API key from environment variables
export const getGroqApiKey = () => {
  return import.meta.env.VITE_GROQ_API_KEY || "";
};

// Enhanced project details interface with more detailed information
export interface ProjectDetails {
  projectType: string;
  projectSubType?: string;
  areaSize: number;
  numDoors: number;
  numWindows: number;
  selectedMaterials: string[];
  estimatedPrice: number;
  doorDetails?: {
    types: string[];
    sizes: {width: number, height: number};
    finishes: string[];
  };
  windowDetails?: {
    types: string[];
    sizes: {width: number, height: number};
  };
  additionalWoodwork?: {
    types: string[];
    details: string;
  };
  designPreferences?: {
    style: string;
    finishes: string[];
  };
  environmentalFactors?: {
    climateZone: string;
    sustainabilityPreference: number;
    termiteProtection: boolean;
    moistureResistance: boolean;
  };
  budgetInfo?: {
    range: string;
    flexibility: string;
    priority: string;
  };
  additionalInfo?: {
    projectPurpose: string;
    specificRequirements: string;
    timeline: string;
    challenges: string;
    maintenanceExpectations?: string;
    regionalPreferences?: string;
  };
}

export async function getAIProjectInsights(projectDetails: ProjectDetails): Promise<string> {
  try {
    const groq = new Groq({ 
      apiKey: getGroqApiKey(),
      dangerouslyAllowBrowser: true // Added this option to allow browser usage
    });
    
    // Enhanced prompt with more details for better AI insights
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a timber and woodworking expert assistant at New India Timber with deep knowledge of Indian timber industry, materials, techniques, and regional styles. Provide concise, helpful insights about timber projects based on the provided details. Be specific, practical, and tailor your responses to the Indian context, mentioning regional considerations when relevant Write Letter style, Output Plain text only no markdown"
        },
        {
          role: "user",
          content: `Based on this detailed timber project information, provide 4-6 important insights, recommendations, or considerations (maximum 350 words total):
          
          PROJECT OVERVIEW:
          - Project type: ${projectDetails.projectType} - ${projectDetails.projectSubType || ''}
          - Area size: ${projectDetails.areaSize} sq. ft.
          - Number of doors: ${projectDetails.numDoors}
          - Number of windows: ${projectDetails.numWindows}
          
          MATERIALS & DESIGN:
          - Selected materials: ${projectDetails.selectedMaterials.join(", ")}
          ${projectDetails.designPreferences ? `- Design style: ${projectDetails.designPreferences.style}
          - Finish preferences: ${projectDetails.designPreferences.finishes.join(", ")}` : ''}
          
          ${projectDetails.doorDetails ? `DOOR SPECIFICATIONS:
          - Door types: ${projectDetails.doorDetails.types.join(", ")}
          - Door dimensions: ${projectDetails.doorDetails.sizes.width}' × ${projectDetails.doorDetails.sizes.height}'
          - Door finishes: ${projectDetails.doorDetails.finishes.join(", ")}` : ''}
          
          ${projectDetails.windowDetails ? `WINDOW SPECIFICATIONS:
          - Window types: ${projectDetails.windowDetails.types.join(", ")}
          - Window dimensions: ${projectDetails.windowDetails.sizes.width}' × ${projectDetails.windowDetails.sizes.height}'` : ''}
          
          ${projectDetails.additionalWoodwork && projectDetails.additionalWoodwork.types.length > 0 ? `ADDITIONAL WOODWORK:
          - Types: ${projectDetails.additionalWoodwork.types.join(", ")}
          - Details: ${projectDetails.additionalWoodwork.details}` : ''}
          
          ${projectDetails.environmentalFactors ? `ENVIRONMENTAL CONSIDERATIONS:
          - Climate zone: ${projectDetails.environmentalFactors.climateZone}
          - Sustainability preference: ${projectDetails.environmentalFactors.sustainabilityPreference}/5
          - Special treatments: ${projectDetails.environmentalFactors.termiteProtection ? 'Termite protection, ' : ''}${projectDetails.environmentalFactors.moistureResistance ? 'Moisture resistance' : ''}` : ''}
          
          ${projectDetails.budgetInfo ? `BUDGET INFORMATION:
          - Budget range: ${projectDetails.budgetInfo.range}
          - Budget flexibility: ${projectDetails.budgetInfo.flexibility}
          - Priority factor: ${projectDetails.budgetInfo.priority}` : ''}
          
          ${projectDetails.additionalInfo ? `ADDITIONAL INFORMATION:
          - Project purpose: ${projectDetails.additionalInfo.projectPurpose}
          - Specific requirements: ${projectDetails.additionalInfo.specificRequirements}
          - Timeline: ${projectDetails.additionalInfo.timeline}
          - Challenges: ${projectDetails.additionalInfo.challenges}
          ${projectDetails.additionalInfo.maintenanceExpectations ? `- Maintenance expectations: ${projectDetails.additionalInfo.maintenanceExpectations}` : ''}
          ${projectDetails.additionalInfo.regionalPreferences ? `- Regional/cultural preferences: ${projectDetails.additionalInfo.regionalPreferences}` : ''}` : ''}
          
          - Estimated budget: ₹${projectDetails.estimatedPrice.toLocaleString('en-IN')}
          
          Focus on material choices, durability, maintenance, regional suitability, potential challenges, and budget considerations. Provide insights specific to the Indian climate and building context. Format your response as 4-6 separate, numbered insights or recommendations.`
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });
    
    return completion.choices[0]?.message?.content || "No insights available.";
    
  } catch (error) {
    console.error("AI insights error:", error);
    toast({
      title: "Error fetching AI insights",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive"
    });
    return "Unable to generate insights at this time. Please try again later.";
  }
}
