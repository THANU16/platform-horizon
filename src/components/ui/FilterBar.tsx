import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  name: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterConfig[];
  children?: React.ReactNode;
  // Optional clear-all
  onClear?: () => void;
  appliedFiltersCount?: number;
  helperText?: string;
  // Deprecated (kept for backward compatibility; no longer rendered)
  showApplyButton?: boolean;
  onApply?: () => void;
  hasChanges?: boolean;
}

export function FilterBar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  children,
  onClear,
  appliedFiltersCount = 0,
  helperText,
}: FilterBarProps) {
  return (
    <div className="mb-6">
      <div className="border rounded-lg bg-card p-4 space-y-3">
        {/* Search row */}
        <div className="relative max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter) => (
            <Select
              key={filter.name}
              value={filter.value}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                {filter.icon && <span className="mr-2">{filter.icon}</span>}
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
          {children}

          <div className="flex-1" />

          {onClear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {(helperText || appliedFiltersCount > 0) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {helperText && <span>{helperText}</span>}
            {appliedFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {appliedFiltersCount} filter{appliedFiltersCount !== 1 ? "s" : ""} applied
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
