import React, { useState, useMemo } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search,
  FileText,
  Edit,
  MoreHorizontal,
  Filter,
  Download,
  Upload,
  Sparkles,
  Eye,
  Calendar,
  BarChart3,
  X,
  Plus
} from 'lucide-react';
import { PageSEOSettings } from '@/types/seo';
import { SEOStorageManager } from '@/utils/seoStorage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AIContentGenerator } from './AIContentGenerator';
import { SEOPreview } from './SEOPreview';

const pageSEOSchema = z.object({
  pageTitle: z.string().min(1, 'Page title is required'),
  metaTitle: z.string().max(60, 'Meta title should be under 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description should be under 160 characters').optional(),
  keywords: z.array(z.string()),
  canonicalUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  noIndex: z.boolean(),
  noFollow: z.boolean(),
  priority: z.number().min(0).max(1),
  changeFreq: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']),
  status: z.enum(['published', 'draft', 'archived']),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type PageSEOFormData = z.infer<typeof pageSEOSchema>;

interface PageSEOManagementProps {
  pages: PageSEOSettings[];
  onUpdate: (pages: PageSEOSettings[]) => void;
}

export const PageSEOManagement: React.FC<PageSEOManagementProps> = ({
  pages,
  onUpdate,
}) => {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const selectedPageData = selectedPage 
    ? pages.find(page => page.id === selectedPage)
    : null;

  const form = useForm<PageSEOFormData>({
    resolver: zodResolver(pageSEOSchema),
    defaultValues: selectedPageData ? {
      pageTitle: selectedPageData.pageTitle,
      metaTitle: selectedPageData.metaTitle || '',
      metaDescription: selectedPageData.metaDescription || '',
      keywords: selectedPageData.keywords,
      canonicalUrl: selectedPageData.canonicalUrl || '',
      noIndex: selectedPageData.noIndex,
      noFollow: selectedPageData.noFollow,
      priority: selectedPageData.priority,
      changeFreq: selectedPageData.changeFreq,
      status: selectedPageData.status,
      ogTitle: selectedPageData.ogTitle || '',
      ogDescription: selectedPageData.ogDescription || '',
      ogImage: selectedPageData.ogImage || '',
      twitterTitle: selectedPageData.twitterTitle || '',
      twitterDescription: selectedPageData.twitterDescription || '',
      twitterImage: selectedPageData.twitterImage || '',
    } : undefined,
  });

  // Reset form when selected page changes
  React.useEffect(() => {
    if (selectedPageData) {
      form.reset({
        pageTitle: selectedPageData.pageTitle,
        metaTitle: selectedPageData.metaTitle || '',
        metaDescription: selectedPageData.metaDescription || '',
        keywords: selectedPageData.keywords,
        canonicalUrl: selectedPageData.canonicalUrl || '',
        noIndex: selectedPageData.noIndex,
        noFollow: selectedPageData.noFollow,
        priority: selectedPageData.priority,
        changeFreq: selectedPageData.changeFreq,
        status: selectedPageData.status,
        ogTitle: selectedPageData.ogTitle || '',
        ogDescription: selectedPageData.ogDescription || '',
        ogImage: selectedPageData.ogImage || '',
        twitterTitle: selectedPageData.twitterTitle || '',
        twitterDescription: selectedPageData.twitterDescription || '',
        twitterImage: selectedPageData.twitterImage || '',
      });
    }
  }, [selectedPageData, form]);

  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      const matchesSearch = page.pageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           page.pagePath.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [pages, searchTerm, statusFilter]);

  const handlePageUpdate = (data: PageSEOFormData) => {
    if (!selectedPageData) return;

    const updatedPage: PageSEOSettings = {
      ...selectedPageData,
      ...data,
      lastModified: new Date().toISOString(),
    };

    const updatedPages = pages.map(page => 
      page.id === selectedPage ? updatedPage : page
    );

    SEOStorageManager.updatePageSetting(updatedPage);
    onUpdate(updatedPages);

    toast({
      title: 'Page Updated',
      description: `SEO settings for ${data.pageTitle} have been saved.`,
    });
  };

  const handleBulkSEOGeneration = async () => {
    // This would integrate with AI to generate SEO for all pages
    toast({
      title: 'Bulk Generation Started',
      description: 'AI is generating SEO content for all pages. This may take a few minutes.',
    });
  };

  const handleAIContentGenerated = (content: any) => {
    if (selectedPageData) {
      form.setValue('metaTitle', content.title);
      form.setValue('metaDescription', content.description);
      form.setValue('keywords', content.keywords);
      form.setValue('ogTitle', content.title);
      form.setValue('ogDescription', content.description);
      form.setValue('twitterTitle', content.title);
      form.setValue('twitterDescription', content.description);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !form.getValues('keywords').includes(newKeyword.trim())) {
      const currentKeywords = form.getValues('keywords');
      form.setValue('keywords', [...currentKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const currentKeywords = form.getValues('keywords');
    form.setValue('keywords', currentKeywords.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: PageSEOSettings['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSEOScore = (page: PageSEOSettings) => {
    let score = 0;
    if (page.metaTitle && page.metaTitle.length <= 60) score += 25;
    if (page.metaDescription && page.metaDescription.length >= 120 && page.metaDescription.length <= 160) score += 25;
    if (page.keywords.length >= 3) score += 25;
    if (page.ogTitle && page.ogDescription) score += 25;
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 max-w-md"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pages</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleBulkSEOGeneration} variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate SEO for All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Page List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Page List
            </CardTitle>
            <CardDescription>
              Select a page to edit its SEO settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {filteredPages.map((page) => {
                  const score = getSEOScore(page);
                  return (
                    <div
                      key={page.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
                        selectedPage === page.id && "border-primary bg-primary/5"
                      )}
                      onClick={() => setSelectedPage(page.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{page.pageTitle}</p>
                            <Badge className={getStatusColor(page.status)}>
                              {page.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{page.pagePath}</p>
                          {page.metaDescription && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {page.metaDescription}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <BarChart3 className="h-3 w-3" />
                            <span className={`text-xs font-medium ${
                              score >= 75 ? 'text-green-600' : 
                              score >= 50 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {score}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(page.lastModified).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Page Editor */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Page SEO Editor
                </CardTitle>
                <CardDescription>
                  Edit SEO settings for the selected page
                </CardDescription>
              </div>
              {selectedPage && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAIGenerator(!showAIGenerator)}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Generate
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedPage && selectedPageData ? (
              <div className="space-y-6">
                {showAIGenerator && (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <AIContentGenerator
                      onContentGenerated={handleAIContentGenerated}
                      initialContent={{
                        pageContent: selectedPageData.metaDescription || selectedPageData.pageTitle,
                        pageTitle: selectedPageData.pageTitle,
                        existingKeywords: selectedPageData.keywords
                      }}
                    />
                  </div>
                )}

                {showPreview && (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <SEOPreview
                      data={{
                        title: form.watch('metaTitle') || selectedPageData.pageTitle,
                        description: form.watch('metaDescription') || 'No description available',
                        url: `https://timbercrafthub.com${selectedPageData.pagePath}`,
                        image: form.watch('ogImage') || 'https://timbercrafthub.com/og-image.jpg',
                        siteName: 'Timber Craft Commerce Hub'
                      }}
                    />
                  </div>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handlePageUpdate)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pageTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Title</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormDescription>
                            The internal page title (read-only)
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Custom meta title for search engines"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            {(field.value?.length || 0)}/60 characters. Leave empty to use default template.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Compelling description for search results"
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            {(field.value?.length || 0)}/160 characters. Should encourage clicks from search results.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <FormLabel>Keywords</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter a keyword"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        />
                        <Button type="button" onClick={addKeyword} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.watch('keywords').map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {keyword}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeKeyword(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="changeFreq"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Change Frequency</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="always">Always</SelectItem>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="noIndex"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>No Index</FormLabel>
                              <FormDescription>
                                Prevent search engines from indexing this page
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="noFollow"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>No Follow</FormLabel>
                              <FormDescription>
                                Prevent search engines from following links on this page
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="canonicalUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Canonical URL (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://timbercrafthub.com/canonical-page"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Specify the canonical version of this page to prevent duplicate content issues
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Social Media</h4>
                      
                      <FormField
                        control={form.control}
                        name="ogTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Open Graph Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Title for social media shares"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ogDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Open Graph Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Description for social media shares"
                                rows={2}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ogImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Open Graph Image</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://timbercrafthub.com/page-image.jpg"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Image for social media shares (1200x630px recommended)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Save Page Settings
                    </Button>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center space-y-3">
                  <FileText className="h-12 w-12 mx-auto opacity-50" />
                  <p>Select a page to edit its SEO settings</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};