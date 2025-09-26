/**
 * AI Settings Management Page
 * Configure Gemini API, rate limits, and AI features
 */

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { getAISettings, updateAISettings, validateApiKey } from "@/services/ai-settings";
import type { AISettings } from "@/types/ai";
import { NavigationIcon } from "@/components/navigation/Icon";
import { cn } from "@/lib/utils";

const DEFAULT_SETTINGS: Partial<AISettings> = {
  model: "gemini-pro",
  maxTokens: 2000,
  temperature: 0.7,
  isEnabled: false,
  rateLimits: {
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 500
  }
};

const AISettingsPage = () => {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [formData, setFormData] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<{ isValid: boolean; message: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const currentSettings = await getAISettings();
      
      if (currentSettings) {
        setSettings(currentSettings);
        setFormData({
          model: currentSettings.model,
          maxTokens: currentSettings.maxTokens,
          temperature: currentSettings.temperature,
          isEnabled: currentSettings.isEnabled,
          rateLimits: currentSettings.rateLimits
        });
      }
    } catch (error) {
      console.error('Failed to load AI settings:', error);
      toast({
        title: "Error loading settings",
        description: "Failed to load AI configuration. Using defaults.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      const updatedSettings = await updateAISettings(formData);
      
      if (updatedSettings) {
        setSettings(updatedSettings);
        toast({
          title: "Settings saved",
          description: "AI configuration has been updated successfully."
        });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: "Error saving settings",
        description: "Failed to update AI configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestApiKey = async () => {
    try {
      setIsTestingKey(true);
      const result = await validateApiKey();
      setApiKeyStatus(result);
      
      toast({
        title: result.isValid ? "API key valid" : "API key invalid",
        description: result.message,
        variant: result.isValid ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Failed to test API key:', error);
      toast({
        title: "Error testing API key",
        description: "Unable to validate API key. Please check your configuration.",
        variant: "destructive"
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleFieldChange = (field: keyof AISettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRateLimitChange = (field: keyof AISettings['rateLimits'], value: number) => {
    setFormData(prev => ({
      ...prev,
      rateLimits: {
        ...prev.rateLimits,
        [field]: value
      }
    }));
  };

  if (isLoading) {
  return (
    <Layout>
      <Helmet>
        <title>AI Settings | New India Timber Admin</title>
        <meta name="description" content="Configure AI settings and API keys for New India Timber content generation" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="keywords" content="ai settings, timber admin, content generation settings" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-8 w-64 animate-pulse rounded bg-timber-100" />
            <div className="h-96 animate-pulse rounded-2xl bg-timber-50" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>AI Settings | New India Timber Admin</title>
        <meta name="description" content="Configure AI content generation settings for New India Timber" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-900">AI Settings</h1>
          <p className="text-muted-foreground">Configure Google Gemini integration for content generation</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {/* API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <NavigationIcon name="briefcase" />
                  Google Gemini API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter your Gemini API key"
                      onChange={(e) => handleFieldChange('apiKey', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleTestApiKey}
                      disabled={isTestingKey}
                    >
                      {isTestingKey ? "Testing..." : "Test"}
                    </Button>
                  </div>
                  {apiKeyStatus && (
                    <div className={cn(
                      "rounded-lg border p-3 text-sm",
                      apiKeyStatus.isValid 
                        ? "border-green-200 bg-green-50 text-green-800" 
                        : "border-red-200 bg-red-50 text-red-800"
                    )}>
                      {apiKeyStatus.message}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model || "gemini-pro"}
                    onChange={(e) => handleFieldChange('model', e.target.value)}
                    placeholder="gemini-pro"
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="enabled">Enable AI Features</Label>
                  <Switch
                    id="enabled"
                    checked={formData.isEnabled || false}
                    onCheckedChange={(checked) => handleFieldChange('isEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generation Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <NavigationIcon name="settings" />
                  Content Generation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Max Tokens: {formData.maxTokens || 2000}</Label>
                    <Slider
                      value={[formData.maxTokens || 2000]}
                      onValueChange={([value]) => handleFieldChange('maxTokens', value)}
                      max={4000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum tokens per content generation request
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Temperature: {(formData.temperature || 0.7).toFixed(1)}</Label>
                    <Slider
                      value={[(formData.temperature || 0.7) * 100]}
                      onValueChange={([value]) => handleFieldChange('temperature', value / 100)}
                      max={100}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Creativity level: 0 = conservative, 1 = creative
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rate Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <NavigationIcon name="scale" />
                  Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="perMinute">Per Minute</Label>
                    <Input
                      id="perMinute"
                      type="number"
                      value={formData.rateLimits?.requestsPerMinute || 10}
                      onChange={(e) => handleRateLimitChange('requestsPerMinute', parseInt(e.target.value))}
                      min={1}
                      max={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="perHour">Per Hour</Label>
                    <Input
                      id="perHour"
                      type="number"
                      value={formData.rateLimits?.requestsPerHour || 100}
                      onChange={(e) => handleRateLimitChange('requestsPerHour', parseInt(e.target.value))}
                      min={1}
                      max={1000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="perDay">Per Day</Label>
                    <Input
                      id="perDay"
                      type="number"
                      value={formData.rateLimits?.requestsPerDay || 500}
                      onChange={(e) => handleRateLimitChange('requestsPerDay', parseInt(e.target.value))}
                      min={1}
                      max={10000}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Set rate limits to control API usage and costs for your Bangalore timber team.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Features</span>
                  <Badge variant={formData.isEnabled ? "default" : "secondary"}>
                    {formData.isEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Key</span>
                  <Badge variant={apiKeyStatus?.isValid ? "default" : "secondary"}>
                    {apiKeyStatus?.isValid ? "Valid" : "Not Set"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Model</span>
                  <span className="text-xs text-muted-foreground">{formData.model}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Max Tokens</span>
                  <span className="text-xs text-muted-foreground">{formData.maxTokens}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  • Use AI to generate Bangalore-focused timber content
                </p>
                <p>
                  • Review all generated legal policies before publishing
                </p>
                <p>
                  • Monitor costs through the usage dashboard
                </p>
                <p>
                  • Set conservative rate limits for cost control
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={loadSettings}
                className="w-full"
              >
                Reset to Saved
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AISettingsPage;
