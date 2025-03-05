"use client";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const ChooseStartStory = () => {
  const router = useRouter();

  const handleStartWithDrawing = () => {
    router.push("/create/image");
  };

  const handleStartWithoutDrawing = () => {
    router.push("/create/story");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex flex-col justify-between items-center mb-4">
            <h2 className="w-full text-2xl font-bold tracking-tighter">
              Do you want to start your story with a drawing?
            </h2>
            <p className="w-full text-muted-foreground">
              Please choose how you want to start your story
            </p>
          </div>
        </div>

        <div className="flex flex-row w-fll gap-6 min-h-60">
          <Card
            className="flex justify-center items-center w-full cursor-pointer hover:bg-gray-100"
            onClick={handleStartWithDrawing}
          >
            <div>
              <h4 className="text-xl tracking-tighter">Yes, please!</h4>
            </div>
          </Card>

          <Card
            className="flex justify-center items-center w-full cursor-pointer hover:bg-gray-100"
            onClick={handleStartWithoutDrawing}
          >
            <div>
              <h4 className="text-xl tracking-tighter">No, thanks</h4>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export { ChooseStartStory };
