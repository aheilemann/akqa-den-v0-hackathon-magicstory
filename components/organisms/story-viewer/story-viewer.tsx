"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Story } from "@/components/organisms/story-list/story-list";
import { motion, AnimatePresence } from "framer-motion";

type StoryViewerProps = {
  story: Story;
};

export function StoryViewer({ story }: StoryViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const content = story.story_content;
  const pages = content.pages || [];
  const currentPageData = pages[currentPage];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <main className="flex-1 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{story.story_title}</h1>
          <p className="text-muted-foreground">{content.summary}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-8">
          <div className="bg-primary rounded-full h-2 transition-all duration-300" style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }} />
        </div>

        {/* Story Page */}
        <Card className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={currentPage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="relative aspect-square">{currentPageData.imageUrl && <Image src={currentPageData.imageUrl} alt={`Story illustration ${currentPage + 1}`} fill className="object-cover rounded-lg" priority />}</div>

                {/* Text */}
                <div className="flex items-center">
                  <p className="text-lg leading-relaxed">{currentPageData.text}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentPage === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Page
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {pages.length}
            </span>
            <Button onClick={handleNext} disabled={currentPage === pages.length - 1}>
              Next Page
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
