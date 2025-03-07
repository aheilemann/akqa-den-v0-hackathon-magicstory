"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OptionsGenerator } from "@/components/molecules/options-generator";
import { StoryGenerator } from "@/components/organisms/story-generator";
import { type StoryConfig, type Option } from "@/lib/types";
import { staticStory } from "@/lib/prompt/story/staticStory";
import { steps } from "./story-builder.mocks";
import { OptionsStatic } from "@/components/molecules/options-static";
import clsx from "clsx";
import { LimitReachedDialog } from "@/components/molecules/limit-reached-dialog";
import { useCreateContext } from "@/context/CreateStoryContext";
import { ImageData } from "@/types/create-story";

type PartialStoryConfig = {
  targetAge?: Option;
  setting?: Option;
  character?: Option;
  theme?: Option;
  idea?: string;
  imageData?: ImageData[];
};

export function StoryBuilder() {
  const USE_STATIC_STORY = process.env.NEXT_PUBLIC_USE_STATIC_STORY === "true";
  const USE_STATIC_OPTIONS =
    process.env.NEXT_PUBLIC_USE_STATIC_OPTIONS === "true";

  const { imageData, storyData } = useCreateContext();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [settings, setSettings] = useState<PartialStoryConfig>({});
  const [isButtonsSticky, setIsButtonsSticky] = useState(false);
  const [showStoryGenerator, setShowStoryGenerator] = useState(false);
  const [isLimitReachedOpen, setIsLimitReachedOpen] = useState(false);
  const [limitValue, setLimitValue] = useState(1);

  const contentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];

  const handleSelect = (key: string, option: Option) => {
    setSettings((prev) => ({ ...prev, [key]: option }));
  };

  const handleScroll = useCallback(() => {
    if (!contentRef.current || !buttonsRef.current) return;

    const contentBottom =
      contentRef.current.getBoundingClientRect().bottom + 50;
    const windowHeight = window.innerHeight;

    if (contentBottom < windowHeight) {
      setIsButtonsSticky(false);
    } else {
      setIsButtonsSticky(true);
    }
  }, []);

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

  const handleGenerateStory = () => {
    setShowStoryGenerator(true);
  };

  const handleLimitReached = (limit: number) => {
    setLimitValue(limit);
    setIsLimitReachedOpen(true);
  };

  useEffect(() => {
    if (USE_STATIC_STORY && !USE_STATIC_OPTIONS) {
      setSettings(staticStory);
    }
  }, [USE_STATIC_STORY]);

  useEffect(() => {
    if (imageData) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        imageData: imageData
      }));
    }
  }, [imageData]);

  useEffect(() => {
    if (storyData?.idea) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        idea: storyData.idea
      }));
    }
  }, [storyData?.idea]);

  useEffect(() => {
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <motion.section variants={container} initial="hidden" animate="show">
      {showStoryGenerator && (
        <div>
          <StoryGenerator
            settings={settings as StoryConfig}
            onLimitReached={handleLimitReached}
          />
          <LimitReachedDialog
            isOpen={isLimitReachedOpen}
            onClose={() => setIsLimitReachedOpen(false)}
            limit={limitValue}
          />
        </div>
      )}

      {!showStoryGenerator && (
        <Card className="max-w-4xl mx-auto p-6">
          <motion.div variants={item} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-1">
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
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`
                }}
              />
            </div>
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              ref={contentRef}
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {USE_STATIC_OPTIONS ? (
                <OptionsStatic
                  options={currentStepData.options}
                  onSelect={(option) =>
                    handleSelect(currentStepData.key, option)
                  }
                  selectedOption={
                    (settings[
                      currentStepData.key as keyof PartialStoryConfig
                    ] as Option | null) ?? null
                  }
                />
              ) : (
                <OptionsGenerator
                  prompt={currentStepData.prompt}
                  onSelect={(option) =>
                    handleSelect(currentStepData.key, option)
                  }
                  selectedOption={
                    (settings[
                      currentStepData.key as keyof PartialStoryConfig
                    ] as Option | null) ?? null
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
          <motion.div
            ref={buttonsRef}
            variants={item}
            className={clsx(
              "flex justify-between mt-10",
              isButtonsSticky
                ? "fixed bg-white bottom-0 left-0 right-0 px-6 md:px-8 lg:px-12 py-4 md:py-6 lg:py-8 shadow-[0_0px_30px_rgba(0,0,0,0.10)] z-10 max-w-4xl mx-auto"
                : ""
            )}
          >
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              onClick={
                currentStep === steps.length - 1
                  ? handleGenerateStory
                  : handleNext
              }
              disabled={
                !settings[currentStepData.key as keyof PartialStoryConfig]
              }
            >
              {currentStep === steps.length - 1 ? "Generate story!" : "Next"}
            </Button>
          </motion.div>
          {isButtonsSticky && <div className="h-16" />}{" "}
        </Card>
      )}
    </motion.section>
  );
}

export type { PartialStoryConfig };
