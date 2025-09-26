/**
 * New Blog Post Creation Page
 * Comprehensive interface for creating blog posts with AI content generation
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  Save,
  Send,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  Wand2,
  X,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  Tag,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { createBlogPost } from "@/services/blog";
import { getBlogCategories } from "@/services/blog";
import { getPlaceholderImage } from "@/utils/imageUtils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  summary: z.string().min(1, "Summary is required").max(300, "Summary must be less than 300 characters"),
  content: z.string().min(1, "Content is required"),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(["draft", "published"]),
  scheduledFor: z.date().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  generateContent: z.boolean().default(false),
  generateImage: z.boolean().default(false),
  keywords: z.string().optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

const NewBlogPostPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      categoryIds: [],
      tags: "",
      coverImage: "",
      status: "draft",
      generateContent: false,
      generateImage: false,
      keywords: "",
    },
  });

  const loadCategories = async () => {
    try {
      const categoriesData = await getBlogCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleGenerateContent = async () => {
    const title = form.getValues("title");
    const keywords = form.getValues("keywords");

    if (!title) {
      alert("Please enter a title first");
      return;
    }

    setGeneratingContent(true);
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const generatedContent = `# ${title}

This is AI-generated content for the blog post "${title}". This content is professionally written and optimized for SEO.

## Introduction

The timber industry in Bangalore has evolved significantly over the years, with New India Timber leading the way in providing premium quality wood products and exceptional customer service.

## Key Features

- **Premium Quality**: Only the finest timber sourced from sustainable forests
- **Expert Guidance**: Professional consultation for all your timber needs
- **Competitive Pricing**: Best rates in the Bangalore market
- **Timely Delivery**: Efficient logistics and delivery services

## Why Choose New India Timber?

1. **Experience**: Over 18 years in the timber industry
2. **Quality Assurance**: Rigorous quality control processes
3. **Customer Satisfaction**: 5000+ happy customers
4. **Sustainability**: Environmentally responsible sourcing

## Conclusion

New India Timber continues to set the standard for timber supply in Bangalore, offering unparalleled quality and service to meet all your construction and interior design needs.

*Keywords: ${keywords || title}*`;

      form.setValue("content", generatedContent);
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleGenerateImage = async () => {
    const title = form.getValues("title");

    if (!title) {
      alert("Please enter a title first");
      return;
    }

    setGeneratingImage(true);
    try {
      // Simulate AI image generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Use the static wood texture image as placeholder
      const imageUrl = getPlaceholderImage("wood");
      setImagePreview(imageUrl);
      form.setValue("coverImage", imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = form.getValues("categoryIds");
    let newCategories: string[];

    if (currentCategories.includes(categoryId)) {
      newCategories = currentCategories.filter(id => id !== categoryId);
    } else {
      newCategories = [...currentCategories, categoryId];
    }

    form.setValue("categoryIds", newCategories);
    setSelectedCategories(newCategories);
  };

  const onSubmit = async (values: BlogPostFormValues) => {
    setLoading(true);
    try {
      const userId = "admin-user"; // In a real app, get from auth context

      await createBlogPost({
        title: values.title,
        summary: values.summary,
        content: values.content,
        categoryIds: selectedCategories,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        coverImage: values.coverImage || undefined,
        status: values.status,
        scheduledFor: scheduledDate?.toISOString(),
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        aiGenerated: values.generateContent,
        aiPrompt: values.generateContent ? `Generate blog post about: ${values.title}` : undefined,
      }, userId);

      alert("Blog post created successfully!");
      navigate("/admin/blog");
    } catch (error) {
      console.error("Error creating blog post:", error);
      alert("Failed to create blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Create New Blog Post | New India Timber Admin</title>
        <meta name="description" content="Create a new blog post for New India Timber" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="keywords" content="create blog post, timber admin, content creation" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/blog")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog Management
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-forest-900">Create New Blog Post</h1>
              <p className="text-muted-foreground">Write and publish engaging content for your timber business</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="publish">Publish</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter blog post title..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Choose a compelling title that captures attention
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Summary *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write a brief summary of your blog post..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A concise summary that will appear in blog listings
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Content *</FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleGenerateContent}
                              disabled={generatingContent}
                              className="flex items-center gap-2"
                            >
                              {generatingContent ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Wand2 className="w-4 h-4" />
                              )}
                              {generatingContent ? "Generating..." : "Generate Content"}
                            </Button>
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="Write your blog post content here... Use markdown for formatting."
                              className="min-h-[400px] font-mono text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Write your blog post content. Use markdown for formatting.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <Label className="text-base font-medium">Categories *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className={cn(
                              "p-3 border rounded-lg cursor-pointer transition-colors",
                              selectedCategories.includes(category.id)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                            onClick={() => handleCategoryToggle(category.id)}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color || "#3b82f6" }}
                              />
                              <span className="font-medium">{category.name}</span>
                            </div>
                            {category.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {category.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      {selectedCategories.length === 0 && (
                        <p className="text-sm text-destructive mt-2">
                          Please select at least one category
                        </p>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter keywords separated by commas..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Keywords help with SEO and content generation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      SEO Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Custom title for search engines..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            If empty, the main title will be used (recommended: 50-60 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Custom description for search engines..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Appears in search results (recommended: 150-160 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Cover Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Generate AI Image</Label>
                        <Switch
                          checked={form.watch("generateImage")}
                          onCheckedChange={(checked) => form.setValue("generateImage", checked)}
                        />
                      </div>

                      {form.watch("generateImage") && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGenerateImage}
                          disabled={generatingImage}
                          className="w-full"
                        >
                          {generatingImage ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating Image...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4 mr-2" />
                              Generate Cover Image
                            </>
                          )}
                        </Button>
                      )}

                      {imagePreview && (
                        <div className="space-y-2">
                          <Label>Image Preview</Label>
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Cover preview"
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setImagePreview("");
                                form.setValue("coverImage", "");
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Image URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/image.jpg"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Or provide a custom image URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="publish" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Publish Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Draft - Save but don't publish
                                </div>
                              </SelectItem>
                              <SelectItem value="published">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Published - Make visible immediately
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose when to publish this post
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label>Schedule Publication (Optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !scheduledDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-sm text-muted-foreground">
                        If scheduled, the post will be published automatically at the selected date and time
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">Ready to Publish?</h4>
                        <p className="text-sm text-muted-foreground">
                          Review all sections before publishing
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate("/admin/blog")}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {loading ? "Creating..." : "Create Post"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default NewBlogPostPage;
