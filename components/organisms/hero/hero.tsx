"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SparklesText } from "@/components/ui/magicui/sparkles-text";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] flex lg:items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 pt-24 lg:pt-0 xl:px-0">
        <div className="flex flex-col gap-4 items-start">
          <Badge className="w-fit bg-gray-200 text-gray-500">
            ✨Powered by AI
          </Badge>
          <h1 className="text-3xl font-semibold md:text-6xl mb-6 tracking-tighter max-w-xl">
            Create and bring children's stories to life
            <div className="inline-block ms-2">
              <SparklesText text="with AI" />
            </div>
          </h1>
        </div>

        <p className="text-base md:text-md text-muted-foreground max-w-xl">
          Transform your ideas into interactive digital stories in minutes.
          Easily create immersive magical stories with custom characters and
          professional narration — all with a few simple clicks. Perfect for
          parents, teachers, and storytellers.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/create">Get started</Link>
        </Button>
      </div>
    </section>
  );
};

export { Hero };
