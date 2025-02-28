"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CreatePage = () => {
  const router = useRouter();

  const nextAction = () => {
    router.push("/create/choose-theme");
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={nextAction}>Next</Button>
    </div>
  );
};

export default CreatePage;
