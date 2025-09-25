import { useEffect, useState } from "react";
import { getContentHistory } from "@/services/ai-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ContentGenerationHistoryProps {
  className?: string;
  userId?: string;
}

type HistoryEntry = Awaited<ReturnType<typeof getContentHistory>>["requests"][number];

type HistoryState = {
  requests: HistoryEntry[];
  isLoading: boolean;
};

const DEFAULT_STATE: HistoryState = {
  requests: [],
  isLoading: true,
};

export function ContentGenerationHistory({ className, userId = "current-user" }: ContentGenerationHistoryProps) {
  const [state, setState] = useState<HistoryState>(DEFAULT_STATE);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        const response = await getContentHistory(userId, { limit: 25 });

        if (isMounted) {
          setState({
            requests: response.requests,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Failed to load AI content history", error);
        if (isMounted) {
          setState({ requests: [], isLoading: false });
        }
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return (
    <Card className={cn("flex h-full flex-col", className)}>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-forest-900">
          AI Content Activity
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
          View all
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        {state.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-2xl bg-timber-50/80" />
            ))}
          </div>
        ) : state.requests.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-timber-200 bg-timber-50/60 p-6 text-center text-sm text-muted-foreground">
            No AI content requests found. Generate your first draft to see the activity timeline.
          </div>
        ) : (
          <ScrollArea className="h-[380px]">
            <div className="space-y-3 pr-4">
              {state.requests.map((request) => (
                <div
                  key={request.id}
                  className="space-y-2 rounded-2xl border border-timber-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full border-timber-200 text-[11px] font-medium">
                        {request.contentType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <Badge className="rounded-full bg-timber-600 text-[11px] hover:bg-timber-700">
                      {request.metadata.tokensUsed.toLocaleString()} tokens
                    </Badge>
                  </div>

                  <p className="line-clamp-2 text-sm text-forest-900">
                    {request.description}
                  </p>

                  <pre className="block whitespace-pre-wrap rounded-xl bg-timber-50/80 p-3 text-xs text-muted-foreground">
                    {request.generatedContent.slice(0, 240)}
                    {request.generatedContent.length > 240 ? "…" : ""}
                  </pre>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
