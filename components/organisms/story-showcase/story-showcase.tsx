import { getStories } from "@/app/actions";
import { StoryList } from "../story-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const StoryShowcase = async () => {
  const stories = await getStories();

  if (!stories.length) {
    console.log("No stories found");
    return <></>;
  }

  return (
    <section className="py-16 px-6 2xl:px-0 max-w-7xl mx-auto w-full space-y-8">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 lg:gap-2 w-full">
        <div>
          <h3 className="text-2xl font-semibold tracking-tighter">
            Explore the stories
          </h3>
          <p className="text-muted-foreground tracking-tight">
            Get inspired by the latest stories created by our users
          </p>
        </div>

        <Button variant="outline" asChild size="lg">
          <Link
            href="/create"
            className="text-sm text-muted-foreground flex gap-1 items-center group"
          >
            Get started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </div>

      <StoryList
        stories={stories}
        rowCount={{ sm: 2, md: 4, lg: 4 }}
        hideHeadline
        showButtons={false}
      />
    </section>
  );
};

export { StoryShowcase };
