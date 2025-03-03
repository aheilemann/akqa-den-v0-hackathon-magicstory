"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OptionsGenerator } from "@/components/molecules/options-generator";
import { StoryGenerator } from "@/components/organisms/story-generator";
import { type StoryConfig, type Option } from "@/lib/types";
import { staticStory } from "@/lib/prompt/story/staticStory";
import { steps } from "./story-builder.mocks";
import { OptionsStatic } from "@/components/molecules/options-static";

type PartialStoryConfig = {
  setting?: Option;
  character?: Option;
  theme?: Option;
};

const StoryBuilder = () => {
  const USE_STATIC_STORY = process.env.NEXT_PUBLIC_USE_STATIC_STORY === "true";
  const USE_STATIC_OPTIONS =
    process.env.NEXT_PUBLIC_USE_STATIC_OPTIONS === "true";
  const [currentStep, setCurrentStep] = useState(0);
  const [settings, setSettings] = useState<PartialStoryConfig>({});

  useEffect(() => {
    if (USE_STATIC_STORY && !USE_STATIC_OPTIONS) {
      setSettings(staticStory);
    }
  }, [USE_STATIC_STORY]);

  const handleSelect = (key: string, option: Option) => {
    setSettings((prev) => ({ ...prev, [key]: option }));
  };

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (settings.setting && settings.character && settings.theme) {
    return <StoryGenerator settings={settings as StoryConfig} />;
  }

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
            <p className="text-muted-foreground">
              {currentStepData.description}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {USE_STATIC_OPTIONS ? (
            <OptionsStatic
              options={currentStepData.options}
              onSelect={(option) => handleSelect(currentStepData.key, option)}
              selectedOption={
                settings[currentStepData.key as keyof PartialStoryConfig] ??
                null
              }
            />
          ) : (
            <OptionsGenerator
              prompt={currentStepData.prompt}
              onSelect={(option) => handleSelect(currentStepData.key, option)}
              selectedOption={
                settings[currentStepData.key as keyof PartialStoryConfig] ??
                null
              }
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!settings[currentStepData.key as keyof PartialStoryConfig]}
        >
          {currentStep === steps.length - 1 ? "Generate Story" : "Next"}
        </Button>
      </div>
    </Card>
  );
};

export { StoryBuilder, type PartialStoryConfig };
