import { Option } from "@/lib/types";
import { OptionCard } from "../option-card";

interface OptionsStaticProps {
  options: Option[];
  onSelect: (option: Option) => void;
  selectedOption: Option | null;
}
const OptionsStatic = ({
  options,
  onSelect,
  selectedOption,
}: OptionsStaticProps) => {
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

export { OptionsStatic, type OptionsStaticProps };
