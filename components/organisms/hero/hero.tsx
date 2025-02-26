import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] flex lg:items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>

      {/* Overlay - more subtle */}
      <div className="absolute inset-0 bg-black/30 w-full h-full" />

      {/* Content */}
      <div className="relative z-10 text-white w-full max-w-5xl px-6 pt-24 lg:pt-0 lg:px-0">
        <div className="flex flex-col gap-4 items-start">
          <Badge className="w-fit">✨Powered by AI</Badge>
          <h1 className="text-3xl md:text-6xl mb-6 tracking-tighter max-w-xl">
            Create and bring children's stories to life with AI
          </h1>
        </div>

        <p className="text-base md:text-md text-gray-100 max-w-xl">
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
