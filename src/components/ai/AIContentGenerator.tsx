import { useState } from "react";
import { generateContent } from "@/services/ai-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

export const DEFAULT_EXAMPLES = [
  "Write a blog intro about sustainable timber sourcing in Bangalore",
  "Generate a product description for premium Burma teak doors",
  "Draft a privacy policy section for timber deliveries in Karnataka",
  "Create marketing copy for plywood wholesale in Bengaluru",
];

interface AIContentGeneratorProps {
  onGenerate?: (content: string) => void;
  className?: string;
}

export function AIContentGenerator({ onGenerate, className }: AIContentGeneratorProps) {
  const [description, setDescription] = useState<string>(DEFAULT_EXAMPLES[0]);
  const [contentType, setContentType] = useState<string>("blog");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: "Add a description",
        description: "Describe what you need before generating content.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const response = await generateContent(description, contentType as any, {
        context: {
          businessFocus: "Bangalore Karnataka timber business",
          tone: "professional",
          length: "medium",
        },
      });

      setGeneratedContent(response.content);
      onGenerate?.(response.content);

      toast({
        title: "Content generated",
        description: "Review the AI output before publishing.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to generate content",
        description: "Please check your Gemini API configuration and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleSelect = (example: string) => {
    setDescription(example);
  };

  return (
    <section className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-forest-900">
          AI Content Generator
        </h2>
        <p className="text-sm text-muted-foreground">
          Use Google Gemini to draft content for Bangalore-focused timber posts, product copy, and legal policies.
        </p>
      </div>

      <div className="rounded-3xl border border-timber-100 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="description">Describe what you need</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="e.g. Compose a blog post about teak maintenance during monsoon season in Bangalore"
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Label>A few Bangalore-focused examples</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {DEFAULT_EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => handleExampleSelect(example)}
                    className="rounded-xl border border-transparent bg-timber-50 px-4 py-3 text-left text-xs font-medium text-forest-900 transition hover:border-timber-200 hover:bg-timber-100"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-timber-100 bg-timber-50/40 p-4">
            <div className="space-y-2">
              <Label htmlFor="contentType">Content type</Label>
              <Input
                id="contentType"
                value={contentType}
                onChange={(event) => setContentType(event.target.value)}
                placeholder="blog | product | legal | marketing"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Use "blog", "product", "legal", or "marketing" to guide the Gemini prompt.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate with Gemini"}
            </Button>

            <p className="text-xs text-muted-foreground">
              AI will produce long-form text tuned for Karnataka timber audience. Review and refine before saving.
            </p>
          </div>
        </div>
      </div>

      {generatedContent && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Generated draft
          </h3>
          <div className="rounded-3xl border border-timber-100 bg-white p-6">
            <Textarea
              value={generatedContent}
              onChange={(event) => setGeneratedContent(event.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>
        </div>
      )}
    </section>
  );
}
