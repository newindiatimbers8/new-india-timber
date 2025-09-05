import Groq from "groq-sdk";
import { 
  AISettings, 
  AIGenerationRequest, 
  AIGenerationResponse,
  PageSEOSettings 
} from '@/types/seo';
import { SEOStorageManager } from './seoStorage';

/**
 * AI SEO Content Generator using GroqCloud API
 * Generates optimized titles, descriptions, and keywords for SEO
 */
export class SEOAIGenerator {
  private groq: Groq | null = null;
  private settings: AISettings;

  constructor() {
    this.settings = SEOStorageManager.loadAISettings();
    this.initializeGroq();
  }

  /**
   * Initialize Groq client with current settings
   */
  private initializeGroq(): void {
    if (this.settings.groqApiKey && this.settings.isEnabled) {
      try {
        this.groq = new Groq({ 
          apiKey: this.settings.groqApiKey,
          dangerouslyAllowBrowser: true // Note: In production, this should be done server-side
        });
      } catch (error) {
        console.error('Failed to initialize Groq client:', error);
        this.groq = null;
      }
    }
  }

  /**
   * Update AI settings and reinitialize client
   */
  updateSettings(newSettings: AISettings): void {
    this.settings = newSettings;
    SEOStorageManager.saveAISettings(newSettings);
    this.initializeGroq();
  }

  /**
   * Check if AI generation is available
   */
  isAvailable(): boolean {
    return this.groq !== null && this.settings.isEnabled && !!this.settings.groqApiKey;
  }

  /**
   * Generate SEO content based on request
   */
  async generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.isAvailable()) {
      throw new Error('AI generation is not available. Please check your API key and settings.');
    }

    try {
      const prompt = this.buildPrompt(request);
      
      const completion = await this.groq!.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert SEO content writer specializing in creating optimized titles, meta descriptions, and keywords for web pages. Your content should be engaging, keyword-rich, and follow SEO best practices."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: this.settings.model,
        temperature: this.settings.temperature,
        max_tokens: this.settings.maxTokens,
      });

      const responseText = completion.choices[0]?.message?.content || "";
      
      return this.parseAIResponse(responseText, request.type);
    } catch (error) {
      console.error('AI generation failed:', error);
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate optimized title for a page
   */
  async generateTitle(
    content: string, 
    targetKeywords: string[] = [], 
    brand: string = 'Timber Craft Commerce Hub'
  ): Promise<AIGenerationResponse> {
    return this.generateContent({
      type: 'title',
      content,
      targetKeywords,
      characterLimit: 60,
      brand,
      tone: 'professional'
    });
  }

  /**
   * Generate optimized meta description for a page
   */
  async generateDescription(
    content: string, 
    targetKeywords: string[] = [], 
    brand: string = 'Timber Craft Commerce Hub'
  ): Promise<AIGenerationResponse> {
    return this.generateContent({
      type: 'description',
      content,
      targetKeywords,
      characterLimit: 160,
      brand,
      tone: 'professional'
    });
  }

  /**
   * Extract and suggest keywords from content
   */
  async generateKeywords(
    content: string, 
    existingKeywords: string[] = []
  ): Promise<AIGenerationResponse> {
    return this.generateContent({
      type: 'keywords',
      content,
      targetKeywords: existingKeywords,
      tone: 'professional'
    });
  }

  /**
   * Generate complete SEO package for a page
   */
  async generateCompleteSEO(
    pageContent: string,
    pageTitle: string,
    existingKeywords: string[] = []
  ): Promise<{
    title: AIGenerationResponse;
    description: AIGenerationResponse;
    keywords: AIGenerationResponse;
  }> {
    const [title, description, keywords] = await Promise.all([
      this.generateTitle(pageContent + ' ' + pageTitle, existingKeywords),
      this.generateDescription(pageContent + ' ' + pageTitle, existingKeywords),
      this.generateKeywords(pageContent + ' ' + pageTitle, existingKeywords)
    ]);

    return { title, description, keywords };
  }

  /**
   * Build prompt based on request type and parameters
   */
  private buildPrompt(request: AIGenerationRequest): string {
    const { type, content, targetKeywords, characterLimit, brand, tone } = request;
    
    let basePrompt = '';
    const keywordText = targetKeywords && targetKeywords.length > 0 
      ? `Target keywords: ${targetKeywords.join(', ')}`
      : '';

    switch (type) {
      case 'title':
        basePrompt = `Create an SEO-optimized page title for the following content. 
        The title should be compelling, include primary keywords naturally, and be under ${characterLimit || 60} characters.
        ${keywordText}
        Brand: ${brand}
        Tone: ${tone}
        
        Content: ${content}
        
        Please provide:
        1. A primary optimized title
        2. 3 alternative title variations
        3. Character count for each
        
        Format your response as JSON:
        {
          "primary": "Main title here",
          "alternatives": ["Alt 1", "Alt 2", "Alt 3"],
          "characters": [count1, count2, count3, count4]
        }`;
        break;

      case 'description':
        basePrompt = `Create an SEO-optimized meta description for the following content.
        The description should be compelling, include keywords naturally, encourage clicks, and be under ${characterLimit || 160} characters.
        ${keywordText}
        Brand: ${brand}
        Tone: ${tone}
        
        Content: ${content}
        
        Please provide:
        1. A primary optimized description
        2. 3 alternative description variations
        3. Character count for each
        
        Format your response as JSON:
        {
          "primary": "Main description here",
          "alternatives": ["Alt 1", "Alt 2", "Alt 3"],
          "characters": [count1, count2, count3, count4]
        }`;
        break;

      case 'keywords':
        basePrompt = `Analyze the following content and suggest relevant SEO keywords and phrases.
        Focus on long-tail keywords, commercial intent keywords, and semantic variations.
        ${keywordText ? `Existing keywords: ${targetKeywords!.join(', ')}` : ''}
        
        Content: ${content}
        
        Please provide:
        1. Primary keywords (most important)
        2. Secondary keywords (supporting)
        3. Long-tail keywords (specific phrases)
        4. Related semantic keywords
        
        Format your response as JSON:
        {
          "primary": ["keyword1", "keyword2"],
          "secondary": ["keyword3", "keyword4"],
          "longtail": ["phrase1", "phrase2"],
          "semantic": ["related1", "related2"]
        }`;
        break;
    }

    return basePrompt;
  }

  /**
   * Parse AI response and extract structured data
   */
  private parseAIResponse(responseText: string, type: AIGenerationRequest['type']): AIGenerationResponse {
    try {
      // Try to parse as JSON first
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        switch (type) {
          case 'title':
          case 'description':
            return {
              generated: parsed.primary || '',
              suggestions: parsed.alternatives || [],
              confidence: 0.8,
              tokensUsed: Math.ceil(responseText.length / 4) // Rough estimate
            };
            
          case 'keywords':
            const allKeywords = [
              ...(parsed.primary || []),
              ...(parsed.secondary || []),
              ...(parsed.longtail || []),
              ...(parsed.semantic || [])
            ];
            return {
              generated: allKeywords.join(', '),
              suggestions: allKeywords,
              confidence: 0.8,
              tokensUsed: Math.ceil(responseText.length / 4)
            };
        }
      }
    } catch (error) {
      console.warn('Failed to parse JSON response, falling back to text parsing');
    }

    // Fallback: parse as plain text
    const lines = responseText.split('\n').filter(line => line.trim());
    const generated = lines[0] || responseText.substring(0, 100);
    const suggestions = lines.slice(1, 4).filter(line => line.length > 0);

    return {
      generated: generated.replace(/^\d+\.\s*/, '').trim(),
      suggestions: suggestions.map(s => s.replace(/^\d+\.\s*/, '').trim()),
      confidence: 0.6,
      tokensUsed: Math.ceil(responseText.length / 4)
    };
  }

  /**
   * Generate SEO recommendations for existing page
   */
  async generateSEOAudit(page: PageSEOSettings): Promise<string[]> {
    if (!this.isAvailable()) {
      return ['AI recommendations are not available. Please configure your API key.'];
    }

    const auditPrompt = `
    Analyze the following page SEO settings and provide specific improvement recommendations:
    
    Page: ${page.pageTitle} (${page.pagePath})
    Meta Title: ${page.metaTitle || 'Not set'}
    Meta Description: ${page.metaDescription || 'Not set'}
    Keywords: ${page.keywords.join(', ') || 'None'}
    
    Provide 5-7 specific, actionable SEO recommendations to improve this page's search performance.
    Focus on title optimization, description improvements, keyword strategy, and technical SEO.
    `;

    try {
      const completion = await this.groq!.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an SEO expert providing specific, actionable recommendations for page optimization."
          },
          {
            role: "user",
            content: auditPrompt
          }
        ],
        model: this.settings.model,
        temperature: 0.3, // Lower temperature for more focused recommendations
        max_tokens: 500,
      });

      const recommendations = completion.choices[0]?.message?.content || "";
      return recommendations.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 10);
        
    } catch (error) {
      console.error('SEO audit generation failed:', error);
      return ['Failed to generate SEO recommendations. Please try again later.'];
    }
  }

  /**
   * Test API connection and settings
   */
  async testConnection(): Promise<{ success: boolean; message: string; model?: string }> {
    if (!this.settings.groqApiKey) {
      return { success: false, message: 'API key is required' };
    }

    try {
      this.initializeGroq();
      
      if (!this.groq) {
        return { success: false, message: 'Failed to initialize Groq client' };
      }

      const testCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: "Say 'Connection successful' if you can read this message."
          }
        ],
        model: this.settings.model,
        temperature: 0.1,
        max_tokens: 10,
      });

      const response = testCompletion.choices[0]?.message?.content || "";
      
      return {
        success: response.toLowerCase().includes('connection successful') || response.length > 0,
        message: response.length > 0 ? 'Connection successful' : 'Unexpected response from API',
        model: this.settings.model
      };
      
    } catch (error) {
      console.error('API connection test failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown connection error'
      };
    }
  }

  /**
   * Get available models from GroqCloud
   */
  static getAvailableModels(): Array<{ id: string; name: string; description: string }> {
    return [
      {
        id: 'openai/gpt-oss-20b',
        name: 'GPT OSS 20B',
        description: 'Fast and capable model for general tasks'
      },
      {
        id: 'llama-3.1-70b-versatile',
        name: 'Llama 3.1 70B',
        description: 'Large model with excellent reasoning capabilities'
      },
      {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1 8B Instant',
        description: 'Fast, lightweight model for quick responses'
      },
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        description: 'Excellent for complex reasoning and long contexts'
      }
    ];
  }
}