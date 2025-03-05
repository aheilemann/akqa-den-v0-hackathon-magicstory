import { FeaturesShowcase } from "@/components/organisms/features-showcase/features-showcase";
import { Hero } from "@/components/organisms/hero";
import { Marquee } from "@/components/organisms/marquee/marquee";
import { StoryShowcase } from "@/components/organisms/story-showcase";

export default async function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <StoryShowcase />
      <FeaturesShowcase />
    </>
  );
}
