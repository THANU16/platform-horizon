import { Search, X, AlertCircle } from "lucide-react";
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
  icon?: React.ReactNode;
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
  // Determine if we need Apply button (search + at least one filter, or multiple filters)
  const needsApplyButton = showApplyButton || filters.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && hasChanges && onApply) {
      onApply();
    }
  };

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
            onKeyDown={handleKeyDown}
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
          
          {/* Spacer to push Apply button to the right */}
          <div className="flex-1" />
          
          {needsApplyButton && (
            <div className="flex items-center gap-2">
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
                  className="min-w-[80px]"
                >
                  Apply
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Pending changes message */}
        {hasChanges && (
          <div className="flex items-center gap-2 text-sm text-warning">
            <AlertCircle className="w-4 h-4" />
            <span>Pending changes. Click Apply or press Enter.</span>
          </div>
        )}
        
        {/* Helper text and applied filters count */}
        {!hasChanges && (helperText || appliedFiltersCount > 0) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {helperText && <span>{helperText}</span>}
            {appliedFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {appliedFiltersCount} filter{appliedFiltersCount !== 1 ? 's' : ''} applied
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
