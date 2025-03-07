"use client";

import { useState, useEffect } from "react";
import { type Option } from "@/lib/types";
import { OptionCard, SkeletonCard } from "@/components/molecules/option-card";

interface OptionsGeneratorProps {
  prompt: string;
  onSelect: (option: Option) => void;
  selectedOption: Option | null;
}

const OptionsGenerator = ({
  prompt,
  onSelect,
  selectedOption,
}: OptionsGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    generateOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  const generateOptions = async () => {
    try {
      const response = await fetch("/api/generate-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate options");

      const { success, options } = await response.json();
      if (success && Array.isArray(options)) {
        setOptions(options);
      }
    } catch (error) {
      console.error("Error generating options:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {options.map((option, index) => (
        <OptionCard
          key={index}
          option={option}
          onSelectAction={onSelect}
          isSelected={selectedOption?.name === option.name}
        />
      ))}
    </div>
  );
};

export { OptionsGenerator, type OptionsGeneratorProps };
