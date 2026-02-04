import { Search, Filter, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterConfig[];
  children?: React.ReactNode;
  // Apply button pattern
  showApplyButton?: boolean;
  onApply?: () => void;
  onClear?: () => void;
  hasChanges?: boolean;
  appliedFiltersCount?: number;
  helperText?: string;
}

export function FilterBar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  children,
  showApplyButton = false,
  onApply,
  onClear,
  hasChanges = false,
  appliedFiltersCount = 0,
  helperText,
}: FilterBarProps) {
  return (
    <div className="space-y-3 mb-6">
      <div className="filter-bar">
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
        
        <div className="flex items-center gap-2">
          {showApplyButton && (
            <>
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
              {onApply && (
                <Button
                  onClick={onApply}
                  size="sm"
                  disabled={!hasChanges}
                  className={cn(
                    "min-w-[100px]",
                    hasChanges && "animate-pulse"
                  )}
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Apply Filters
                </Button>
              )}
            </>
          )}
          {children}
        </div>
      </div>
      
      {helperText && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{helperText}</span>
          {appliedFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {appliedFiltersCount} filter{appliedFiltersCount !== 1 ? 's' : ''} applied
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
