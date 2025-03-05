"use client";

import { updateUserSubscription, fetchTiers } from "@/app/actions";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import type { Database } from "@/lib/database.types";
import * as React from "react";

type SubscriptionTier = Database["public"]["Tables"]["subscription_tiers"]["Row"];

export default function CheckoutPage({ params }: { params: Promise<{ tierId: string }> }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tier, setTier] = useState<SubscriptionTier | null>(null);
  const router = useRouter();
  const { tierId } = React.use(params);

  useEffect(() => {
    const loadTier = async () => {
      const tiers = await fetchTiers();
      const selectedTier = tiers.find((t) => t.subscription_tier_id === tierId);
      if (selectedTier) {
        setTier(selectedTier);
      } else {
        toast.error("Subscription plan not found");
        router.push("/pricing");
      }
    };

    loadTier();
  }, [tierId, router]);

  const handleApplePay = async () => {
    setIsProcessing(true);

    // Show processing toast
    const toastId = toast.loading("Processing your subscription...");

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update user's subscription
      const result = await updateUserSubscription(tierId);

      if (result.success) {
        toast.success("Welcome to your new plan! 🎉", {
          description: "Your subscription has been updated successfully.",
          id: toastId,
        });
        router.push("/profile");
      } else {
        throw new Error("Failed to update subscription");
      }
    } catch (error) {
      toast.error("Oops! Something went wrong", {
        description: "Don't worry, no charges were made. Please try again.",
        id: toastId,
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!tier) {
    return (
      <div className="container max-w-lg mx-auto py-12">
        <Card className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto py-12">
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium">Complete Your Purchase</h1>
        </div>

        {/* Subscription Details */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-medium">{tier.subscription_tier_name}</h2>
              <p className="text-sm text-muted-foreground">{tier.subscription_tier_description}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-medium">${tier.subscription_tier_price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">/month</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Features included:</p>
            <ul className="space-y-2">
              {(tier.subscription_tier_features as Array<{ feature: string }>)?.map(({ feature }, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 flex-shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-900">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">Note: This is a demo! No actual charges will be made. Your wallet is safe with us! Think of this as a magical subscription update.</p>
          </div>

          <button onClick={handleApplePay} disabled={isProcessing} className={`w-full h-12 rounded-lg bg-black text-white font-medium flex items-center justify-center gap-2 transition-opacity ${isProcessing ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}>
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8 1L16 15H0L8 1Z" fill="currentColor"></path>
                </svg>
                Pay with Vercel
              </>
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">By clicking the button above, you acknowledge this is a demo and no actual payment will be processed. Your subscription will be updated for demonstration purposes only.</p>
        </div>
      </Card>
    </div>
  );
}
