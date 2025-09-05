import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  Image, 
  Share2, 
  Code, 
  Building, 
  Phone, 
  MapPin,
  X,
  Plus
} from 'lucide-react';
import { GlobalSEOSettings } from '@/types/seo';
import { SEOStorageManager } from '@/utils/seoStorage';
import { useToast } from '@/hooks/use-toast';

// Zod schema for form validation
const globalSEOSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(100, 'Site name too long'),
  defaultTitle: z.string().min(1, 'Default title is required').max(200, 'Title too long'),
  titleSeparator: z.string().min(1, 'Title separator is required').max(5, 'Separator too long'),
  defaultDescription: z.string().min(50, 'Description should be at least 50 characters').max(160, 'Description should be under 160 characters'),
  defaultKeywords: z.array(z.string()).min(1, 'At least one keyword is required'),
  canonicalURL: z.string().url('Must be a valid URL'),
  robotsTxt: z.string().min(1, 'Robots.txt content is required'),
  socialMedia: z.object({
    ogImage: z.string().optional(),
    ogType: z.string().min(1, 'OG type is required'),
    twitterCard: z.string().min(1, 'Twitter card type is required'),
    twitterSite: z.string().optional(),
    facebookAppId: z.string().optional(),
  }),
  structuredData: z.object({
    organizationSchema: z.object({
      name: z.string().min(1, 'Organization name is required'),
      url: z.string().url('Must be a valid URL'),
      logo: z.string().url('Must be a valid URL'),
      contactPoint: z.array(z.object({
        telephone: z.string().min(1, 'Phone number is required'),
        contactType: z.string().min(1, 'Contact type is required'),
        areaServed: z.string().optional(),
        availableLanguage: z.array(z.string()).optional(),
      })),
      address: z.object({
        streetAddress: z.string().min(1, 'Street address is required'),
        addressLocality: z.string().min(1, 'City is required'),
        addressRegion: z.string().min(1, 'State/Region is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        addressCountry: z.string().min(1, 'Country is required'),
      }),
      sameAs: z.array(z.string().url('Must be valid URLs')),
    }),
  }),
});

type GlobalSEOFormData = z.infer<typeof globalSEOSchema>;

interface GlobalSEOSettingsProps {
  settings?: GlobalSEOSettings;
  onUpdate: (settings: GlobalSEOSettings) => void;
}

export const GlobalSEOSettings: React.FC<GlobalSEOSettingsProps> = ({
  settings,
  onUpdate,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newSocialLink, setNewSocialLink] = useState('');

  const form = useForm<GlobalSEOFormData>({
    resolver: zodResolver(globalSEOSchema),
    defaultValues: {
      siteName: settings?.siteName || 'Timber Craft Commerce Hub',
      defaultTitle: settings?.defaultTitle || '%page% | Timber Craft Commerce Hub',
      titleSeparator: settings?.titleSeparator || ' | ',
      defaultDescription: settings?.defaultDescription || 'Premium timber and woodcraft solutions for all your construction and design needs.',
      defaultKeywords: settings?.defaultKeywords || ['timber', 'wood', 'craft'],
      canonicalURL: settings?.canonicalURL || 'https://timbercrafthub.com',
      robotsTxt: settings?.robotsTxt || `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /dashboard/\nSitemap: https://timbercrafthub.com/sitemap.xml`,
      socialMedia: {
        ogImage: settings?.socialMedia.ogImage || '',
        ogType: settings?.socialMedia.ogType || 'website',
        twitterCard: settings?.socialMedia.twitterCard || 'summary_large_image',
        twitterSite: settings?.socialMedia.twitterSite || '@timbercrafthub',
        facebookAppId: settings?.socialMedia.facebookAppId || '',
      },
      structuredData: {
        organizationSchema: {
          name: settings?.structuredData.organizationSchema.name || 'Timber Craft Commerce Hub',
          url: settings?.structuredData.organizationSchema.url || 'https://timbercrafthub.com',
          logo: settings?.structuredData.organizationSchema.logo || 'https://timbercrafthub.com/logo.png',
          contactPoint: settings?.structuredData.organizationSchema.contactPoint || [{
            '@type': 'ContactPoint',
            telephone: '+91-80-1234-5678',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi']
          }],
          address: settings?.structuredData.organizationSchema.address || {
            '@type': 'PostalAddress',
            streetAddress: '24/4 Sarjapura Main Road Doddakanna halli, beside Uber Verdant, Phase 1, apartments',
            addressLocality: 'Bangalore',
            addressRegion: 'Karnataka',
            postalCode: '560068',
            addressCountry: 'IN'
          },
          sameAs: settings?.structuredData.organizationSchema.sameAs || [],
        },
      },
    },
  });

  const handleSubmit = async (data: GlobalSEOFormData) => {
    setIsLoading(true);
    try {
      const updatedSettings: GlobalSEOSettings = {
        ...settings,
        ...data,
        id: settings?.id || crypto.randomUUID(),
        favicon: settings?.favicon || {
          ico: '/favicon.ico',
          png16: '/favicon-16x16.png',
          png32: '/favicon-32x32.png',
          apple180: '/apple-touch-icon.png'
        },
        analytics: settings?.analytics || {},
        structuredData: {
          organizationSchema: {
            '@type': 'Organization',
            ...data.structuredData.organizationSchema,
          },
          websiteSchema: settings?.structuredData.websiteSchema || {
            '@type': 'WebSite',
            name: data.siteName,
            url: data.canonicalURL,
            description: data.defaultDescription,
            publisher: {
              '@type': 'Organization',
              name: data.siteName
            }
          }
        },
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin',
      };

      SEOStorageManager.saveGlobalSettings(updatedSettings);
      onUpdate(updatedSettings);
      
      toast({
        title: 'Settings Saved',
        description: 'Global SEO settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save SEO settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !form.getValues('defaultKeywords').includes(newKeyword.trim())) {
      const currentKeywords = form.getValues('defaultKeywords');
      form.setValue('defaultKeywords', [...currentKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const currentKeywords = form.getValues('defaultKeywords');
    form.setValue('defaultKeywords', currentKeywords.filter((_, i) => i !== index));
  };

  const addSocialLink = () => {
    if (newSocialLink.trim() && newSocialLink.startsWith('http')) {
      const currentLinks = form.getValues('structuredData.organizationSchema.sameAs');
      if (!currentLinks.includes(newSocialLink.trim())) {
        form.setValue('structuredData.organizationSchema.sameAs', [...currentLinks, newSocialLink.trim()]);
        setNewSocialLink('');
      }
    }
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = form.getValues('structuredData.organizationSchema.sameAs');
    form.setValue('structuredData.organizationSchema.sameAs', currentLinks.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="structured">Structured Data</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle>Basic Information</CardTitle>
                </div>
                <CardDescription>
                  Core website metadata that appears across all pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Timber Craft Commerce Hub" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of your website/business
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Title Template</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="%page% | Timber Craft Commerce Hub" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Use %page% as placeholder for page names. Max 60 characters recommended.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="titleSeparator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title Separator</FormLabel>
                      <FormControl>
                        <Input placeholder=" | " className="w-20" {...field} />
                      </FormControl>
                      <FormDescription>
                        Character(s) used to separate page title from site name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Meta Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Premium timber and woodcraft solutions..."
                          className="resize-none"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/160 characters. Used when page-specific description is not available.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canonicalURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://timbercrafthub.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Primary domain for your website
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel>Default Keywords</FormLabel>
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
                    {form.watch('defaultKeywords').map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {keyword}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeKeyword(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>
                    Primary keywords for your website. Used as fallback when page-specific keywords are not set.
                  </FormDescription>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  <CardTitle>Social Media Settings</CardTitle>
                </div>
                <CardDescription>
                  Configure how your site appears when shared on social platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="socialMedia.ogImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Social Image (Open Graph)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://timbercrafthub.com/og-image.jpg"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Default image for social media shares. Recommended: 1200x630px
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.ogType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Open Graph Type</FormLabel>
                      <FormControl>
                        <Input placeholder="website" {...field} />
                      </FormControl>
                      <FormDescription>
                        Type of content (website, article, product, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.twitterCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Card Type</FormLabel>
                      <FormControl>
                        <Input placeholder="summary_large_image" {...field} />
                      </FormControl>
                      <FormDescription>
                        Twitter card format (summary, summary_large_image, app, player)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.twitterSite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Handle</FormLabel>
                      <FormControl>
                        <Input placeholder="@timbercrafthub" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your Twitter/X account handle
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.facebookAppId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook App ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" {...field} />
                      </FormControl>
                      <FormDescription>
                        Facebook application ID for enhanced analytics
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structured" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <CardTitle>Organization Information</CardTitle>
                </div>
                <CardDescription>
                  Structured data for better search engine understanding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="structuredData.organizationSchema.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Timber Craft Commerce Hub" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="structuredData.organizationSchema.logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://timbercrafthub.com/logo.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-medium">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </h4>
                  
                  <FormField
                    control={form.control}
                    name="structuredData.organizationSchema.contactPoint.0.telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91-80-1234-5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4" />
                    Business Address
                  </h4>
                  
                  <FormField
                    control={form.control}
                    name="structuredData.organizationSchema.address.streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="24/4 Sarjapura Main Road Doddakanna halli, beside Uber Verdant, Phase 1, apartments" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="structuredData.organizationSchema.address.addressLocality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Bangalore" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="structuredData.organizationSchema.address.addressRegion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Region</FormLabel>
                          <FormControl>
                            <Input placeholder="Karnataka" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="structuredData.organizationSchema.address.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="560068" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="structuredData.organizationSchema.address.addressCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="IN" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <FormLabel>Social Media Links</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://www.facebook.com/timbercrafthub"
                      value={newSocialLink}
                      onChange={(e) => setNewSocialLink(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSocialLink())}
                    />
                    <Button type="button" onClick={addSocialLink} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {form.watch('structuredData.organizationSchema.sameAs').map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm truncate">{link}</span>
                        <X 
                          className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive" 
                          onClick={() => removeSocialLink(index)}
                        />
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Add social media profile URLs for enhanced search presence
                  </FormDescription>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  <CardTitle>Technical SEO</CardTitle>
                </div>
                <CardDescription>
                  Technical configuration for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="robotsTxt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Robots.txt Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/"
                          className="resize-none font-mono text-sm"
                          rows={8}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Instructions for search engine crawlers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Global Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
};