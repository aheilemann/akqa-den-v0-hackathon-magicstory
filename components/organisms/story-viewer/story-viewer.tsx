"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Story } from "@/components/organisms/story-list/story-list";
import { motion, AnimatePresence } from "framer-motion";

type StoryPage = {
  text: string;
  imagePrompt: string;
  imageUrl?: string;
};

type StoryViewerProps = {
  story: Story & {
    continuations: Array<{
      story_continuation_id: string;
      story_continuation_content: {
        title: string;
        pages: StoryPage[];
        summary: string;
      };
      story_continuation_type: string;
      story_continuation_created_at: string;
    }>;
  };
};

type SegmentInfo = {
  type: "original" | "continuation";
  title: string;
  startPage: number;
  endPage: number;
  content: {
    summary: string;
    pages: StoryPage[];
  };
};

export function StoryViewer({ story }: StoryViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Combine all pages and create segment information
  const { allPages, segments } = useMemo(() => {
    const segments: SegmentInfo[] = [];
    let allPages: StoryPage[] = [];
    let pageCount = 0;

    // Add original story
    segments.push({
      type: "original",
      title: story.story_title,
      startPage: 0,
      endPage: story.story_content.pages.length - 1,
      content: {
        summary: story.story_content.summary,
        pages: story.story_content.pages,
      },
    });
    allPages = [...story.story_content.pages];
    pageCount += story.story_content.pages.length;

    // Add continuations
    story.continuations.forEach((continuation) => {
      const startPage = pageCount;
      const pages = continuation.story_continuation_content.pages;
      segments.push({
        type: "continuation",
        title: continuation.story_continuation_content.title,
        startPage,
        endPage: startPage + pages.length - 1,
        content: {
          summary: continuation.story_continuation_content.summary,
          pages,
        },
      });
      allPages = [...allPages, ...pages];
      pageCount += pages.length;
    });

    return { allPages, segments };
  }, [story]);

  // Get current segment based on page number
  const getCurrentSegment = () => {
    return segments.find((segment) => currentPage >= segment.startPage && currentPage <= segment.endPage)!;
  };

  const currentSegment = getCurrentSegment();
  const currentPageData = allPages[currentPage];

  const handleNext = () => {
    if (currentPage < allPages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleJumpToSegment = (startPage: number) => {
    setCurrentPage(startPage);
  };

  return (
    <main className="flex-1 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Story Navigation */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {segments.map((segment, index) => (
              <Button key={index} variant={currentPage >= segment.startPage && currentPage <= segment.endPage ? "default" : "outline"} onClick={() => handleJumpToSegment(segment.startPage)} className="whitespace-nowrap">
                {segment.type === "original" ? "Original Story" : `Continuation ${index}`}
              </Button>
            ))}
          </div>

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{currentSegment.title}</h1>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-8">
          <div className="bg-primary rounded-full h-2 transition-all duration-300" style={{ width: `${((currentPage + 1) / allPages.length) * 100}%` }} />
        </div>

        {/* Story Page */}
        <Card className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={currentPage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="relative h-[400px] w-full">{currentPageData.imageUrl && <Image src={currentPageData.imageUrl} alt={`Story illustration ${currentPage + 1}`} fill className="object-cover rounded-lg" priority />}</div>

                {/* Text */}
                <div className="flex items-center min-h-[400px]">
                  <p className="text-lg leading-relaxed">{currentPageData.text}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 flex-wrap gap-2">
            <Button variant="outline" onClick={handlePrevious} disabled={currentPage === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Page
            </Button>
            <span className="text-sm text-muted-foreground order-2 md:order-none">
              Page {currentPage + 1} of {allPages.length}
            </span>
            <Button onClick={handleNext} disabled={currentPage === allPages.length - 1}>
              Next Page
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
