/**
 * Admin Dashboard Page
 * Comprehensive dashboard for managing the Bangalore timber business
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
// Layout is handled by ProtectedAdmin wrapper
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIUsageStats } from "@/components/ai/AIUsageStats";
import { ContentGenerationHistory } from "@/components/ai/ContentGenerationHistory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavigationIcon } from "@/components/navigation/Icon";
import { cn } from "@/lib/utils";

interface DashboardStats {
  blog: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
  };
  ai: {
    totalRequests: number;
    monthlySpend: number;
    isEnabled: boolean;
  };
  legal: {
    totalPages: number;
    aiGenerated: number;
    legallyReviewed: number;
  };
  media: {
    totalAssets: number;
    totalSize: number;
    optimizedAssets: number;
  };
}

const DEFAULT_STATS: DashboardStats = {
  blog: { totalPosts: 0, publishedPosts: 0, draftPosts: 0, totalViews: 0 },
  ai: { totalRequests: 0, monthlySpend: 0, isEnabled: false },
  legal: { totalPages: 0, aiGenerated: 0, legallyReviewed: 0 },
  media: { totalAssets: 0, totalSize: 0, optimizedAssets: 0 },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setStats({
        blog: { totalPosts: 12, publishedPosts: 8, draftPosts: 4, totalViews: 1250 },
        ai: { totalRequests: 45, monthlySpend: 15.75, isEnabled: true },
        legal: { totalPages: 4, aiGenerated: 4, legallyReviewed: 2 },
        media: { totalAssets: 28, totalSize: 125000000, optimizedAssets: 24 },
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | New India Timber Management</title>
        <meta name="description" content="Administrative dashboard for managing New India Timber's Bangalore operations" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="keywords" content="admin dashboard, timber management, new india timbers admin" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-900">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your Bangalore timber business operations</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="ai">AI Tools</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Blog Posts"
                value={stats.blog.totalPosts.toString()}
                description={`${stats.blog.publishedPosts} published, ${stats.blog.draftPosts} drafts`}
                icon="newspaper"
                isLoading={isLoading}
              />
              <StatsCard
                title="AI Requests"
                value={stats.ai.totalRequests.toString()}
                description={`₹${(stats.ai.monthlySpend * 83).toFixed(2)} monthly spend`}
                icon="briefcase"
                isLoading={isLoading}
              />
              <StatsCard
                title="Legal Pages"
                value={stats.legal.totalPages.toString()}
                description={`${stats.legal.legallyReviewed} reviewed, ${stats.legal.aiGenerated} AI-generated`}
                icon="scale"
                isLoading={isLoading}
              />
              <StatsCard
                title="Media Assets"
                value={stats.media.totalAssets.toString()}
                description={`${(stats.media.totalSize / 1000000).toFixed(1)}MB total, ${stats.media.optimizedAssets} optimized`}
                icon="package"
                isLoading={isLoading}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <Button variant="outline" className="justify-start">
                    <NavigationIcon name="newspaper" className="mr-2" />
                    Create Blog Post
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <NavigationIcon name="briefcase" className="mr-2" />
                    Generate AI Content
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <NavigationIcon name="scale" className="mr-2" />
                    Update Legal Pages
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <NavigationIcon name="package" className="mr-2" />
                    Manage Media
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Content Generation</span>
                    <Badge variant={stats.ai.isEnabled ? "default" : "secondary"}>
                      {stats.ai.isEnabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blog System</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Media Optimization</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SEO Monitoring</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage blog posts, categories, and publishing workflow for Bangalore timber content.
                  </p>
                  <Button
                    onClick={() => navigate('/admin/blog')}
                    className="w-full justify-start"
                  >
                    <NavigationIcon name="newspaper" className="mr-2" />
                    Manage Blog Posts
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Legal Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate and manage legal policies compliant with Karnataka regulations.
                  </p>
                  <Button className="w-full">Manage Legal Content</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-forest-900">AI Tools & Configuration</h2>
              <Link to="/admin/ai-settings">
                <Button variant="outline" className="flex items-center gap-2">
                  <NavigationIcon name="briefcase" size={16} />
                  Configure AI Settings
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <AIUsageStats />
              <ContentGenerationHistory />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure AI settings, navigation menus, and system preferences.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
  isLoading: boolean;
}

function StatsCard({ title, value, description, icon, isLoading }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <NavigationIcon name={icon} className="text-timber-600" size={20} />
          {isLoading ? (
            <div className="h-6 w-16 animate-pulse rounded bg-timber-100" />
          ) : (
            <span className="text-2xl font-bold text-forest-900">{value}</span>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-sm font-medium text-forest-900">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminDashboard;
