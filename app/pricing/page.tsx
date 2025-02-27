"use client";

import { PricingCard } from "@/components/molecules/pricing-card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type SubscriptionTier = {
  subscription_tier_id: string;
  subscription_tier_name: string;
  subscription_tier_description: string;
  subscription_tier_price: number;
  subscription_tier_features: Array<{ feature: string }>;
  subscription_tier_story_limit: number | null;
  subscription_tier_continuation_limit: number | null;
  subscription_tier_created_at: string;
  subscription_tier_updated_at: string | null;
};

const textVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function PricingPage() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchTiers() {
      try {
        // Add artificial delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const { data, error } = await supabase
          .from("subscription_tiers")
          .select("*")
          .order("subscription_tier_price");

        if (error) throw error;
        setTiers(data);
      } catch (error) {
        console.error("Error fetching tiers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTiers();
  }, [supabase]);

  return (
    <section className="container flex flex-col gap-12 py-24 relative">
      {/* Grid background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute h-full w-full stroke-gray-200/70 [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] dark:stroke-gray-800/70"
          aria-hidden="true"
          style={{
            maskImage: `
              linear-gradient(to right, transparent, white 20%, white 80%, transparent),
              linear-gradient(to bottom, white 80%, transparent)
            `,
            WebkitMaskImage: `
              linear-gradient(to right, transparent, white 20%, white 80%, transparent),
              linear-gradient(to bottom, white 80%, transparent)
            `,
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 40V.5H40" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth="0"
            fill="url(#grid-pattern)"
          />
        </svg>
      </div>

      <div className="text-center space-y-4">
        <motion.h1
          className="text-4xl font-medium tracking-tighter sm:text-5xl max-w-[20ch] text-center mx-auto"
          initial="hidden"
          animate="visible"
          variants={textVariants}
          custom={0}
        >
          Get started now and{" "}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            create magical stories
          </motion.span>{" "}
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            together
          </motion.span>
        </motion.h1>
        <motion.p
          className="text-xl text-muted-foreground max-w-[45ch] mx-auto"
          initial="hidden"
          animate="visible"
          variants={textVariants}
          custom={1}
        >
          Choose your storytelling journey. Start crafting wonderful tales for
          your children today.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {isLoading ? (
          <div className="col-span-3 text-center py-12 space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: 1,
                y: [-10, 10, -10],
              }}
              transition={{
                opacity: { duration: 0.3 },
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.3, // Start floating after fade-in
                },
              }}
              className="text-4xl inline-block"
            >
              📚
            </motion.span>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-xl text-muted-foreground"
            >
              Finding the best prices for you...
            </motion.p>
          </div>
        ) : tiers.length > 0 ? (
          tiers.map((tier, index) => (
            <PricingCard
              key={tier.subscription_tier_id}
              name={tier.subscription_tier_name}
              price={`$${tier.subscription_tier_price.toFixed(2)}`}
              description={tier.subscription_tier_description}
              features={
                tier.subscription_tier_features?.map(
                  ({ feature }) => feature
                ) ?? []
              }
              isPremium={index === 1}
              index={index}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-xl text-muted-foreground">
              Pricing plans coming soon...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
