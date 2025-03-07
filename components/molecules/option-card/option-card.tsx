"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { type Option } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface OptionCardProps {
  option: Option;
  onSelectAction: (option: Option) => void;
  isSelected: boolean;
}

const OptionCard = ({
  option,
  onSelectAction,
  isSelected,
}: OptionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      // className="h-[200px]"
    >
      <Button
        variant="ghost"
        className={`w-full h-full p-0 transition-all duration-200 ${
          isSelected
            ? "bg-primary/5 shadow-[0_0_0_1px] shadow-primary"
            : "hover:bg-accent"
        }`}
        onClick={() => onSelectAction(option)}
      >
        <Card className="border-0 w-full h-full">
          <CardHeader className="text-center pb-2">
            <div className="text-4xl mb-2">{option.emoji}</div>
            <h3 className="font-semibold text-lg">
              {option.name}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-normal">
              {option.description}
            </p>
          </CardContent>
        </Card>
      </Button>
    </motion.div>
  );
};

const SkeletonCard = () => {
  return (
    <div className="h-[180px]">
      <Card className="w-full h-full">
        <CardHeader className="text-center pb-2">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-2" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[2.5rem] w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export { OptionCard, SkeletonCard, type OptionCardProps };
