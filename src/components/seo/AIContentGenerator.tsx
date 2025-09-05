import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Settings, 
  Copy, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  Wand2,
  Target
} from 'lucide-react';
import { SEOAIGenerator } from '@/utils/seoAI';
import { AISettings } from '@/types/seo';
import { SEOStorageManager } from '@/utils/seoStorage';
import { useToast } from '@/hooks/use-toast';
import { SEOPreview } from './SEOPreview';

const aiSettingsSchema = z.object({
  groqApiKey: z.string().min(1, 'API key is required'),
  model: z.string().min(1, 'Model selection is required'),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(50).max(1000),
  isEnabled: z.boolean(),
});

const contentGenerationSchema = z.object({
  pageContent: z.string().min(10, 'Page content should be at least 10 characters'),
  targetKeywords: z.string().optional(),
  brand: z.string().optional(),
  tone: z.enum(['professional', 'casual', 'technical', 'friendly']),
});

type AISettingsFormData = z.infer<typeof aiSettingsSchema>;
type ContentGenerationFormData = z.infer<typeof contentGenerationSchema>;

interface GeneratedContent {
  title: string;
  description: string;
  keywords: string[];
  suggestions: {
    titles: string[];
    descriptions: string[];
  };
}

interface AIContentGeneratorProps {
  onContentGenerated?: (content: GeneratedContent) => void;
  initialContent?: {
    pageContent?: string;
    pageTitle?: string;
    existingKeywords?: string[];
  };
}

export const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  onContentGenerated,
  initialContent
}) => {
  const { toast } = useToast();
  const [aiGenerator] = useState(() => new SEOAIGenerator());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');

  // Load current AI settings
  const currentSettings = SEOStorageManager.loadAISettings();

  const settingsForm = useForm<AISettingsFormData>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      groqApiKey: currentSettings.groqApiKey,
      model: currentSettings.model,
      temperature: currentSettings.temperature,
      maxTokens: currentSettings.maxTokens,
      isEnabled: currentSettings.isEnabled,
    },
  });

  const contentForm = useForm<ContentGenerationFormData>({
    resolver: zodResolver(contentGenerationSchema),
    defaultValues: {
      pageContent: initialContent?.pageContent || '',
      targetKeywords: initialContent?.existingKeywords?.join(', ') || '',
      brand: 'Timber Craft Commerce Hub',
      tone: 'professional',
    },
  });

  const handleSettingsSave = async (data: AISettingsFormData) => {
    try {
      const newSettings: AISettings = {
        ...data,
      };
      
      aiGenerator.updateSettings(newSettings);
      
      toast({
        title: 'Settings Saved',
        description: 'AI settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save AI settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const result = await aiGenerator.testConnection();
      setConnectionStatus(result.success ? 'success' : 'error');
      setConnectionMessage(result.message);
      
      if (result.success) {
        toast({
          title: 'Connection Successful',
          description: `Connected to ${result.model} model successfully.`,
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionMessage('Failed to test connection');
    }
  };

  const generateContent = async (data: ContentGenerationFormData) => {
    if (!aiGenerator.isAvailable()) {
      toast({
        title: 'AI Not Available',
        description: 'Please configure your API key and enable AI generation.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const keywords = data.targetKeywords 
        ? data.targetKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
        : [];

      const seoResults = await aiGenerator.generateCompleteSEO(
        data.pageContent,
        initialContent?.pageTitle || 'Page Title',
        keywords
      );

      const generated: GeneratedContent = {
        title: seoResults.title.generated,
        description: seoResults.description.generated,
        keywords: seoResults.keywords.suggestions,
        suggestions: {
          titles: seoResults.title.suggestions,
          descriptions: seoResults.description.suggestions,
        }
      };

      setGeneratedContent(generated);
      onContentGenerated?.(generated);

      toast({
        title: 'Content Generated',
        description: 'AI has successfully generated SEO content for your page.',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate content',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${label} copied to clipboard.`,
    });
  };

  const availableModels = SEOAIGenerator.getAvailableModels();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                <CardTitle>AI Content Generation</CardTitle>
              </div>
              <CardDescription>
                Generate optimized SEO titles, descriptions, and keywords using AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...contentForm}>
                <form onSubmit={contentForm.handleSubmit(generateContent)} className="space-y-4">
                  <FormField
                    control={contentForm.control}
                    name="pageContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the main content of your page here. The AI will analyze this to generate optimized SEO elements..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide the main content or description of the page you want to optimize
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={contentForm.control}
                    name="targetKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Keywords (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="timber, wood crafts, premium lumber, woodworking"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated keywords you want to target (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={contentForm.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Timber Craft Commerce Hub" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contentForm.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content Tone</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="technical">Technical</SelectItem>
                              <SelectItem value="friendly">Friendly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isGenerating || !aiGenerator.isAvailable()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Content...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate SEO Content
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {!aiGenerator.isAvailable() && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    AI generation is not available. Please configure your API key in the AI Settings tab.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>
                  AI-generated SEO content ready for use
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Title</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.title, 'Title')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">{generatedContent.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {generatedContent.title.length} characters
                    </p>
                  </div>
                  
                  {generatedContent.suggestions.titles.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Alternative Titles:</p>
                      <div className="space-y-1">
                        {generatedContent.suggestions.titles.map((title, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                            <span>{title}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(title, 'Alternative title')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Meta Description</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.description, 'Description')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p>{generatedContent.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {generatedContent.description.length} characters
                    </p>
                  </div>

                  {generatedContent.suggestions.descriptions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Alternative Descriptions:</p>
                      <div className="space-y-1">
                        {generatedContent.suggestions.descriptions.map((desc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                            <span className="flex-1">{desc}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(desc, 'Alternative description')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Keywords</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.keywords.join(', '), 'Keywords')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <CardTitle>AI Configuration</CardTitle>
              </div>
              <CardDescription>
                Configure GroqCloud API settings for AI content generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...settingsForm}>
                <form onSubmit={settingsForm.handleSubmit(handleSettingsSave)} className="space-y-4">
                  <FormField
                    control={settingsForm.control}
                    name="groqApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GroqCloud API Key</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your GroqCloud API key"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Get your API key from{' '}
                          <a 
                            href="https://console.groq.com/keys" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            GroqCloud Console
                          </a>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={settingsForm.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI Model</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select AI model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableModels.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                <div>
                                  <div className="font-medium">{model.name}</div>
                                  <div className="text-sm text-muted-foreground">{model.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={settingsForm.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature ({field.value})</FormLabel>
                          <FormControl>
                            <input
                              type="range"
                              min="0"
                              max="2"
                              step="0.1"
                              className="w-full"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Creativity level (0.0 = focused, 2.0 = creative)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={settingsForm.control}
                      name="maxTokens"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Tokens</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="50"
                              max="1000"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum response length
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Button type="submit">
                      Save Settings
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={testConnection}
                      disabled={connectionStatus === 'testing'}
                    >
                      {connectionStatus === 'testing' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : connectionStatus === 'success' ? (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      ) : connectionStatus === 'error' ? (
                        <AlertCircle className="mr-2 h-4 w-4" />
                      ) : (
                        <Target className="mr-2 h-4 w-4" />
                      )}
                      Test Connection
                    </Button>
                  </div>

                  {connectionMessage && (
                    <Alert variant={connectionStatus === 'success' ? 'default' : 'destructive'}>
                      {connectionStatus === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription>{connectionMessage}</AlertDescription>
                    </Alert>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {generatedContent ? (
            <SEOPreview
              data={{
                title: generatedContent.title,
                description: generatedContent.description,
                url: 'https://timbercrafthub.com/example-page',
                image: 'https://timbercrafthub.com/og-image.jpg',
                siteName: 'Timber Craft Commerce Hub'
              }}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">No Content to Preview</h3>
                  <p className="text-muted-foreground">
                    Generate content first to see the preview
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};