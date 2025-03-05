"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { OptionCard } from "@/components/molecules/option-card";
import { type Option } from "@/lib/types";

const continuationOptions = [
  {
    name: "Theme-based Continuation",
    description: "Continue the story while maintaining the same theme and moral lessons",
    emoji: "🎭",
  },
  {
    name: "Character-focused",
    description: "Expand on a specific character's journey",
    emoji: "👤",
  },
  {
    name: "New Adventure",
    description: "Same characters but in a completely new setting",
    emoji: "🌟",
  },
  {
    name: "Custom Prompt",
    description: "Provide your own direction for the continuation",
    emoji: "✨",
  },
] as Option[];

export default function StoryContinuationPage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = use(params);
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    if (option.name !== "Custom Prompt") {
      setCustomPrompt("");
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = async () => {
    if (!selectedOption) return;

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/stories/${storyId}/continue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedOption.name.toLowerCase().split(" ")[0],
          customPrompt: selectedOption.name === "Custom Prompt" ? customPrompt : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate continuation");
      }

      const data = await response.json();
      router.push(`/story/${storyId}`);
    } catch (error) {
      console.error("Error generating continuation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold tracking-tight">Continue Your Story</h2>
          <p className="text-muted-foreground text-md">Choose how you would like to continue your story</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {continuationOptions.map((option: Option) => (
          <OptionCard key={option.name} option={option} onSelectAction={handleSelect} isSelected={selectedOption?.name === option.name} />
        ))}
      </div>

      <AnimatePresence>
        {selectedOption?.name === "Custom Prompt" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mt-6 p-2">
            <Label htmlFor="custom-prompt" className="mb-2 block">
              Custom Prompt
            </Label>
            <Textarea id="custom-prompt" placeholder="Describe how you want the story to continue..." value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} className="min-h-[100px] bg-background/50 backdrop-blur-sm transition-colors focus:bg-background" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={isGenerating || !selectedOption || (selectedOption.name === "Custom Prompt" && !customPrompt.trim())}>
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Continuation"
          )}
        </Button>
      </div>
    </Card>
  );
}
