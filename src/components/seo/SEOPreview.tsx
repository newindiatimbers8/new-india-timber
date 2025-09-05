import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  ExternalLink,
  Smartphone,
  Monitor
} from 'lucide-react';
import { SEOPreviewData } from '@/types/seo';

interface SEOPreviewProps {
  data: SEOPreviewData;
  className?: string;
}

export const SEOPreview: React.FC<SEOPreviewProps> = ({ data, className }) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const GooglePreview = () => (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Google Search Results</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 mt-1 flex-shrink-0" />
            <div className="space-y-1 flex-1">
              <div className="text-blue-600 hover:underline cursor-pointer">
                <h3 className="text-lg font-medium leading-tight">
                  {truncateText(data.title, 60)}
                </h3>
              </div>
              <div className="text-green-700 dark:text-green-400 text-sm">
                {data.url}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {truncateText(data.description, 160)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Monitor className="h-3 w-3" />
            <span>Desktop View</span>
            <span>•</span>
            <span>{data.title.length}/60 chars</span>
            <span>•</span>
            <span>{data.description.length}/160 chars</span>
          </div>
        </div>
      </div>
    </div>
  );

  const FacebookPreview = () => (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Facebook className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Facebook Share</span>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {data.image && (
            <div className="aspect-[1.91/1] bg-gray-100 dark:bg-gray-800 relative">
              <img 
                src={data.image} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {!data.image && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2" />
                    <span className="text-sm">No image</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="p-3 space-y-2">
            <div className="text-xs text-gray-500 uppercase">
              {new URL(data.url).hostname}
            </div>
            <h4 className="font-semibold text-sm leading-tight">
              {truncateText(data.title, 100)}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {truncateText(data.description, 300)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              Comment
            </span>
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Share
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Open Graph
          </Badge>
        </div>
      </div>
    </div>
  );

  const TwitterPreview = () => (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Twitter className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Twitter/X Card</span>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {data.image && (
            <div className="aspect-[2/1] bg-gray-100 dark:bg-gray-800 relative">
              <img 
                src={data.image} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="p-3 space-y-1">
            <div className="text-xs text-gray-500">
              {new URL(data.url).hostname}
            </div>
            <h4 className="font-semibold text-sm leading-tight">
              {truncateText(data.title, 70)}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {truncateText(data.description, 200)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>💬 Reply</span>
            <span>🔄 Retweet</span>
            <span>❤️ Like</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Large Image
          </Badge>
        </div>
      </div>
    </div>
  );

  const LinkedInPreview = () => (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Linkedin className="h-4 w-4 text-blue-700" />
          <span className="text-sm text-gray-600 dark:text-gray-400">LinkedIn Share</span>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {data.image && (
            <div className="aspect-[1.91/1] bg-gray-100 dark:bg-gray-800 relative">
              <img 
                src={data.image} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="p-3 space-y-2">
            <h4 className="font-semibold text-sm leading-tight">
              {truncateText(data.title, 150)}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {truncateText(data.description, 250)}
            </p>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>{new URL(data.url).hostname}</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>👍 Like</span>
            <span>💬 Comment</span>
            <span>↗️ Share</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Article
          </Badge>
        </div>
      </div>
    </div>
  );

  const MobileGooglePreview = () => (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 max-w-sm mx-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Mobile Google</span>
        </div>
        
        <div className="space-y-1">
          <div className="text-blue-600">
            <h3 className="text-base font-medium leading-tight">
              {truncateText(data.title, 50)}
            </h3>
          </div>
          <div className="text-green-700 dark:text-green-400 text-sm">
            {data.url}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {truncateText(data.description, 120)}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{data.title.length}/50 chars</span>
            <span>•</span>
            <span>{data.description.length}/120 chars</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>SEO Preview</CardTitle>
          <CardDescription>
            See how your content will appear across different platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="twitter">Twitter</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>

            <TabsContent value="google" className="mt-6">
              <GooglePreview />
            </TabsContent>

            <TabsContent value="facebook" className="mt-6">
              <FacebookPreview />
            </TabsContent>

            <TabsContent value="twitter" className="mt-6">
              <TwitterPreview />
            </TabsContent>

            <TabsContent value="linkedin" className="mt-6">
              <LinkedInPreview />
            </TabsContent>

            <TabsContent value="mobile" className="mt-6">
              <MobileGooglePreview />
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">SEO Score Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Title Length:</span>
                <div className={`font-medium ${
                  data.title.length <= 60 ? 'text-green-600' : 
                  data.title.length <= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {data.title.length}/60
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Description:</span>
                <div className={`font-medium ${
                  data.description.length >= 150 && data.description.length <= 160 ? 'text-green-600' : 
                  data.description.length >= 120 && data.description.length <= 180 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {data.description.length}/160
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">URL Status:</span>
                <div className="text-green-600 font-medium">Valid</div>
              </div>
              <div>
                <span className="text-muted-foreground">Image:</span>
                <div className={`font-medium ${data.image ? 'text-green-600' : 'text-yellow-600'}`}>
                  {data.image ? 'Set' : 'Missing'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};