import { useState } from "react";
import type { BlogPost, BlogPostSEO } from "@/types/blog";
import { generateContent } from "@/services/ai-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface BlogPostEditorProps {
  initialValue?: Partial<BlogPost>;
  onSave?: (payload: BlogPostEditorState) => Promise<void> | void;
  onCancel?: () => void;
}

export interface BlogPostEditorState {
  title: string;
  summary: string;
  content: string;
  coverImage?: string | null;
  categories: string[];
  tags: string[];
  seo: Partial<BlogPostSEO>;
  status: BlogPost["status"];
  aiGenerated?: boolean;
  aiPrompt?: string;
}

const DEFAULT_FORM_STATE: BlogPostEditorState = {
  title: "",
  summary: "",
  content: "",
  coverImage: null,
  categories: ["timber-tips-bangalore"],
  tags: ["Bangalore", "Timber", "Guides"],
  seo: {},
  status: "draft",
  aiGenerated: false,
  aiPrompt: "",
};

export function BlogPostEditor({ initialValue, onSave, onCancel }: BlogPostEditorProps) {
  const [formState, setFormState] = useState<BlogPostEditorState>({
    ...DEFAULT_FORM_STATE,
    ...initialValue,
    seo: {
      ...DEFAULT_FORM_STATE.seo,
      ...initialValue?.seo,
    },
  });
  const [aiDescription, setAiDescription] = useState<string>("Generate a guide about premium teak wood maintenance for Bangalore homes");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldChange = <K extends keyof BlogPostEditorState>(field: K, value: BlogPostEditorState[K]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSeoChange = (field: keyof BlogPostSEO, value: string) => {
    setFormState((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value,
      },
    }));
  };

  const handleGenerateContent = async () => {
    if (!aiDescription.trim()) {
      toast({
        title: "Add a description",
        description: "Provide a short description before generating content.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const response = await generateContent(aiDescription, "blog", {
        context: {
          businessFocus: "Bangalore Karnataka timber business",
          tone: "professional",
          length: "long",
        },
      });

      setFormState((prev) => ({
        ...prev,
        content: response.content,
        aiGenerated: true,
        aiPrompt: aiDescription,
      }));

      toast({
        title: "AI content generated",
        description: "Review and refine the content before publishing.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to generate content",
        description: "Please verify your Gemini API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.title.trim().length === 0) {
      toast({
        title: "Title is required",
        description: "Add a descriptive title for this blog post.",
        variant: "destructive",
      });
      return;
    }

    if (formState.summary.trim().length < 40) {
      toast({
        title: "Summary is too short",
        description: "Write a summary focusing on Bangalore timber context (min 40 characters).",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      await onSave?.(formState);
      toast({
        title: "Changes saved",
        description: "Your blog post has been updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to save",
        description: "Check required fields and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-3xl border border-timber-100 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formState.title}
                onChange={(event) => handleFieldChange("title", event.target.value)}
                placeholder="e.g. Why Bangalore architects prefer Burma Teak"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={formState.summary}
                onChange={(event) => handleFieldChange("summary", event.target.value)}
                placeholder="Write a concise overview highlighting Karnataka context..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formState.content}
                onChange={(event) => handleFieldChange("content", event.target.value)}
                placeholder="Compose the full article focusing on Bangalore timber best practices..."
                rows={18}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="space-y-2 rounded-2xl border border-timber-100 bg-timber-50/40 p-4">
              <Label>AI content helper</Label>
              <Textarea
                value={aiDescription}
                onChange={(event) => setAiDescription(event.target.value)}
                placeholder="Describe what the article should cover"
                rows={4}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate with Gemini"}
              </Button>
              <p className="text-xs text-muted-foreground">
                AI suggestions are tuned for Bangalore/Karnataka timber business context. Review before publishing.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-timber-100 bg-white p-4">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {formState.categories.map((category) => (
                  <Badge key={category} variant="outline" className="rounded-full border-timber-200">
                    {category.replace(/-/g, " ")}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Categories help group Bangalore-focused articles for SEO and navigation.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-timber-100 bg-white p-4">
              <Label>SEO settings</Label>
              <Input
                value={formState.seo?.metaTitle ?? ""}
                onChange={(event) => handleSeoChange("metaTitle", event.target.value)}
                placeholder="Meta title"
              />
              <Textarea
                value={formState.seo?.metaDescription ?? ""}
                onChange={(event) => handleSeoChange("metaDescription", event.target.value)}
                placeholder="Meta description"
                rows={3}
              />
              <Input
                value={formState.seo?.canonicalUrl ?? ""}
                onChange={(event) => handleSeoChange("canonicalUrl", event.target.value)}
                placeholder="Canonical URL"
              />
              <div className="flex items-center justify-between rounded-xl bg-timber-50/60 px-3 py-2">
                <Label htmlFor="aiGenerated" className="text-xs text-muted-foreground">
                  AI-assisted post
                </Label>
                <Switch
                  id="aiGenerated"
                  checked={Boolean(formState.aiGenerated)}
                  onCheckedChange={(checked) => handleFieldChange("aiGenerated", checked)}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
