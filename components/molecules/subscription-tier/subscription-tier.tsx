import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/lib/database.types";
import Link from "next/link";
import { InfinityIcon, BookOpen, BookPlus } from "lucide-react";

export type SubscriptionTierProps = {
  subscription: Database["public"]["Tables"]["subscription_tiers"]["Row"];
  usage: {
    used: number;
    total: number;
    continuations: {
      used: number;
      total: number | null;
    };
  };
};

const tierEmojis: Record<string, string> = {
  free: "🌱",
  plus: "⭐",
  premium: "💫",
};

function UsageBar({ icon, label, used, total }: { icon: React.ReactNode; label: string; used: number; total: number | null }) {
  const isUnlimited = total === null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      {isUnlimited ? (
        <div className="flex items-center gap-2 text-sm">
          <InfinityIcon className="h-4 w-4 text-purple-500" />
          <span className="text-xs text-muted-foreground">Unlimited</span>
        </div>
      ) : (
        <>
          <Progress value={(used / total) * 100} className="h-2" />
          <div className="flex items-center">
            <p className="text-xs text-muted-foreground">
              {used} of {total}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export function SubscriptionTier({ subscription, usage }: SubscriptionTierProps) {
  return (
    <div className="flex flex-col items-center md:items-start gap-2 w-full">
      <div className="flex flex-col items-end gap-2 w-full">
        <Badge variant="secondary" className="h-6 gap-1 px-3 text-sm">
          <span>{tierEmojis[subscription.subscription_tier_name.toLowerCase()] || "✨"}</span>
          <span>{subscription.subscription_tier_name}</span>
        </Badge>
        <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground">
          Upgrade plan
        </Link>
      </div>

      <div className="w-full space-y-6">
        <UsageBar icon={<BookOpen className="h-4 w-4" />} label="Story Generations" used={usage.used} total={subscription.subscription_tier_story_limit} />

        <UsageBar icon={<BookPlus className="h-4 w-4" />} label="Story Continuations" used={usage.continuations.used} total={usage.continuations.total} />
      </div>
    </div>
  );
}
