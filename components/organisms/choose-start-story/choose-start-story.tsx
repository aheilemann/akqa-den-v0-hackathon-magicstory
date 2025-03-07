"use client";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useCreateContext } from "@/context/CreateStoryContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// Separate component that uses useSearchParams
const StartStoryContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setStoryData } = useCreateContext();

  // Effect to get the story idea from URL parameters and set it in context
  useEffect(() => {
    const storyIdeaFromURL = searchParams.get("idea");
    if (storyIdeaFromURL) {
      setStoryData({ idea: storyIdeaFromURL });
    }
  }, [searchParams, setStoryData]);

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

  const handleStartWithDrawing = () => {
    router.push("/create/image");
  };

  const handleStartWithoutDrawing = () => {
    router.push("/create/story");
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="container mx-auto px-4 py-8"
    >
      <Card className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex flex-col justify-between items-center mb-4">
            <h2 className="w-full text-2xl font-bold">
              Do you want to start your story with your own images?
            </h2>
            <p className="w-full text-muted-foreground">
              Please choose how you want to start your story
            </p>
          </div>
        </div>

        <motion.div
          variants={item}
          className="flex flex-row w-fll gap-6 min-h-60"
        >
          <Card
            className="flex justify-center items-center w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleStartWithDrawing}
          >
            <div>
              <h4 className="text-xl tracking-tighter">Yes, please!</h4>
            </div>
          </Card>

          <Card
            className="flex justify-center items-center w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleStartWithoutDrawing}
          >
            <div>
              <h4 className="text-xl tracking-tighter">No, thanks</h4>
            </div>
          </Card>
        </motion.div>
      </Card>
    </motion.section>
  );
};

const ChooseStartStory = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StartStoryContent />
    </Suspense>
  );
};

export { ChooseStartStory };
