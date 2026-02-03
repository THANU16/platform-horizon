import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    name: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }[];
  children?: React.ReactNode;
}

export function FilterBar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  children,
}: FilterBarProps) {
  return (
    <div className="filter-bar mb-6">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        {filters.map((filter) => (
          <Select
            key={filter.name}
            value={filter.value}
            onValueChange={filter.onChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={filter.placeholder || filter.name} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
