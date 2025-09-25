import { useEffect, useState } from "react";
import { getUsageStatistics, getRateLimitStatus } from "@/services/ai-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AIUsageStatsProps {
  className?: string;
}

type UsageState = {
  totalRequests: number;
  totalTokens: number;
  monthlySpend: number;
  lastUsed?: string;
  averageCostPerToken: number;
};

type RateLimitState = Awaited<ReturnType<typeof getRateLimitStatus>>;

const DEFAULT_USAGE: UsageState = {
  totalRequests: 0,
  totalTokens: 0,
  monthlySpend: 0,
  averageCostPerToken: 0,
  lastUsed: undefined,
};

export function AIUsageStats({ className }: AIUsageStatsProps) {
  const [usage, setUsage] = useState<UsageState>(DEFAULT_USAGE);
  const [rateLimit, setRateLimit] = useState<RateLimitState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        setIsLoading(true);
        const [usageResult, rateLimitResult] = await Promise.all([
          getUsageStatistics(),
          getRateLimitStatus(),
        ]);

        if (isMounted) {
          setUsage(usageResult ?? DEFAULT_USAGE);
          setRateLimit(rateLimitResult ?? null);
        }
      } catch (error) {
        console.error("Failed to load AI usage stats", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-forest-900">
          Gemini Usage Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track AI content generation activity for the Bangalore timber team.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-2xl bg-timber-50/80" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Total Requests"
              value={usage.totalRequests.toLocaleString()}
              description="Gemini prompts generated this month"
            />
            <StatCard
              label="Tokens Used"
              value={usage.totalTokens.toLocaleString()}
              description="Approximate token count across generations"
            />
            <StatCard
              label="Monthly Spend"
              value={`₹${(usage.monthlySpend * 83).toFixed(2)}`}
              description="Estimated cost in INR"
            />
            <StatCard
              label="Cost per Token"
              value={`₹${(usage.averageCostPerToken * 83).toFixed(4)}`}
              description="Average cost for each token generated"
            />
          </div>
        )}

        {rateLimit && (
          <div className="mt-6 space-y-3 rounded-2xl border border-timber-100 bg-timber-50/60 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-forest-900">Rate limits</h3>
              <Badge variant="outline" className="rounded-full border-timber-200 text-[11px] font-medium text-timber-700">
                Gemini Pro
              </Badge>
            </div>

            <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
              <RateLimitItem
                label="Minute"
                used={rateLimit.requestsPerMinute.used}
                limit={rateLimit.requestsPerMinute.limit}
                resetsAt={rateLimit.resetTimes.minute}
              />
              <RateLimitItem
                label="Hour"
                used={rateLimit.requestsPerHour.used}
                limit={rateLimit.requestsPerHour.limit}
                resetsAt={rateLimit.resetTimes.hour}
              />
              <RateLimitItem
                label="Day"
                used={rateLimit.requestsPerDay.used}
                limit={rateLimit.requestsPerDay.limit}
                resetsAt={rateLimit.resetTimes.day}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  description: string;
}

function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-timber-100 bg-white px-4 py-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-forest-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

interface RateLimitItemProps {
  label: string;
  used: number;
  limit: number;
  resetsAt?: string;
}

function RateLimitItem({ label, used, limit, resetsAt }: RateLimitItemProps) {
  const remaining = Math.max(limit - used, 0);

  return (
    <div className="rounded-xl border border-transparent bg-white/80 p-3 shadow-sm">
      <p className="text-xs font-semibold text-forest-900">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm font-semibold text-timber-700">{remaining}</span>
        <span className="text-xs text-muted-foreground">remaining</span>
      </div>
      {resetsAt && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          Resets at {new Date(resetsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}
    </div>
  );
}
