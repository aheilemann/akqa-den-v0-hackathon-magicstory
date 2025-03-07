import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SubscriptionTierFeature } from "@/lib/database.types";

export type PricingTierProps = {
  name: string;
  price: string;
  description: string;
  features: SubscriptionTierFeature[];
  isPremium?: boolean;
  index: number;
  isCurrentPlan?: boolean;
  tierId: string;
};

export function PricingCard({ name, price, description, features, isPremium = false, index, isCurrentPlan = false, tierId }: PricingTierProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.2 + index * 0.1,
        ease: "easeOut",
      }}
    >
      <Card
        className={cn(
          "relative flex flex-col h-full",
          "bg-gradient-to-b from-background/50 to-muted/20",
          isPremium && "from-purple-100 via-purple-50 to-background border-purple-200 shadow-xl shadow-purple-100 dark:from-purple-500/20 dark:via-purple-400/10 dark:to-background dark:border-purple-500/30 dark:shadow-purple-500/10"
        )}
      >
        {isPremium && (
          <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-1">
            <p className="text-sm text-white font-medium">Most Popular</p>
          </div>
        )}
        <CardHeader>
          <h3 className={cn("text-2xl font-medium", isPremium && "text-purple-600 dark:text-purple-300")}>{name}</h3>
          <div className="flex items-baseline">
            <span className={cn("text-4xl font-medium", isPremium && "text-purple-600 dark:text-purple-300")}>{price}</span>
            {price !== "Free" && <span className="text-sm text-muted-foreground ml-2">/month</span>}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground">{description}</p>
          <ul className="mt-6 space-y-4 flex-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Sparkles className={cn("h-4 w-4 flex-shrink-0", isPremium ? "text-purple-500" : "text-primary")} />
                <span className="text-sm">{feature.feature}</span>
                {feature.comingSoon && (
                  <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 bg-purple-300 dark:text-black">
                    Coming Soon
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="mt-auto pt-6">
          {isCurrentPlan ? (
            <Button className={cn("w-full", isPremium && "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0")} disabled>
              Current Plan
            </Button>
          ) : (
            <Link href={`/checkout/${tierId}`} className="w-full">
              <Button className={cn("w-full", isPremium && "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0")} variant={isPremium ? "default" : "outline"}>
                Start Creating Stories
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
