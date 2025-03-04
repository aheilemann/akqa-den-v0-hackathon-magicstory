import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/lib/database.types";
import Link from "next/link";

export type SubscriptionTierProps = {
  subscription: Database["public"]["Tables"]["subscription_tiers"]["Row"];
  usage: {
    used: number;
    total: number;
  };
};

const tierEmojis: Record<string, string> = {
  free: "🌱",
  pro: "⭐",
  premium: "💫",
};

export function SubscriptionTier({
  subscription,
  usage,
}: SubscriptionTierProps) {
  return (
    <div className="flex flex-col items-center md:items-start gap-2 w-full pt-12">
      <Badge variant="secondary" className="h-6 gap-1 px-3 text-sm">
        <span>{tierEmojis[subscription.subscription_tier_id] || "✨"}</span>
        <span>{subscription.subscription_tier_name}</span>
      </Badge>

      <div className="w-full space-y-4">
        <Progress value={(usage.used / usage.total) * 100} className="h-2" />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground text-center">
            {usage.used} of {usage.total} generations used today
          </p>
          <Link href="/pricing" className="text-xs">
            Upgrade plan
          </Link>
        </div>
      </div>
    </div>
  );
}
