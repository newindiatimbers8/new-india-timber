import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Globe, 
  FileText, 
  BarChart3, 
  Download, 
  Upload, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Settings
} from 'lucide-react';
import { GlobalSEOSettings } from '@/components/seo/GlobalSEOSettings';
import { PageSEOManagement } from '@/components/seo/PageSEOManagement';
import { AIContentGenerator } from '@/components/seo/AIContentGenerator';
import { GlobalSEOSettings as GlobalSEOType, PageSEOSettings } from '@/types/seo';
import { SEOStorageManager } from '@/utils/seoStorage';
import { useToast } from '@/hooks/use-toast';

interface SEOSettingsPageProps {
  defaultTab?: 'global' | 'pages' | 'ai' | 'analytics';
}

export default function SEOSettingsPage({ defaultTab = 'global' }: SEOSettingsPageProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'global' | 'pages' | 'ai' | 'analytics'>(defaultTab);
  const [globalSettings, setGlobalSettings] = useState<GlobalSEOType | null>(null);
  const [pageSettings, setPageSettings] = useState<PageSEOSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load initial data
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const global = SEOStorageManager.getGlobalSettingsWithDefaults();
      const pages = SEOStorageManager.loadPageSettings();
      
      setGlobalSettings(global);
      setPageSettings(pages);
      setLastSaved(new Date(global.updatedAt));
    } catch (error) {
      toast({
        title: 'Error Loading Settings',
        description: 'Failed to load SEO settings. Please refresh the page.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalSettingsUpdate = (settings: GlobalSEOType) => {
    setGlobalSettings(settings);
    setLastSaved(new Date());
  };

  const handlePageSettingsUpdate = (pages: PageSEOSettings[]) => {
    setPageSettings(pages);
    setLastSaved(new Date());
  };

  const handleExportSettings = () => {
    try {
      const exportData = SEOStorageManager.exportAllSettings();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seo-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Settings Exported',
        description: 'SEO settings have been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export SEO settings.',
        variant: 'destructive',
      });
    }
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = SEOStorageManager.importSettings(content);
        
        if (success) {
          loadSettings();
          toast({
            title: 'Settings Imported',
            description: 'SEO settings have been imported successfully.',
          });
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        toast({
          title: 'Import Failed',
          description: 'Failed to import SEO settings. Please check the file format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const getOverallSEOScore = () => {
    if (!globalSettings || pageSettings.length === 0) return 0;

    let totalScore = 0;
    let maxScore = 0;

    // Global settings score (25% of total)
    const globalScore = globalSettings.siteName && globalSettings.defaultTitle && globalSettings.defaultDescription ? 25 : 0;
    totalScore += globalScore;
    maxScore += 25;

    // Page settings score (75% of total)
    pageSettings.forEach(page => {
      let pageScore = 0;
      if (page.metaTitle && page.metaTitle.length <= 60) pageScore += 25;
      if (page.metaDescription && page.metaDescription.length >= 120 && page.metaDescription.length <= 160) pageScore += 25;
      if (page.keywords.length >= 3) pageScore += 25;
      if (page.ogTitle && page.ogDescription) pageScore += 25;
      
      totalScore += pageScore;
      maxScore += 100;
    });

    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  };

  const getCompletedPages = () => {
    return pageSettings.filter(page => 
      page.metaTitle && 
      page.metaDescription && 
      page.keywords.length > 0
    ).length;
  };

  const getValidationIssues = () => {
    const issues: Array<{ type: 'error' | 'warning'; message: string }> = [];

    if (!globalSettings?.siteName) {
      issues.push({ type: 'error', message: 'Site name is required' });
    }

    if (!globalSettings?.defaultTitle) {
      issues.push({ type: 'error', message: 'Default title template is required' });
    }

    pageSettings.forEach(page => {
      if (!page.metaTitle && !page.metaDescription) {
        issues.push({ 
          type: 'warning', 
          message: `Page "${page.pageTitle}" is missing SEO metadata` 
        });
      }
      
      if (page.metaTitle && page.metaTitle.length > 60) {
        issues.push({ 
          type: 'warning', 
          message: `Page "${page.pageTitle}" has a meta title that's too long` 
        });
      }
    });

    return issues;
  };

  const overallScore = getOverallSEOScore();
  const completedPages = getCompletedPages();
  const validationIssues = getValidationIssues();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading SEO settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>SEO Settings | New India Timber Dashboard</title>
        <meta name="description" content="Manage SEO settings and optimize your New India Timber website for search engines" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="keywords" content="seo settings, timber website optimization, search engine optimization" />
      </Helmet>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold">SEO Settings</h1>
          <p className="text-muted-foreground">
            Manage search engine optimization for your website
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            className="hidden"
            id="seo-import"
          />
          <Button variant="outline" onClick={() => document.getElementById('seo-import')?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import Settings
          </Button>
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="mr-2 h-4 w-4" />
            Export Settings
          </Button>
          <Button onClick={loadSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall SEO Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallScore}%</div>
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                overallScore >= 80 ? 'bg-green-500' : 
                overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <p className="text-xs text-muted-foreground">
                {overallScore >= 80 ? 'Excellent' : 
                 overallScore >= 60 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPages}</div>
            <p className="text-xs text-muted-foreground">
              out of {pageSettings.length} total pages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validationIssues.length}</div>
            <p className="text-xs text-muted-foreground">
              {validationIssues.filter(i => i.type === 'error').length} errors, {validationIssues.filter(i => i.type === 'warning').length} warnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastSaved ? lastSaved.toLocaleDateString() : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastSaved ? lastSaved.toLocaleTimeString() : 'No changes saved'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Validation Issues */}
      {validationIssues.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">SEO Issues Detected:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {validationIssues.slice(0, 3).map((issue, index) => (
                  <li key={index} className={issue.type === 'error' ? 'text-red-600' : 'text-yellow-600'}>
                    {issue.message}
                  </li>
                ))}
                {validationIssues.length > 3 && (
                  <li className="text-muted-foreground">
                    And {validationIssues.length - 3} more issues...
                  </li>
                )}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Global Settings
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Page Management
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Generator
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics & Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          {globalSettings && (
            <GlobalSEOSettings 
              settings={globalSettings}
              onUpdate={handleGlobalSettingsUpdate}
            />
          )}
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <PageSEOManagement 
            pages={pageSettings}
            onUpdate={handlePageSettingsUpdate}
          />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Content Generator
              </CardTitle>
              <CardDescription>
                Generate optimized SEO content using AI. Configure your GroqCloud API settings below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIContentGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>SEO Analytics</CardTitle>
                <CardDescription>
                  Monitor your SEO performance and optimization progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pages with Meta Titles</span>
                  <Badge variant="secondary">
                    {pageSettings.filter(p => p.metaTitle).length}/{pageSettings.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pages with Meta Descriptions</span>
                  <Badge variant="secondary">
                    {pageSettings.filter(p => p.metaDescription).length}/{pageSettings.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pages with Keywords</span>
                  <Badge variant="secondary">
                    {pageSettings.filter(p => p.keywords.length > 0).length}/{pageSettings.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pages with Social Media Tags</span>
                  <Badge variant="secondary">
                    {pageSettings.filter(p => p.ogTitle && p.ogDescription).length}/{pageSettings.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Information</CardTitle>
                <CardDescription>
                  Monitor storage usage and data integrity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const storageInfo = SEOStorageManager.getStorageInfo();
                  const validation = SEOStorageManager.validateSettings();
                  
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Storage Used</span>
                        <Badge variant="secondary">
                          {Math.round(storageInfo.percentage)}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data Integrity</span>
                        <Badge variant={validation.isValid ? "default" : "destructive"}>
                          {validation.isValid ? "Valid" : "Issues Found"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Global Settings</span>
                        <Badge variant={globalSettings ? "default" : "destructive"}>
                          {globalSettings ? "Configured" : "Missing"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Pages</span>
                        <Badge variant="secondary">
                          {pageSettings.length}
                        </Badge>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common SEO management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <Button variant="outline" onClick={() => setActiveTab('pages')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Edit Page SEO
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('ai')}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </Button>
                <Button variant="outline" onClick={handleExportSettings}>
                  <Download className="mr-2 h-4 w-4" />
                  Backup Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </>
  );
}