import { useEffect, useState } from "react";
import type { AIPromptTemplate, AIContentCategory } from "@/types/ai";
import { getPromptTemplates } from "@/services/ai-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface AIPromptTemplatesProps {
  onTemplateSelect?: (template: AIPromptTemplate) => void;
  className?: string;
  defaultCategory?: AIContentCategory;
}

type FilteringState = {
  search: string;
  selectedCategory: AIContentCategory | "all";
};

export function AIPromptTemplates({
  onTemplateSelect,
  className,
  defaultCategory = "blog",
}: AIPromptTemplatesProps) {
  const [templates, setTemplates] = useState<AIPromptTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilteringState>({
    search: "",
    selectedCategory: defaultCategory,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadTemplates() {
      try {
        setIsLoading(true);
        const data = await getPromptTemplates();

        if (isMounted) {
          setTemplates(data);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Unable to load prompt templates",
          description: "Please verify AI settings and try again.",
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = filters.selectedCategory === "all" || template.category === filters.selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(filters.search.toLowerCase())
      || template.description.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const categories: Array<{ label: string; value: AIContentCategory | "all" }> = [
    { label: "All", value: "all" },
    { label: "Blog", value: "blog" },
    { label: "Product", value: "product" },
    { label: "Legal", value: "legal" },
    { label: "Marketing", value: "marketing" },
  ];

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-forest-900">
          Prompt Library
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Curated AI prompts tailored for the Bangalore timber business.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={filters.search}
          onChange={(event) => setFilters((prev) => ({
            ...prev,
            search: event.target.value,
          }))}
          placeholder="Search templates by name or description..."
        />

        <Tabs
          value={filters.selectedCategory}
          onValueChange={(value) => setFilters((prev) => ({
            ...prev,
            selectedCategory: value as FilteringState["selectedCategory"],
          }))}
        >
          <TabsList className="grid grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={filters.selectedCategory} className="mt-4 space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-2xl bg-timber-50/80"
                  />
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-timber-200 p-6 text-center text-sm text-muted-foreground">
                No prompt templates found. Try adjusting your filters.
              </div>
            ) : (
              <ScrollArea className="h-[360px]">
                <div className="space-y-3 pr-4">
                  {filteredTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => onTemplateSelect?.(template)}
                      className="w-full rounded-2xl border border-timber-100 bg-white p-4 text-left transition hover:border-timber-200 hover:bg-timber-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-forest-900">
                            {template.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="rounded-full border-timber-200 text-[11px] font-medium">
                          {template.category}
                        </Badge>
                      </div>
                      <pre className="mt-3 block whitespace-pre-wrap rounded-xl bg-timber-50/70 p-3 text-xs text-left font-mono leading-relaxed text-forest-900">
                        {template.prompt}
                      </pre>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
