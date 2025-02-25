export interface Option {
  name: string;
  description: string;
  emoji: string;
  visualStyle?: string;
  traits?: string[];
  example?: string;
}

export interface OptionProps {
  option: Option;
  onSelect: (option: Option) => void;
  isSelected: boolean;
}

export interface OptionsGeneratorProps {
  prompt: string;
  onSelect: (option: Option) => void;
  selectedOption: Option | null;
}
